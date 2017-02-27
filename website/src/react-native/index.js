/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var Hero = require('Hero');
var Prism = require('Prism');
var React = require('React');
var Site = require('Site');

var siteConfig = require('../../siteConfig.js');
const pinnedApps = siteConfig.apps.filter(app => {
  return app.pinned;
});

var AppList = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.apps.map(this._renderApp)}
      </div>
    );
  },

  _renderApp: function(app, i) {
    return (
      <div className="showcase" key={i}>
        {this._renderIcon(app)}
      </div>
    );
  },

  _renderIcon: function(app) {
    return (
      <a href={app.infoLink}>
        <img src={app.icon} alt={app.name} />
      </a>
    );
  },

  _renderTitle: function(app) {
    return (
      <a href={app.infoLink}>
        <h3>{app.name}</h3>
      </a>
    );
  },
});

var index = React.createClass({
  render: function() {
    return (
      <Site>
        <Hero title="React Native" subtitle="Learn once, write anywhere: Build mobile apps with React">
          <div className="buttons-unit">
            <a href="docs/getting-started.html#content" className="button">Get started with React Native</a>
          </div>
        </Hero>

        <section className="content wrap">

          <div style={{margin: '40px auto', maxWidth: 800}}>

            <h2>Build Native Mobile Apps using JavaScript and React</h2>
            <p>
              React Native lets you build mobile apps using only JavaScript. It uses the same design as React, letting you compose a rich mobile UI from declarative components.
            </p>

            <Prism>

{`import React, { Component } from 'react';
import { Text, View } from 'react-native';

class WhyReactNativeIsSoGreat extends Component {
  render() {
    return (
      <View>
        <Text>
          If you like React on the web, you'll like React Native.
        </Text>
        <Text>
          You just use native components like 'View' and 'Text',
          instead of web components like 'div' and 'span'.
        </Text>
      </View>
    );
  }
}`}
            </Prism>

            <h2>A React Native App is a Real Mobile App</h2>
            <p>
              With React Native, you don't build a “mobile web app”, an “HTML5 app”, or a “hybrid app”. You build a real mobile app that's indistinguishable from an app built using Objective-C or Java. React Native uses the same fundamental UI building blocks as regular iOS and Android apps. You just put those building blocks together using JavaScript and React.
            </p>

            <Prism>
{`import React, { Component } from 'react';
import { Image, ScrollView, Text } from 'react-native';

class AwkwardScrollingImageWithText extends Component {
  render() {
    return (
      <ScrollView>
        <Image source={{uri: 'https://i.chzbgr.com/full/7345954048/h7E2C65F9/'}} />
        <Text>
          On iOS, a React Native ScrollView uses a native UIScrollView.
          On Android, it uses a native ScrollView.

          On iOS, a React Native Image uses a native UIImageView.
          On Android, it uses a native ImageView.

          React Native wraps the fundamental native components, giving you
          the performance of a native app, plus the clean design of React.
        </Text>
      </ScrollView>
    );
  }
}`}
            </Prism>

            <h2>Don't Waste Time Recompiling</h2>
            <p>
              React Native lets you build your app faster. Instead of recompiling, you can reload your app instantly. With hot reloading, you can even run new code while retaining your application state. Give it a try - it's a magical experience.
            </p>
            <br />
            <img src="https://media.giphy.com/media/13WZniThXy0hSE/giphy.gif" />

            <h2>Use Native Code When You Need To</h2>
            <p>
              React Native combines smoothly with components written in Objective-C, Java, or Swift. It's simple to drop down to native code if you need to optimize a few aspects of your application. It's also easy to build part of your app in React Native, and part of your app using native code directly - that's how the Facebook app works.
            </p>

            <Prism>
{`import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { TheGreatestComponentInTheWorld } from './your-native-code';

class SomethingFast extends Component {
  render() {
    return (
      <View>
        <TheGreatestComponentInTheWorld />
        <Text>
          TheGreatestComponentInTheWorld could use native Objective-C,
          Java, or Swift - the product development process is the same.
        </Text>
      </View>
    );
  }
}`}
            </Prism>
          </div>

          <section className="home-bottom-section">
            <div className="buttons-unit">
              <a href="docs/getting-started.html#content" className="button">Get started with React Native</a>
            </div>
          </section>

          <section className="home-showcase-section">
            <h2>Who's using React Native?</h2>
            <p>
              Thousands of apps are using React Native, from established Fortune 500 companies to hot new startups. If you're curious to see what can be accomplished with React Native, check out these apps!
            </p>
            <AppList apps={pinnedApps} />
            <p className="footnote">
              Some of these are hybrid native/React Native apps.
            </p>
            <div className="buttons-unit">
              <a href="/react-native/showcase.html" className="button">More React Native apps</a>
            </div>
          </section>
        </section>
      </Site>
    );
  }
});

module.exports = index;
