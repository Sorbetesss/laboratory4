/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsireact/JSIExecutor.h>
#include <cxxreact/ReactMarker.h>

namespace facebook {
namespace react {

class JSCExecutorFactory : public JSExecutorFactory {
public:
  explicit JSCExecutorFactory(
      JSIExecutor::RuntimeInstaller runtimeInstaller)
      : runtimeInstaller_(std::move(runtimeInstaller)),
      logTaggedMarker_(nullptr) {}
   explicit JSCExecutorFactory(
      JSIExecutor::RuntimeInstaller runtimeInstaller,
      ReactMarker::LogTaggedMarker logTaggedMarker)
      : runtimeInstaller_(std::move(runtimeInstaller)),
      logTaggedMarker_(logTaggedMarker) {}

  std::unique_ptr<JSExecutor> createJSExecutor(
      std::shared_ptr<ExecutorDelegate> delegate,
      std::shared_ptr<MessageQueueThread> jsQueue) override;

private:
  JSIExecutor::RuntimeInstaller runtimeInstaller_;
  ReactMarker::LogTaggedMarker logTaggedMarker_;
};

} // namespace react
} // namespace facebook
