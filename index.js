'use strict';

module.exports = noCache;

function setNoCacheHeaders(ctx) {
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  ctx.set('Pragma', 'no-cache');
  ctx.set('Expires', 0);
}

function noCache(options) {
  options = options || {};
  var paths = options.paths || [],
    types = options.types || [],
    global = options.global || false,
    config = options.config || {
      sensitive: true,
      strict: true
    };

  if (options.global) {
    return function * noCache(next) {
      yield * next;
      setNoCacheHeaders(this);
    };
  } else {
    // only load modules if needed
    var pathToRegExp = require('path-to-regexp'),
      typeis = require('type-is').is;

    return function * noCache(next) {
      yield * next;

      if (typeis(this.type, types) || match(this.path)) {
        setNoCacheHeaders(this);
      }
    };
  }

  function match(path) {
    for (var i = 0; i < paths.length; i++) {
      if (pathToRegExp(paths[i], [], config).exec(path)) return true;
    }
  }
}
