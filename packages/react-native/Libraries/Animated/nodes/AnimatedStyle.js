/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {PlatformConfig} from '../AnimatedPlatformConfig';

import {validateStyles} from '../../../src/private/animated/NativeAnimatedValidation';
import * as ReactNativeFeatureFlags from '../../../src/private/featureflags/ReactNativeFeatureFlags';
import flattenStyle from '../../StyleSheet/flattenStyle';
import Platform from '../../Utilities/Platform';
import AnimatedNode from './AnimatedNode';
import AnimatedObject from './AnimatedObject';
import AnimatedTransform from './AnimatedTransform';
import AnimatedWithChildren from './AnimatedWithChildren';

function createAnimatedStyle(
  inputStyle: {[string]: mixed},
  keepUnanimatedValues: boolean,
): [$ReadOnlyArray<string>, $ReadOnlyArray<AnimatedNode>, {[string]: mixed}] {
  const nodeKeys: Array<string> = [];
  const nodes: Array<AnimatedNode> = [];
  const style: {[string]: mixed} = {};

  const keys = Object.keys(inputStyle);
  for (let ii = 0, length = keys.length; ii < length; ii++) {
    const key = keys[ii];
    const value = inputStyle[key];

    if (value != null && key === 'transform') {
      const node = ReactNativeFeatureFlags.shouldUseAnimatedObjectForTransform()
        ? AnimatedObject.from(value)
        : // $FlowFixMe[incompatible-call] - `value` is mixed.
          AnimatedTransform.from(value);
      if (node == null) {
        if (keepUnanimatedValues) {
          style[key] = value;
        }
      } else {
        nodeKeys.push(key);
        nodes.push(node);
        style[key] = node;
      }
    } else if (value instanceof AnimatedNode) {
      const node = value;
      nodeKeys.push(key);
      nodes.push(node);
      style[key] = value;
    } else {
      const node = AnimatedObject.from(value);
      if (node == null) {
        if (keepUnanimatedValues) {
          style[key] = value;
        }
      } else {
        nodeKeys.push(key);
        nodes.push(node);
        style[key] = node;
      }
    }
  }

  return [nodeKeys, nodes, style];
}

export default class AnimatedStyle extends AnimatedWithChildren {
  #inputStyle: any;
  #nodeKeys: $ReadOnlyArray<string>;
  #nodes: $ReadOnlyArray<AnimatedNode>;
  #style: {[string]: mixed};

  /**
   * Creates an `AnimatedStyle` if `value` contains `AnimatedNode` instances.
   * Otherwise, returns `null`.
   */
  static from(inputStyle: any): ?AnimatedStyle {
    const flatStyle = flattenStyle(inputStyle);
    if (flatStyle == null) {
      return null;
    }
    const [nodeKeys, nodes, style] = createAnimatedStyle(
      flatStyle,
      Platform.OS !== 'web',
    );
    if (nodes.length === 0) {
      return null;
    }
    return new AnimatedStyle(nodeKeys, nodes, style, inputStyle);
  }

  constructor(
    nodeKeys: $ReadOnlyArray<string>,
    nodes: $ReadOnlyArray<AnimatedNode>,
    style: {[string]: mixed},
    inputStyle: any,
  ) {
    super();
    this.#nodeKeys = nodeKeys;
    this.#nodes = nodes;
    this.#style = style;
    this.#inputStyle = inputStyle;
  }

  __getValue(): Object | Array<Object> {
    const style: {[string]: mixed} = {};

    const keys = Object.keys(this.#style);
    for (let ii = 0, length = keys.length; ii < length; ii++) {
      const key = keys[ii];
      const value = this.#style[key];

      if (value instanceof AnimatedNode) {
        style[key] = value.__getValue();
      } else {
        style[key] = value;
      }
    }

    return Platform.OS === 'web' ? [this.#inputStyle, style] : style;
  }

  __getAnimatedValue(): Object {
    const style: {[string]: mixed} = {};

    const nodeKeys = this.#nodeKeys;
    const nodes = this.#nodes;
    for (let ii = 0, length = nodes.length; ii < length; ii++) {
      const key = nodeKeys[ii];
      const node = nodes[ii];
      style[key] = node.__getAnimatedValue();
    }

    return style;
  }

  __attach(): void {
    const nodes = this.#nodes;
    for (let ii = 0, length = nodes.length; ii < length; ii++) {
      const node = nodes[ii];
      node.__addChild(this);
    }
  }

  __detach(): void {
    const nodes = this.#nodes;
    for (let ii = 0, length = nodes.length; ii < length; ii++) {
      const node = nodes[ii];
      node.__removeChild(this);
    }
    super.__detach();
  }

  __makeNative(platformConfig: ?PlatformConfig) {
    const nodes = this.#nodes;
    for (let ii = 0, length = nodes.length; ii < length; ii++) {
      const node = nodes[ii];
      node.__makeNative(platformConfig);
    }
    super.__makeNative(platformConfig);
  }

  __getNativeConfig(): Object {
    const platformConfig = this.__getPlatformConfig();
    const styleConfig: {[string]: ?number} = {};

    const nodeKeys = this.#nodeKeys;
    const nodes = this.#nodes;
    for (let ii = 0, length = nodes.length; ii < length; ii++) {
      const key = nodeKeys[ii];
      const node = nodes[ii];
      node.__makeNative(platformConfig);
      styleConfig[key] = node.__getNativeTag();
    }

    if (__DEV__) {
      validateStyles(styleConfig);
    }
    return {
      type: 'style',
      style: styleConfig,
    };
  }
}
