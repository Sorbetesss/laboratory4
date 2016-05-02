/**
 * Copyright (c) 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.modules.share;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.ReactConstants;

/**
 * Intent module. Launch other activities or open URLs.
 */
public class ShareModule extends ReactContextBaseJavaModule {

  /* package */ static final String ERROR_INVALID_CONTENT = "E_INVALID_CONTENT";
  /* package */ static final String ERROR_UNABLE_TO_OPEN_DIALOG = "E_UNABLE_TO_OPEN_DIALOG";

  public ShareModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "ShareModule";
  }

  /**
   * Open a chooser dialog to send text content to other apps.
   *
   * Refer http://developer.android.com/intl/ko/training/sharing/send.html
   * 
   * @param content the data to send
   * @param dialogTitle the title of the chooser dialog
   */
  @ReactMethod
  public void share(ReadableMap content, String dialogTitle, Promise promise) {
    if (content == null) {
      promise.reject(ERROR_INVALID_CONTENT, "Content cannot be null");
      return;
    }

    try {
      Intent intent = new Intent(Intent.ACTION_SEND);
      intent.setTypeAndNormalize("text/plain");
      
      if (content.hasKey("title")) {
        intent.putExtra(Intent.EXTRA_SUBJECT, content.getString("title"));
      }

      if (content.hasKey("message")) {
        intent.putExtra(Intent.EXTRA_TEXT, content.getString("message"));
      } 

      if (content.hasKey("url")) {
        intent.putExtra(Intent.EXTRA_TEXT, content.getString("url")); // this will overwrite message
      }

      //TODO: use createChooser (Intent target, CharSequence dialogTitle, IntentSender sender) after API level 22 
      Intent chooser = Intent.createChooser(intent, dialogTitle); 

      Activity currentActivity = getCurrentActivity();
      if (currentActivity != null) {
        currentActivity.startActivity(chooser);
      } else {
        getReactApplicationContext().startActivity(chooser);
      }
      promise.resolve(null);
    } catch (Exception e) {
      FLog.e(ReactConstants.TAG, "Failed to open share dialog", e);
      promise.reject(ERROR_UNABLE_TO_OPEN_DIALOG, "Failed to open share dialog");
    }

  }

}