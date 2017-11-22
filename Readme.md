[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### koa-no-cache
no cache for koa apps

### example

#### Adding no cache header on some paths or types

```js
var noCache = require('koa-no-cache'),
  Koa = require('koa'),
  app = new Koa();

app.use(noCache({
  paths: ['/users/(.*)'],
  types: ['manifest']
}));
```

* [paths](https://github.com/pillarjs/path-to-regexp)
* [types](https://github.com/jshttp/type-is)


#### Adding no cache header globally

```js
var noCache = require('koa-no-cache'),
  Koa = require('koa'),
  app = new Koa();

app.use(noCache({
  global: true
}));
```

### License
MIT

[npm-img]: https://img.shields.io/npm/v/koa-no-cache.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-no-cache
[travis-img]: https://img.shields.io/travis/coderhaoxin/koa-no-cache.svg?style=flat-square
[travis-url]: https://travis-ci.org/coderhaoxin/koa-no-cache
[coveralls-img]: https://img.shields.io/coveralls/coderhaoxin/koa-no-cache.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/coderhaoxin/koa-no-cache?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/coderhaoxin/koa-no-cache.svg?style=flat-square
[david-url]: https://david-dm.org/coderhaoxin/koa-no-cache
