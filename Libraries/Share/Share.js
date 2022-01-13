/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

const Platform = require('../Utilities/Platform');

const invariant = require('invariant');
const processColor = require('../StyleSheet/processColor');

import NativeActionSheetManager from '../ActionSheetIOS/NativeActionSheetManager';
import NativeShareModule from './NativeShareModule';

type Content =
  | {
      title?: string,
      message: string,
      ...
    }
  | {
      title?: string,
      url: string,
      ...
    };
type Options = {
  dialogTitle?: string,
  excludedActivityTypes?: Array<string>,
  tintColor?: string,
  subject?: string,
  userInterfaceStyle?: string,
  ...
};

class Share {
  /**
   * Open a dialog to share text content.
   *
   * In iOS, Returns a Promise which will be invoked an object containing `action`, `activityType`.
   * If the user dismissed the dialog, the Promise will still be resolved with action being `Share.dismissedAction`
   * and all the other keys being undefined.
   *
   * In Android, Returns a Promise which always be resolved with action being `Share.sharedAction`.
   *
   * ### Content
   *
   *  - `message` - a message to share
   *
   * #### iOS
   *
   *  - `url` - a URL to share
   *
   * At least one of URL and message is required.
   *
   * #### Android
   *
   * - `title` - title of the message
   *
   * ### Options
   *
   * #### iOS
   *
   *  - `subject` - a subject to share via email
   *  - `excludedActivityTypes`
   *  - `tintColor`
   *
   * #### Android
   *
   *  - `dialogTitle`
   *
   */
  static share(
    content: Content,
    options: Options = {},
  ): Promise<{action: string, activityType: ?string}> {
    invariant(
      typeof content === 'object' && content !== null,
      'Content to share must be a valid object',
    );
    invariant(
      typeof content.url === 'string' || typeof content.message === 'string',
      'At least one of URL and message is required',
    );
    invariant(
      typeof options === 'object' && options !== null,
      'Options must be a valid object',
    );

    if (Platform.OS === 'android') {
      invariant(
        NativeShareModule,
        'ShareModule should be registered on Android.',
      );
      invariant(
        content.title == null || typeof content.title === 'string',
        'Invalid title: title should be a string.',
      );

      const newContent = {
        title: content.title,
        message:
          typeof content.message === 'string' ? content.message : undefined,
      };

      return NativeShareModule.share(newContent, options.dialogTitle).then(
        result => ({
          activityType: null,
          ...result,
        }),
      );
    } else if (Platform.OS === 'ios') {
      return new Promise((resolve, reject) => {
        const tintColor = processColor(options.tintColor);

        invariant(
          tintColor == null || typeof tintColor === 'number',
          'Unexpected color given for options.tintColor',
        );

        invariant(
          NativeActionSheetManager,
          'NativeActionSheetManager is not registered on iOS, but it should be.',
        );

        NativeActionSheetManager.showShareActionSheetWithOptions(
          {
            message:
              typeof content.message === 'string' ? content.message : undefined,
            url: typeof content.url === 'string' ? content.url : undefined,
            subject: options.subject,
            tintColor: typeof tintColor === 'number' ? tintColor : undefined,
            excludedActivityTypes: options.excludedActivityTypes,
            userInterfaceStyle: typeof options.userInterfaceStyle === 'string' ? options.userInterfaceStyle : undefined,
          },
          error => reject(error),
          (success, activityType) => {
            if (success) {
              resolve({
                action: 'sharedAction',
                activityType: activityType,
              });
            } else {
              resolve({
                action: 'dismissedAction',
                activityType: null,
              });
            }
          },
        );
      });
    } else {
      return Promise.reject(new Error('Unsupported platform'));
    }
  }

  /**
   * The content was successfully shared.
   */
  static sharedAction: 'sharedAction' = 'sharedAction';

  /**
   * The dialog has been dismissed.
   * @platform ios
   */
  static dismissedAction: 'dismissedAction' = 'dismissedAction';
}

module.exports = Share;
