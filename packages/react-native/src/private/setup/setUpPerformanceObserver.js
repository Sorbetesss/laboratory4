/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import {polyfillGlobal} from '../../../Libraries/Utilities/PolyfillFunctions';

polyfillGlobal(
  'PerformanceObserver',
  () => require('../webapis/performance/PerformanceObserver').default,
);

polyfillGlobal(
  'PerformanceObserverEntryList',
  () =>
    require('../webapis/performance/PerformanceObserver')
      .PerformanceObserverEntryList,
);

polyfillGlobal(
  'PerformanceEntry',
  () => require('../webapis/performance/PerformanceEntry').PerformanceEntry,
);

polyfillGlobal(
  'PerformanceMark',
  () => require('../webapis/performance/UserTiming').PerformanceMark,
);

polyfillGlobal(
  'PerformanceMeasure',
  () => require('../webapis/performance/UserTiming').PerformanceMeasure,
);

polyfillGlobal(
  'PerformanceEventTiming',
  () => require('../webapis/performance/EventTiming').PerformanceEventTiming,
);

polyfillGlobal(
  'TaskAttributionTiming',
  () => require('../webapis/performance/LongTasks').TaskAttributionTiming,
);

polyfillGlobal(
  'PerformanceLongTaskTiming',
  () => require('../webapis/performance/LongTasks').PerformanceLongTaskTiming,
);
