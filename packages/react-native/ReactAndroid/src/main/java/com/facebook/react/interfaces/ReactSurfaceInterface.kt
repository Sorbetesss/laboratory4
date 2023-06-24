/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.interfaces

import android.view.ViewGroup

/** Represents a Surface in React Native. */
interface ReactSurfaceInterface {
  // the API of this interface will be completed as we analyze and refactor API of ReactSurface,
  // ReactRootView, etc.

  // Start running this surface
  fun start(): TaskInterface

  // Get React root view of this surface
  fun getView(): ViewGroup?
}
