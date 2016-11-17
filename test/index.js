'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var es = require('event-stream');

var flow = require('../');

describe('flow-stream', function(){

	it('should give data only to callback.', function(done){
		var i = 0;
		var j = 0;
		es.readArray(['123', '456'])
		.pipe(flow(function(data){
			if (i === 0) data.should.equal('123');
			else         data.should.equal('456');
			i++;
			return {data: data}
		}, function(data){
			if (j === 0) data.data.should.equal('123');
			else         data.data.should.equal('456');
			j++;
			return data
		}))
		.on('end', done)
	});

	it('should receive promise from callback.', function(done){
		var i = 0;
		var j = 0;
		es.readArray(['123', '456'])
		.pipe(flow(function(data){
			if (i === 0) data.should.equal('123');
			else         data.should.equal('456');
			i++;
			return new Promise(function(resolve, reject){
				resolve({data: data})
			})
		}, function(data){
			if (j === 0) data.data.should.equal('123');
			else         data.data.should.equal('456');
			j++;
			return data
		}))
		.on('end', done)
	});

	it('should emit \'error\', if callback return rejected Promise.', function(done){
		var i = 0;
		es.readArray(['123', '456'])
		.pipe(flow(function(data){
			return new Promise(function(resolve, reject){
				reject({err: data})
			})
		}))
		.on('error', function(e){
			if (i === 0) e.err.should.equal('123');
			else         e.err.should.equal('456');
			i++;
			if (i === 2) done();
		})
		.pipe(es.map(function(data, next){
			done('not rejected.')
		}))
	});
});
