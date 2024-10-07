/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <jsi/jsi.h>
#include <optional>

namespace facebook::react {

class JsErrorHandler {
 public:
  struct ParsedError {
    struct StackFrame {
      std::optional<std::string> file;
      std::string methodName;
      std::optional<int> lineNumber;
      std::optional<int> column;
    };

    std::string message;
    std::optional<std::string> originalMessage;
    std::optional<std::string> name;
    std::optional<std::string> componentStack;
    std::vector<StackFrame> stack;
    int id;
    bool isFatal;
    jsi::Object extraData;
  };

  using OnJsError =
      std::function<void(jsi::Runtime& runtime, const ParsedError& error)>;

  explicit JsErrorHandler(OnJsError onJsError);
  ~JsErrorHandler();

  void handleFatalError(jsi::Runtime& runtime, jsi::JSError& error);
  bool hasHandledFatalError();
  void setRuntimeReady();
  bool isRuntimeReady();
  void notifyOfFatalError();

 private:
  /**
   * This callback:
   * 1. Shouldn't retain the ReactInstance. So that we don't get retain cycles.
   * 2. Should be implemented by something that can outlive the react instance
   *    (both before init and after teardown). So that errors during init and
   *    teardown get reported properly.
   **/
  OnJsError _onJsError;
  bool _hasHandledFatalError;
  bool _isRuntimeReady{};
};

} // namespace facebook::react
