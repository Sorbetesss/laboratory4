/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

import type {ColorValue} from './StyleSheet';
import {DynamicColorIOSPrivate} from './PlatformColorValueTypes';

export type DynamicColorIOSTuple = {
  light: ColorValue,
  dark: ColorValue,
  accessibleLight?: ColorValue,
  accessibleDark?: ColorValue,
};

export const DynamicColorIOS = (tuple: DynamicColorIOSTuple): ColorValue => {
  return DynamicColorIOSPrivate({
    light: tuple.light,
    dark: tuple.dark,
    accessibleLight: tuple.accessibleLight,
    accessibleDark: tuple.accessibleDark,
  });
};
