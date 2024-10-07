/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "JsErrorHandler.h"
#include <cxxreact/ErrorUtils.h>
#include <glog/logging.h>
#include <jserrorhandler/StackTraceParser.h>
#include <string>

using namespace facebook;

namespace {
int nextExceptionId() {
  static int exceptionId = 0;
  return exceptionId++;
}

bool isNull(jsi::Runtime& runtime, const jsi::Value& value) {
  return jsi::Value::strictEquals(runtime, value, jsi::Value::null()) ||
      jsi::Value::strictEquals(runtime, value, jsi::Value::undefined());
}

bool isEmptyString(jsi::Runtime& runtime, const jsi::Value& value) {
  return jsi::Value::strictEquals(
      runtime, value, jsi::String::createFromUtf8(runtime, ""));
}

std::string toCppString(jsi::Runtime& runtime, const jsi::Value& value) {
  return value.toString(runtime).utf8(runtime);
}
} // namespace

namespace facebook::react {

JsErrorHandler::JsErrorHandler(JsErrorHandler::OnJsError onJsError)
    : _onJsError(std::move(onJsError)),
      _hasHandledFatalError(false){

      };

JsErrorHandler::~JsErrorHandler() {}

void JsErrorHandler::handleFatalError(
    jsi::Runtime& runtime,
    jsi::JSError& error) {
  // TODO: Current error parsing works and is stable. Can investigate using
  // REGEX_HERMES to get additional Hermes data, though it requires JS setup.
  _hasHandledFatalError = true;

  if (_isRuntimeReady) {
    try {
      handleJSError(runtime, error, true);
      return;
    } catch (jsi::JSError& e) {
      LOG(ERROR)
          << "JsErrorHandler: Failed to report js error using js pipeline. Using C++ pipeline instead."
          << std::endl
          << "Reporting failure: " << e.getMessage() << std::endl
          << "Original js error: " << error.getMessage() << std::endl;
    }
  }

  auto message = error.getMessage();
  auto errorObj = error.value().getObject(runtime);
  auto componentStackValue = errorObj.getProperty(runtime, "componentStack");
  if (!isNull(runtime, componentStackValue)) {
    message += "\n" + toCppString(runtime, componentStackValue);
  }

  auto nameValue = errorObj.getProperty(runtime, "name");
  auto name = (isNull(runtime, nameValue) || isEmptyString(runtime, nameValue))
      ? std::nullopt
      : std::optional(toCppString(runtime, nameValue));

  if (name && !message.starts_with(*name + ": ")) {
    message = *name + ": " + message;
  }

  auto jsEngineValue = errorObj.getProperty(runtime, "jsEngine");

  if (!isNull(runtime, jsEngineValue)) {
    message += ", js engine: " + toCppString(runtime, jsEngineValue);
  }

  // TODO: What about spreading in decoratedExtraDataKey?
  auto extraData = jsi::Object(runtime);
  extraData.setProperty(runtime, "jsEngine", jsEngineValue);
  extraData.setProperty(runtime, "rawStack", error.getStack());

  auto cause = errorObj.getProperty(runtime, "cause");
  if (!isNull(runtime, cause) && cause.isObject()) {
    auto stackSymbols =
        cause.asObject(runtime).getProperty(runtime, "stackSymbols");
    extraData.setProperty(runtime, "stackSymbols", stackSymbols);

    auto stackReturnAddresses =
        cause.asObject(runtime).getProperty(runtime, "stackReturnAddresses");
    extraData.setProperty(
        runtime, "stackReturnAddresses", stackReturnAddresses);

    auto stackElements =
        cause.asObject(runtime).getProperty(runtime, "stackElements");
    extraData.setProperty(runtime, "stackElements", stackElements);
  }

  auto originalMessage = message == error.getMessage()
      ? std::nullopt
      : std::optional(error.getMessage());

  auto componentStack = !componentStackValue.isString()
      ? std::nullopt
      : std::optional(componentStackValue.asString(runtime).utf8(runtime));

  auto isHermes = runtime.global().hasProperty(runtime, "HermesInternal");
  auto stackFrames = StackTraceParser::parse(isHermes, error.getStack());

  auto id = nextExceptionId();

  ParsedError parsedError = {
      .message = message,
      .originalMessage = originalMessage,
      .name = name,
      .componentStack = componentStack,
      .stack = stackFrames,
      .id = id,
      .isFatal = true,
      .extraData = std::move(extraData),
  };

  _onJsError(runtime, parsedError);
}

bool JsErrorHandler::hasHandledFatalError() {
  return _hasHandledFatalError;
}

void JsErrorHandler::setRuntimeReady() {
  _isRuntimeReady = true;
}

bool JsErrorHandler::isRuntimeReady() {
  return _isRuntimeReady;
}

void JsErrorHandler::notifyOfFatalError() {
  _hasHandledFatalError = true;
}

} // namespace facebook::react
