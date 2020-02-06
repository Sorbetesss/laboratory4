/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const React = require('react');
const ReactNative = require('react-native');
import Platform from '../../../../Libraries/Utilities/Platform';
const {PlatformColor, StyleSheet, Text, View} = ReactNative;
import {IOSDynamicColor} from '../../../../Libraries/StyleSheet/NativeColorValueTypesIOS';
import {AndroidColor} from '../../../../Libraries/StyleSheet/NativeColorValueTypesAndroid';

type State = {};

class PlatformColorsExample extends React.Component<{}, State> {
  state: State;

  createTable() {
    let colors = [];
    if (Platform.OS === 'ios') {
      colors = [
        // https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors
        // Label Colors
        'labelColor',
        'secondaryLabelColor',
        'tertiaryLabelColor',
        'quaternaryLabelColor',
        // Fill Colors
        'systemFillColor',
        'secondarySystemFillColor',
        'tertiarySystemFillColor',
        'quaternarySystemFillColor',
        // Text Colors
        'placeholderTextColor',
        // Standard Content Background Colors
        'systemBackgroundColor',
        'secondarySystemBackgroundColor',
        'tertiarySystemBackgroundColor',
        // Grouped Content Background Colors
        'systemGroupedBackgroundColor',
        'secondarySystemGroupedBackgroundColor',
        'tertiarySystemGroupedBackgroundColor',
        // Separator Colors
        'separatorColor',
        'opaqueSeparatorColor',
        // Link Color
        'linkColor',
        // Nonadaptable Colors
        'darkTextColor',
        'lightTextColor',
        // https://developer.apple.com/documentation/uikit/uicolor/standard_colors
        // Adaptable Colors
        'systemBlueColor',
        'systemBrownColor',
        'systemGreenColor',
        'systemIndigoColor',
        'systemOrangeColor',
        'systemPinkColor',
        'systemPurpleColor',
        'systemRedColor',
        'systemTealColor',
        'systemYellowColor',
        // Adaptable Gray Colors
        'systemGrayColor',
        'systemGray2Color',
        'systemGray3Color',
        'systemGray4Color',
        'systemGray5Color',
        'systemGray6Color',
      ];
    } else if (Platform.OS === 'android') {
      colors = [
        '?attr/colorAccent',
        '?attr/colorBackgroundFloating',
        '?attr/colorButtonNormal',
        '?attr/colorControlActivated',
        '?attr/colorControlHighlight',
        '?attr/colorControlNormal',
        '?android:colorError',
        '?android:attr/colorError',
        '?attr/colorPrimary',
        '?colorPrimaryDark',
        '@android:color/holo_purple',
        '@android:color/holo_green_light',
        '@color/catalyst_redbox_background',
        '@color/catalyst_logbox_background',
      ];
    }

    let table = [];
    for (let color of colors) {
      table.push(
        <View style={styles.row} key={color}>
          <Text style={styles.labelCell}>{color}</Text>
          <View
            style={{
              ...styles.colorCell,
              backgroundColor: PlatformColor(`${color}`),
            }}
          />
        </View>,
      );
    }
    return table;
  }

  render() {
    return <View style={styles.column}>{this.createTable()}</View>;
  }
}

class FallbackColorsExample extends React.Component<{}, State> {
  state: State;

  getFallbackColor() {
    if (Platform.OS === 'ios') {
      return 'systemGreenColor';
    } else if (Platform.OS === 'android') {
      return '@color/catalyst_redbox_background';
    }

    throw 'Unexpected Platform.OS: ' + Platform.OS;
  }

  render() {
    return (
      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.labelCell}>
            PlatformColor('bogus', '{this.getFallbackColor()}')
          </Text>
          <View
            style={{
              ...styles.colorCell,
              backgroundColor: PlatformColor('bogus', this.getFallbackColor()),
            }}
          />
        </View>
      </View>
    );
  }
}

class DynamicColorsExample extends React.Component<{}, State> {
  state: State;
  render() {
    return Platform.OS === 'ios' ? (
      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.labelCell}>
            IOSDynamicColor({'{\n'}
            {'  '}light: 'red', dark: 'blue'{'\n'}
            {'}'})
          </Text>
          <View
            style={{
              ...styles.colorCell,
              backgroundColor: IOSDynamicColor({light: 'red', dark: 'blue'}),
            }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.labelCell}>
            IOSDynamicColor({'{\n'}
            {'  '}light: PlatformColor('systemBlueColor'),{'\n'}
            {'  '}dark: PlatformColor('systemRedColor'),{'\n'}
            {'}'})
          </Text>
          <View
            style={{
              ...styles.colorCell,
              backgroundColor: IOSDynamicColor({
                light: PlatformColor('systemBlueColor'),
                dark: PlatformColor('systemRedColor'),
              }),
            }}
          />
        </View>
      </View>
    ) : (
      <Text>Not applicable on this platform</Text>
    );
  }
}

class AndroidColorsExample extends React.Component<{}, State> {
  state: State;
  render() {
    return Platform.OS === 'android' ? (
      <View style={styles.column}>
        <View style={styles.row}>
          <Text style={styles.labelCell}>
            AndroidColor('?attr/colorAccent')
          </Text>
          <View
            style={{
              ...styles.colorCell,
              backgroundColor: AndroidColor('?attr/colorAccent'),
            }}
          />
        </View>
      </View>
    ) : (
      <Text>Not applicable on this platform</Text>
    );
  }
}

const styles = StyleSheet.create({
  column: {flex: 1, flexDirection: 'column'},
  row: {flex: 0.75, flexDirection: 'row'},
  labelCell: {
    flex: 1,
    alignItems: 'stretch',
    ...Platform.select({
      ios: {color: PlatformColor('labelColor')},
      default: {color: 'black'},
    }),
  },
  colorCell: {flex: 0.25, alignItems: 'stretch'},
});

exports.title = 'PlatformColor';
exports.description =
  'Examples that show how PlatformColors may be used in an app.';
exports.examples = [
  {
    title: 'Platform Colors',
    render: function(): React.Element<any> {
      return <PlatformColorsExample />;
    },
  },
  {
    title: 'Fallback Colors',
    render: function(): React.Element<any> {
      return <FallbackColorsExample />;
    },
  },
  {
    title: 'iOS Dynamic Colors',
    render: function(): React.Element<any> {
      return <DynamicColorsExample />;
    },
  },
  {
    title: 'Android Colors',
    render: function(): React.Element<any> {
      return <AndroidColorsExample />;
    },
  },
];
