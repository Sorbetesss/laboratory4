/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.modules.share;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.JavaOnlyMap;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PowerMockIgnore;
import org.robolectric.Robolectric;
import org.robolectric.Shadows;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.util.ActivityController;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(RobolectricTestRunner.class)
@PowerMockIgnore({"org.mockito.*", "org.robolectric.*", "android.*"})
public class ShareModuleTest {

  private ActivityController<Activity> mActivityController;
  private Activity mActivity;
  private ShareModule mShareModule;

  @Before
  public void setUp() throws Exception {
    mActivityController = Robolectric.buildActivity(Activity.class);
    mActivity = mActivityController
        .create()
        .start()
        .resume()
        .get();

    final ReactApplicationContext context = PowerMockito.mock(ReactApplicationContext.class);
    PowerMockito.when(context.hasActiveCatalystInstance()).thenReturn(true);
    PowerMockito.when(context, "getCurrentActivity").thenReturn(mActivity);

    mShareModule = new ShareModule(context);
  }

  @After
  public void tearDown() {
    mActivityController.pause().stop().destroy();

    mActivityController = null;
    mShareModule = null;
  }

  @Test
  public void testShareDialog() {
    final String title = "Title";
    final String message = "Message";
    final String dialogTitle = "Dialog Title";

    JavaOnlyMap content = new JavaOnlyMap();
    content.putString("title", title);
    content.putString("message", message);

    mShareModule.share(content, dialogTitle, PowerMockito.mock(Promise.class));

    final Intent chooserIntent = Shadows.shadowOf(mActivity).peekNextStartedActivity();
    assertNotNull("Dialog was not displayed", chooserIntent);
    assertEquals(Intent.ACTION_CHOOSER, chooserIntent.getAction());
    assertEquals(dialogTitle, chooserIntent.getExtras().get(Intent.EXTRA_TITLE));

    final Intent contentIntent = (Intent)chooserIntent.getExtras().get(Intent.EXTRA_INTENT);
    assertNotNull("Intent was not built correctly", contentIntent);
    assertEquals(Intent.ACTION_SEND, contentIntent.getAction());
    assertEquals(title, contentIntent.getExtras().get(Intent.EXTRA_SUBJECT));
    assertEquals(message, contentIntent.getExtras().get(Intent.EXTRA_TEXT));
  }

}
