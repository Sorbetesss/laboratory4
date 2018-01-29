/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Object.es6
 * @polyfill
 * @nolint
 */

// WARNING: This is an optimized version that fails on hasOwnProperty checks
// and non objects. It's not spec-compliant. It's a perf optimization.
// This is only needed for iOS 8 and current Android JSC.

if (!(Object.assign instanceof Function)) {
  Object.assign = function(target, sources) {
    if (__DEV__) {
      if (target == null) {
        throw new TypeError('Object.assign target cannot be null or undefined');
      }
      if (typeof target !== 'object' && typeof target !== 'function') {
        throw new TypeError(
          'In this environment the target of assign MUST be an object. ' +
          'This error is a performance optimization and not spec compliant.'
        );
      }
    }

    for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
      var nextSource = arguments[nextIndex];
      if (nextSource == null) {
        continue;
      }

      if (__DEV__) {
        if (typeof nextSource !== 'object' &&
            typeof nextSource !== 'function') {
          throw new TypeError(
            'In this environment the sources for assign MUST be an object. ' +
            'This error is a performance optimization and not spec compliant.'
          );
        }
      }

      // We don't currently support accessors nor proxies. Therefore this
      // copy cannot throw. If we ever supported this then we must handle
      // exceptions and side-effects.

      // It isn't nice to force ideologies, so let's be nice here...
      // Revamped to NOT slowly walk the entire prototype chain
      
      var keys = Object.keys(nextSource);
      for (var i = 0, il = keys.length; i < il; i++) {
        var key = keys[i];
        target[key] = nextSource[key];
      }
    }

    return target;
  };
}
