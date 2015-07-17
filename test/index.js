'use strict';

const serve = require('koa-static-cache');
const request = require('supertest');
const assert = require('assert');
const equal = assert.deepEqual;
const noCache = require('..');
const koa = require('koa');

const globalNoCacheApp = koa();
const app = koa();

describe('# koa-no-cache', function() {
  app.use(noCache({
    paths: ['/api/status', '/users/(.*)'],
    types: ['manifest']
  }));
  app.use(serve('test'));
  app.use(function* () {
    this.body = 'test';
  });

  globalNoCacheApp.use(noCache({
    global: true
  }));
  globalNoCacheApp.use(serve('test'));
  globalNoCacheApp.use(function* () {
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

  describe('global', function() {
    it('manifest', function(done) {
      request(globalNoCacheApp.listen())
        .get('/cache.manifest')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, true);
          done();
        });
    });

    it('javascript', function(done) {
      request(globalNoCacheApp.listen())
        .get('/index.js')
        .end(function(err, res) {
          assertError(err);
          assertRes(res, true);
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
