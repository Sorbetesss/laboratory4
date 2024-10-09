/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.facebook.react.devsupport;

public interface IInspectorPackagerConnection {
  public void connect();

  public void closeQuietly();

  public void sendEventToAllConnections(String event);

  public void sendWrappedEventToPackager(String event, String pageId);
}
