'use strict';

const pathToRegExp = require('path-to-regexp');
const typeis = require('type-is').is;

function setNoCacheHeaders(ctx) {
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  ctx.set('Pragma', 'no-cache');
  ctx.set('Expires', 0);
}

module.exports = function noCache(options) {
  options = options || {};
  options.global = Boolean(options.global);

  const paths = options.paths || [];
  const types = options.types || [];
  const config = options.config || {
    sensitive: true,
    strict: true
  };

  const pathsFinal = paths.map(path => pathToRegExp(path, [], config));

  if (options.global) {
    return async function noCacheForAll(ctx, next) {
      await next();
      setNoCacheHeaders(ctx);
    };
  }

  // only load modules if needed
  return async function noCache(ctx, next) {
    await next();
      if (typeis(ctx.type, types) || pathsFinal.some(pathFinal => pathFinal.exec(ctx.path))) {
        setNoCacheHeaders(ctx);
    }
  };
};
