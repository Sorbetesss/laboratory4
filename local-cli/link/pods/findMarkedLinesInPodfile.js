/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

module.exports = function findMarkedLinesInPodfile(podLines, markerText) {
  const result = [];
  for (let i = 0, len = podLines.length; i < len; i++) {
    if (podLines[i].includes(markerText)) {
      result.push({ line: i + 1, indentation: podLines[i].indexOf('#') });
    }
  }
  return result;
};
