/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#ifdef __cplusplus

#include <memory>

namespace facebook::react {

class JSExecutorFactory;

} // namespace facebook::react

#endif // __cplusplus

#import <React/RCTBridgeDelegate.h>

// This is a separate class so non-C++ implementations don't need to
// take a C++ dependency.

@protocol RCTCxxBridgeDelegate <RCTBridgeDelegate>

#ifdef __cplusplus
/**
 * In the RCTCxxBridge, if this method is implemented, return a
 * ExecutorFactory instance which can be used to create the executor.
 * If not implemented, or returns an empty pointer, JSIExecutorFactory
 * will be used with a JSCRuntime.
 */
- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge;
#endif // __cplusplus

@end
