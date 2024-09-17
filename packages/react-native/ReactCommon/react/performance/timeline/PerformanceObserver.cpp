/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "PerformanceObserver.h"
#include "PerformanceObserverRegistry.h"
#include "PerformanceEntryReporter.h"

namespace facebook::react {

PerformanceObserver::~PerformanceObserver() {
  if (auto registry = registry_.lock()) {
    registry->removeObserver(*this);
  }
}

void PerformanceObserver::handleEntry(const facebook::react::PerformanceEntry& entry) {
  // https://w3c.github.io/performance-timeline/#takerecords-method (step 7.1)
  // https://www.w3.org/TR/event-timing/#should-add-performanceeventtiming
  if (entry.entryType == PerformanceEntryType::EVENT) {
    if (entry.duration < durationThreshold_) {
      // The entries duration is lower than the desired reporting threshold, skip
      return;
    }
  }

  if (observedTypes_.contains(entry.entryType)) {
    buffer_.push_back(entry);
  }
}

std::vector<PerformanceEntry> PerformanceObserver::takeRecords() {
  std::vector<PerformanceEntry> result;
  buffer_.swap(result);
  return result;
}

void PerformanceObserver::observe(PerformanceEntryType type, PerformanceObserverObserveSingleOptions options) {
  // we assume that `type` was checked on JS side and is correct
  observedTypes_.clear();
  observedTypes_.insert(type);

  durationThreshold_ = options.durationThreshold;

  requiresDroppedEntries_ = true;

  if (options.buffered) {
    auto& reporter = PerformanceEntryReporter::getInstance();
    reporter->getBuffer(type).getEntries(std::nullopt, buffer_);
    scheduleFlushBuffer();
  }
}

void PerformanceObserver::observe(std::unordered_set<PerformanceEntryType> types, PerformanceObserverObserveMultipleOptions options) {
  observedTypes_ = std::move(types);
  requiresDroppedEntries_ = false;
  durationThreshold_ = options.durationThreshold;
}

double PerformanceObserver::getDroppedEntriesCount() {
  double droppedEntriesCount = 0;

  if (requiresDroppedEntries_) {
    auto reporter = PerformanceEntryReporter::getInstance();

    for (auto& entry : observedTypes_) {
      droppedEntriesCount += reporter->getBuffer(entry).droppedEntriesCount;
    }

    requiresDroppedEntries_ = false;
  }

  return droppedEntriesCount;
}

void PerformanceObserver::scheduleFlushBuffer() {
  if (!callback_) {
    return;
  }

  if (!didScheduleFlushBuffer) {
    didScheduleFlushBuffer = true;

    callback_();
  }
}

} // namespace facebook::react
