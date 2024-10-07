/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @generated by enums.py
// clang-format off
#pragma once

#include <cstdint>
#include <yoga/YGEnums.h>
#include <yoga/enums/YogaEnums.h>

namespace facebook::yoga {

enum class BoxSizing : uint8_t {
  BorderBox = YGBoxSizingBorderBox,
  ContentBox = YGBoxSizingContentBox,
};

template <>
constexpr int32_t ordinalCount<BoxSizing>() {
  return 2;
}

constexpr BoxSizing scopedEnum(YGBoxSizing unscoped) {
  return static_cast<BoxSizing>(unscoped);
}

constexpr YGBoxSizing unscopedEnum(BoxSizing scoped) {
  return static_cast<YGBoxSizing>(scoped);
}

inline const char* toString(BoxSizing e) {
  return YGBoxSizingToString(unscopedEnum(e));
}

} // namespace facebook::yoga
