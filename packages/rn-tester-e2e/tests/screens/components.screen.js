/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import {UtilsSingleton as Utils, iOSLabel} from '../helpers/utils';

// root level screen in RNTester: Components

const buttonComponentLabel = 'Button Simple React Native button component.';
const activityIndicatorComponentLabel = 'ActivityIndicator Animated loading indicators.';
const imageComponentLabel = 'Image Base component for displaying different types of images.';
const flatListComponentLabel = 'FlatList Performant, scrollable list of data.';

type ComponentsScreenType = {
  buttonComponentLabelElement: string,
  activityIndicatorComponentLabelElement: string,
  imageComponentLabelElement: string,
  flatListComponentLabelElement: string,
  checkButtonComponentIsDisplayed: () => Promise<boolean>,
  checkActivityIndicatorComponentIsDisplayed: () => Promise<boolean>,
  checkImageComponentIsDisplayed: () => Promise<boolean>,
  checkFlatListComponentIsDisplayed: () => Promise<boolean>,
  clickButtonComponent: () => Promise<void>,
  clickActivityIndicatorComponent: () => Promise<void>,
  clickImageComponent: () => Promise<void>,
  clickFlatListComponent: () => Promise<void>,
};

export const ComponentsScreen: ComponentsScreenType = {
  // Reference in the top level Component list
  buttonComponentLabelElement: Utils.platformSelect({
    ios: iOSLabel(buttonComponentLabel),
    android: `~${buttonComponentLabel}`,
  }),
  activityIndicatorComponentLabelElement: Utils.platformSelect({
    ios: iOSLabel(activityIndicatorComponentLabel),
    android: `~${activityIndicatorComponentLabel}`,
  }),
  imageComponentLabelElement: Utils.platformSelect({
    ios: iOSLabel(imageComponentLabel),
    android: `~${imageComponentLabel}`,
  }),
  flatListComponentLabelElement: Utils.platformSelect({
    ios: iOSLabel(flatListComponentLabel),
    android: `~${flatListComponentLabel}`,
  }),
  // Methods to interact with top level elements in the list
  checkButtonComponentIsDisplayed: async function (
    this: ComponentsScreenType,
  ): Promise<boolean> {
    return await Utils.checkElementExistence(this.buttonComponentLabelElement);
  },
  checkActivityIndicatorComponentIsDisplayed: async function (
    this: ComponentsScreenType,
  ): Promise<boolean> {
    return await Utils.checkElementExistence(this.activityIndicatorComponentLabelElement);
  },
  checkImageComponentIsDisplayed: async function (
    this: ComponentsScreenType,
  ): Promise<boolean> {
    return await Utils.checkElementExistence(this.imageComponentLabelElement);
  },
  checkFlatListComponentIsDisplayed: async function (
    this: ComponentsScreenType,
  ): Promise<boolean> {
    return await Utils.checkElementExistence(this.flatListComponentLabelElement);
  },
  clickButtonComponent: async function (
    this: ComponentsScreenType,
  ): Promise<void> {
    await Utils.clickElement(this.buttonComponentLabelElement);
  },
  clickActivityIndicatorComponent: async function (
    this: ComponentsScreenType,
  ): Promise<void> {
    await Utils.clickElement(this.activityIndicatorComponentLabelElement);
  },
  clickImageComponent: async function (
    this: ComponentsScreenType,
  ): Promise<void> {
    await Utils.clickElement(this.imageComponentLabelElement);
  },
  clickFlatListComponent: async function (
    this: ComponentsScreenType,
  ): Promise<void> {
    await Utils.clickElement(this.flatListComponentLabelElement);
  },
};
