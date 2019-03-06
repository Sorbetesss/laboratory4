/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

'use strict';

<<<<<<< HEAD
var React = require('react');
var ReactNative = require('react-native');
var Platform = require('Platform');
=======
const React = require('react');
const ReactNative = require('react-native');
>>>>>>> v0.58.6

const nativeImageSource = require('nativeImageSource');
const {Image, StyleSheet, Text, View} = ReactNative;

class ImageCapInsetsExample extends React.Component<{}> {
  render() {

    let nativeImage;
    if (Platform.OS === 'macos') {
      nativeImage = nativeImageSource({
              macos: 'story-background',
              width: 60,
              height: 60
            });
    } else {
      nativeImage = nativeImageSource({
              ios: 'story-background',
              width: 60,
              height: 60
            })
    }

    return (
      <View>
        <View style={styles.background}>
          <Text>capInsets: none</Text>
          <Image
            source={nativeImage}
            style={styles.storyBackground}
            resizeMode="stretch"
            capInsets={{left: 0, right: 0, bottom: 0, top: 0}}
          />
        </View>
        <View style={[styles.background, {paddingTop: 10}]}>
          <Text>capInsets: 15</Text>
          <Image
            source={nativeImage}
            style={styles.storyBackground}
            resizeMode="stretch"
            capInsets={{left: 15, right: 15, bottom: 15, top: 15}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyBackground: {
    width: 250,
    height: 150,
    borderWidth: 1,
  },
});

module.exports = ImageCapInsetsExample;
