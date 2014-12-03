'use strict';

var serve = require('koa-static-cache'),
  request = require('supertest'),
  assert = require('assert'),
  equal = assert.deepEqual,
  noCache = require('..'),
  koa = require('koa'),
  app = koa();

describe('# koa-no-cache', function() {
  app.use(noCache({
    paths: ['/api/status', '/users/(.*)'],
    types: ['manifest']
  }));
  app.use(serve('test'));
  app.use(function * () {
    this.body = 'test';
  });

  describe('types', function() {
    it('manifest', function(done) {
      request(app.listen())
        .get('/cache.manifest')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, true);
          done();
        });
    });

    it('javascript', function(done) {
      request(app.listen())
        .get('/index.js')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, false);
          done();
        });
    });
  });

  describe('paths', function() {
    it('/api/status', function(done) {
      request(app.listen())
        .get('/api/status')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, true);
          done();
        });
    });

    it('/users/haoxin', function(done) {
      request(app.listen())
        .get('/users/haoxin')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, true);
          done();
        });
    });

    it('/cache', function(done) {
      request(app.listen())
        .get('/cache')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, false);
          done();
        });
    });
  });
});


function assertError(e) {
  if (e) console.error(e);

  assert(!e, 'error exist');
}

function assertRes(res, noCache) {
  equal(res.status, 200);
  assert(res.text);

  if (noCache) {
    equal(res.headers['cache-control'], 'no-store, no-cache, must-revalidate');
    equal(res.headers.pragma, 'no-cache');
    equal(res.headers.expires, '0');
  }
}
