/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const normalizeProjectName = require('./normalizeProjectName');

module.exports = function makeBuildPatch(name) {
  const normalizedProjectName = normalizeProjectName(name);
  const installPattern = new RegExp(
    `\\s{4}(api)(\\(|\\s)(project)\\(\\\':${normalizedProjectName}\\\'\\)(\\)|\\s)`
  );

  return {
    installPattern,
    pattern: /[^ \t]dependencies {\n/,
    patch: `    api project(':${normalizedProjectName}')\n`
  };
};
