/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTEventEmitter.h"
#import "RCTAssert.h"
#import "RCTLog.h"

@implementation RCTEventEmitter
{
  NSInteger _listenerCount;
}

+ (NSString *)moduleName
{
  return @"";
}

- (NSArray<NSString *> *)supportedEvents
{
  return nil;
}

- (void)sendEventWithName:(NSString *)eventName body:(id)body
{
  RCTAssert(self.bridge != nil, @"bridge is not set.");

  if (RCT_DEBUG && ![[self supportedEvents] containsObject:eventName]) {
    RCTLogError(@"`%@` is not a supported event type for %@", eventName, [self class]);
  }
  [self.bridge enqueueJSCall:@"RCTDeviceEventEmitter.emit"
                        args:body ? @[eventName, body] : @[eventName]];
}

- (void)startObserving
{
  // Does nothing
}

- (void)stopObserving
{
  // Does nothing
}

- (void)dealloc
{
  if (_listenerCount > 0) {
    [self stopObserving];
  }
}

RCT_EXPORT_METHOD(addListener:(NSString *)eventName)
{
  if (RCT_DEBUG && ![[self supportedEvents] containsObject:eventName]) {
    RCTLogError(@"`%@` is not a supported event type for %@", eventName, [self class]);
  }
  if (_listenerCount == 0) {
    [self startObserving];
  }
  _listenerCount++;
}

RCT_EXPORT_METHOD(removeListeners:(NSInteger)count)
{
  RCTAssert(count <= _listenerCount, @"Attempted to remove more listeners than added");
  if (count == _listenerCount) {
    [self stopObserving];
  }
  _listenerCount -= count;
}

@end
