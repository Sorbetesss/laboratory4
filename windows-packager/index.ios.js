'use strict';

var React = require('react-native');
var {AppRegistry, View, Text} = React;

    var ReactRoot = React.createClass({
    render: function() {
        return (
              <View elevation="1.0">
	               <Text>Hello React Native, I'm running on Windows Phone</Text>
              </View>
        );
    }
 });

AppRegistry.registerComponent('ReactRoot', () => ReactRoot);
