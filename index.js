'use strict';

var pathToRegExp = require('path-to-regexp'),
  typeis = require('type-is').is;

module.exports = noCache;

function noCache(options) {
  options = options || {};
  var paths = options.paths || [],
    types = options.types || [],
    config = options.config || {
      sensitive: true,
      strict: true,
    };

  return function * noCache(next) {
    yield * next;

    if (typeis(this.type, types) || match(this.path)) {
      this.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      this.set('Pragma', 'no-cache');
      this.set('Expires', 0);
    }
  };

  function match(path) {
    for (var i = 0; i < paths.length; i++) {
      if (pathToRegExp(paths[i], [], config).exec(path)) return true;
    }
  }
}
