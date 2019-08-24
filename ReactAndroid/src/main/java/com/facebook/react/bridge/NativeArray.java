/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * <p>This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */
package com.facebook.react.bridge;

import androidx.annotation.Keep;
import com.facebook.jni.HybridData;

/** Base class for an array whose members are stored in native code (C++). */
@Keep
public abstract class NativeArray implements NativeArrayInterface {
  static {
    ReactBridge.staticInit();
  }

  protected NativeArray(HybridData hybridData) {
    mHybridData = hybridData;
  }

  @Override
  public native String toString();

  @Keep private HybridData mHybridData;
}
