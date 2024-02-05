/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated SignedSource<<045ff1b11b0336f4bac5ed966ba2e379>>
 */

/**
 * IMPORTANT: Do NOT modify this file directly.
 *
 * To change the definition of the flags, edit
 *   packages/react-native/scripts/featureflags/ReactNativeFeatureFlags.config.js.
 *
 * To regenerate this code, run the following script from the repo root:
 *   yarn featureflags-update
 */

package com.facebook.react.internal.featureflags

import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.soloader.SoLoader

@DoNotStrip
object ReactNativeFeatureFlagsCxxInterop {
  init {
    SoLoader.loadLibrary("react_featureflagsjni")
  }

  @DoNotStrip @JvmStatic external fun commonTestFlag(): Boolean

  @DoNotStrip @JvmStatic external fun useModernRuntimeScheduler(): Boolean

  @DoNotStrip @JvmStatic external fun enableMicrotasks(): Boolean

  @DoNotStrip @JvmStatic external fun batchRenderingUpdatesInEventLoop(): Boolean

  @DoNotStrip @JvmStatic external fun enableSpannableBuildingUnification(): Boolean

  @DoNotStrip @JvmStatic external fun enableCustomDrawOrderFabric(): Boolean

  @DoNotStrip @JvmStatic external fun enableFixForClippedSubviewsCrash(): Boolean

  @DoNotStrip @JvmStatic external fun enablePropIteratorSetter(): Boolean

  @DoNotStrip @JvmStatic external fun override(provider: Any)

  @DoNotStrip @JvmStatic external fun dangerouslyReset()
}
