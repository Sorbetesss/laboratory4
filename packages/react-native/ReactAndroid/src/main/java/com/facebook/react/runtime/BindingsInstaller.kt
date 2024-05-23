/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.runtime

import com.facebook.jni.HybridData
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.proguard.annotations.DoNotStripAny
import com.facebook.soloader.SoLoader

@DoNotStripAny
public abstract class BindingsInstaller(@field:DoNotStrip private val mHybridData: HybridData?) {
  private companion object {
    init {
      SoLoader.loadLibrary("rninstance")
    }
  }
}
