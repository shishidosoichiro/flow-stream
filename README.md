# flow-stream

Simple map function for stream

```js
fs.createreadstream('user.csv')
.pipe(csv({headers: true}))
.pipe(flow(template('template/user.ldif.hbs')))
.pipe(fs.createWriteStream('dest/user.ldif'))
```
