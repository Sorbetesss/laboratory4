/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.modules.notification;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public class NotificationModule extends ReactContextBaseJavaModule {

  public NotificationModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "NotificationModule";
  }

  @ReactMethod
  public void presentLocalNotification(final ReadableMap details, final int handle) {
    ReactApplicationContext context = getReactApplicationContext();
    NotificationCompat.Builder builder = new NotificationCompat.Builder(context);

    try {
      PackageManager pm = context.getPackageManager();
      ApplicationInfo info = pm.getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA);
      builder.setSmallIcon(info.icon);
    } catch (PackageManager.NameNotFoundException e) {
      builder.setSmallIcon(android.R.drawable.sym_def_app_icon);
    }

    builder.setAutoCancel(true);

    if (!(details.hasKey("silent") && details.getBoolean("silent"))) {
      builder.setDefaults(NotificationCompat.DEFAULT_SOUND);
    }

    if (details.hasKey("title")) {
      String title = details.getString("title");
      builder.setContentTitle(title);
      builder.setTicker(title);
    }

    if (details.hasKey("body")) {
     builder.setContentText(details.getString("body"));
    }

    if (details.hasKey("count")) {
      builder.setNumber(details.getInt("count"));
    }

    if (details.hasKey("sticky")) {
      builder.setOngoing(details.getBoolean("sticky"));
    }

    if (details.hasKey("priority")) {
      int priority;

      switch (details.getString("priority")) {
        case "max":
          priority = NotificationCompat.PRIORITY_MAX;
          break;
        case "high":
          priority = NotificationCompat.PRIORITY_HIGH;
          break;
        case "low":
          priority = NotificationCompat.PRIORITY_LOW;
          break;
        case "min":
          priority = NotificationCompat.PRIORITY_MIN;
          break;
        default:
          priority = NotificationCompat.PRIORITY_DEFAULT;
      }

      builder.setPriority(priority);
    }

    if (details.hasKey("vibrate")) {
      ReadableArray vibrate = details.getArray("vibrate");
      long[] pattern = new long[vibrate.size()];

      for (int i = 0; i < vibrate.size(); i++) {
        pattern[i] = vibrate.getInt(i);
      }

      builder.setVibrate(pattern);
    }

    if (details.hasKey("link")) {
      Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(details.getString("link")));
      PendingIntent contentIntent = PendingIntent.getActivity(context, 0, intent, 0);
      builder.setContentIntent(contentIntent);
    }

    String tag = details.hasKey("tag") ? details.getString("tag") : null;

    getNotificationManager().notify(tag, handle, builder.build());
  }

  @ReactMethod
  public void cancelLocalNotification(final String tag, final int handle) {
    getNotificationManager().cancel(tag, handle);
  }

  @ReactMethod
  public void cancelAllLocalNotifications() {
    getNotificationManager().cancelAll();
  }

  private NotificationManager getNotificationManager() {
    return (NotificationManager) getReactApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
  }
}
