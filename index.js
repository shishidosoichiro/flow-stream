'use strict';

var map = require('map-stream');
var flow = require('flow');

var slice = function(array, begin, end){
	return Array.prototype.slice.call(array, begin, end);
};

var data = module.exports = function(callbacks){
	callbacks = slice(arguments);
	callbacks = flow(callbacks);

	return map(function(data, next){
		var resolve = function(data){
			next(null, data)
		};

		var res = callbacks(data);
		if (res instanceof Promise) return res.then(resolve, next);
		else return resolve(res);
	})
};
