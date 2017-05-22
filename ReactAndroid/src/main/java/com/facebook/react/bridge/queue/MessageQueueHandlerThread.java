/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.bridge.queue;

import android.os.Looper;

class MessageQueueHandlerThread extends Thread {
  private Looper mLooper;

  protected MessageQueueHandlerThread(String name, long stackSize) {
    super(null, null, name, stackSize);
  }

  private void onLooperPrepared() {
  }

  @Override
  public void run() {
    Looper.prepare();
    synchronized (this) {
      mLooper = Looper.myLooper();
      notifyAll();
    }
    onLooperPrepared();
    Looper.loop();
  }


  public Looper getLooper() {
    if (!isAlive()) {
      return null;
    }

    synchronized (this) {
      while (isAlive() && mLooper == null) {
        try {
          wait();
        } catch (InterruptedException e) {
        }
      }
    }
    return mLooper;
  }
}
