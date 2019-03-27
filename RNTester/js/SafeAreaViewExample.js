/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
'use strict';

const Button = require('Button');
const DeviceInfo = require('DeviceInfo');
const Modal = require('Modal');
const React = require('react');
const SafeAreaView = require('SafeAreaView');
const StyleSheet = require('StyleSheet');
const Switch = require('Switch');
const Text = require('Text');
const View = require('View');

import type {Insets} from 'CoreEventTypes';

class SafeAreaViewExample extends React.Component<
  {},
  {|
    modalVisible: boolean,
    emulateUnlessSupported: boolean,
    insets: ?Insets,
  |},
> {
  state = {
    modalVisible: false,
    emulateUnlessSupported: true,
    insets: undefined,
  };

  _setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  _onSafeAreaViewInsetsChange = event => {
    this.setState({insets: event.nativeEvent.insets});
  };

  render() {
    return (
      <View>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this._setModalVisible(false)}
          animationType="slide"
          supportedOrientations={['portrait', 'landscape']}>
          <View style={styles.modal}>
            <SafeAreaView
              style={styles.safeArea}
              emulateUnlessSupported={this.state.emulateUnlessSupported}
              onInsetsChange={this._onSafeAreaViewInsetsChange}>
              <View style={styles.safeAreaContent}>
                <Text>
                  {this.state.insets &&
                    `safeAreaViewInsets:\n${JSON.stringify(this.state.insets)}`}
                </Text>
                <Button
                  onPress={this._setModalVisible.bind(this, false)}
                  title="Close"
                />
                <Text>emulateUnlessSupported:</Text>
                <Switch
                  onValueChange={value =>
                    this.setState({emulateUnlessSupported: value})
                  }
                  value={this.state.emulateUnlessSupported}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
        <Button
          onPress={this._setModalVisible.bind(this, true)}
          title="Present Modal Screen with SafeAreaView"
        />
        <Text>emulateUnlessSupported:</Text>
        <Switch
          onValueChange={value =>
            this.setState({emulateUnlessSupported: value})
          }
          value={this.state.emulateUnlessSupported}
        />
      </View>
    );
  }
}

class IsIPhoneXExample extends React.Component<{}> {
  render() {
    return (
      <View>
        <Text>
          Is this an iPhone X:{' '}
          {DeviceInfo.isIPhoneX_deprecated
            ? 'Yeah!'
            : 'Nope. (Or `isIPhoneX_deprecated` was already removed.)'}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    height: 1000,
  },
  safeAreaContent: {
    flex: 1,
    backgroundColor: '#ffaaaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

exports.displayName = (undefined: ?string);
exports.framework = 'React';
exports.title = '<SafeAreaView>';
exports.description =
  'SafeAreaView automatically applies paddings reflect the portion of the view that is not covered by other (special) ancestor views.';
exports.examples = [
  {
    title: '<SafeAreaView> Example',
    description:
      'SafeAreaView automatically applies paddings reflect the portion of the view that is not covered by other (special) ancestor views.',
    render: () => <SafeAreaViewExample />,
  },
  {
    title: 'isIPhoneX_deprecated Example',
    description:
      '`DeviceInfo.isIPhoneX_deprecated` returns true only on iPhone X. ' +
      'Note: This prop is deprecated and will be removed in a future ' +
      'release. Please use this only for a quick and temporary solution. ' +
      'Use <SafeAreaView> instead.',
    render: () => <IsIPhoneXExample />,
  },
];
