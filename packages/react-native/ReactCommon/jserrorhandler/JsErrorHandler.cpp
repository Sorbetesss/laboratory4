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

jsi::Value toJSIValue(
    jsi::Runtime& runtime,
    const std::optional<std::string>& str) {
  return str ? jsi::String::createFromUtf8(runtime, *str) : jsi::Value::null();
}

jsi::Value toJSIValue(jsi::Runtime& runtime, const std::optional<int>& num) {
  return num ? jsi::Value(*num) : jsi::Value::null();
}
} // namespace

namespace facebook::react {

JsErrorHandler::JsErrorHandler(JsErrorHandler::OnJsError onJsError)
    : _onJsError(std::move(onJsError)),
      _hasHandledFatalError(false){

      };

JsErrorHandler::~JsErrorHandler() {}

void JsErrorHandler::handleError(
    jsi::Runtime& runtime,
    jsi::JSError& error,
    bool isFatal) {
  // TODO: Current error parsing works and is stable. Can investigate using
  // REGEX_HERMES to get additional Hermes data, though it requires JS setup
  if (_isRuntimeReady) {
    if (isFatal) {
      _hasHandledFatalError = true;
    }

    try {
      handleJSError(runtime, error, isFatal);
      return;
    } catch (jsi::JSError& e) {
      LOG(ERROR)
          << "JsErrorHandler: Failed to report js error using js pipeline. Using C++ pipeline instead."
          << std::endl
          << "Reporting failure: " << e.getMessage() << std::endl
          << "Original js error: " << error.getMessage() << std::endl;
    }
  }

  emitError(runtime, error, isFatal);
}

void JsErrorHandler::emitError(
    jsi::Runtime& runtime,
    jsi::JSError& error,
    bool isFatal) {
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

  auto data = jsi::Object(runtime);
  data.setProperty(runtime, "message", message);
  data.setProperty(
      runtime, "originalMessage", toJSIValue(runtime, originalMessage));
  data.setProperty(runtime, "name", toJSIValue(runtime, name));
  data.setProperty(
      runtime, "componentStack", toJSIValue(runtime, componentStack));

  auto isHermes = runtime.global().hasProperty(runtime, "HermesInternal");
  auto stackFrames = StackTraceParser::parse(isHermes, error.getStack());

  auto stack = jsi::Array(runtime, stackFrames.size());
  for (size_t i = 0; i < stackFrames.size(); i++) {
    auto& frame = stackFrames[i];
    auto stackFrame = jsi::Object(runtime);
    auto file = toJSIValue(runtime, frame.file);
    auto lineNumber = toJSIValue(runtime, frame.lineNumber);
    auto column = toJSIValue(runtime, frame.column);

    stackFrame.setProperty(runtime, "file", file);
    stackFrame.setProperty(runtime, "methodName", frame.methodName);
    stackFrame.setProperty(runtime, "lineNumber", lineNumber);
    stackFrame.setProperty(runtime, "column", column);
    stack.setValueAtIndex(runtime, i, stackFrame);
  }

  data.setProperty(runtime, "stack", stack);

  auto id = nextExceptionId();
  data.setProperty(runtime, "id", id);
  data.setProperty(runtime, "isFatal", isFatal);
  data.setProperty(runtime, "extraData", extraData);

  auto isComponentErrorValue =
      errorObj.getProperty(runtime, "isComponentError");
  auto isComponentError =
      isComponentErrorValue.isBool() && isComponentErrorValue.getBool();
  data.setProperty(runtime, "isComponentError", isComponentError);

  bool shouldPreventDefault = false;
  auto preventDefault = jsi::Function::createFromHostFunction(
      runtime,
      jsi::PropNameID::forAscii(runtime, "preventDefault"),
      0,
      [&shouldPreventDefault](
          jsi::Runtime& rt,
          const jsi::Value& thisVal,
          const jsi::Value* args,
          size_t count) {
        shouldPreventDefault = true;
        return jsi::Value::undefined();
      });

  data.setProperty(runtime, "preventDefault", preventDefault);

  for (auto& errorListener : _errorListeners) {
    errorListener(runtime, jsi::Value(runtime, data));
  }

  if (shouldPreventDefault) {
    return;
  }

  if (isFatal) {
    _hasHandledFatalError = true;
  }

  ParsedError parsedError = {
      .message = message,
      .originalMessage = originalMessage,
      .name = name,
      .componentStack = componentStack,
      .stack = stackFrames,
      .id = id,
      .isFatal = isFatal,
      .extraData = std::move(extraData),
  };

  _onJsError(runtime, parsedError);
}

void JsErrorHandler::registerErrorListener(
    const std::function<void(jsi::Runtime&, jsi::Value)>& errorListener) {
  _errorListeners.push_back(errorListener);
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
