// Copyright 2004-present Facebook. All Rights Reserved.

package com.facebook.react.uimanager.layoutanimation;

import android.annotation.TargetApi;
import android.os.Build;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.Transformation;

import com.facebook.react.common.ApiCompatUtils;

/**
 * Animation responsible for updating opacity of a view. It should ideally use hardware texture
 * to optimize rendering performances.
 */
/* package */ class OpacityAnimation extends Animation {

  @TargetApi(Build.VERSION_CODES.JELLY_BEAN)
  static class OpacityAnimationListener implements AnimationListener {

    private final View mView;
    private boolean mLayerTypeChanged = false;

    public OpacityAnimationListener(View view) {
      mView = view;
    }

    @Override
    public void onAnimationStart(Animation animation) {
      if (mView.hasOverlappingRendering() &&
          mView.getLayerType() == View.LAYER_TYPE_NONE) {
        mLayerTypeChanged = true;
        mView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
      }
    }

    @Override
    public void onAnimationEnd(Animation animation) {
      if (mLayerTypeChanged) {
        mView.setLayerType(View.LAYER_TYPE_NONE, null);
      }
    }

    @Override
    public void onAnimationRepeat(Animation animation) {
      // do nothing
    }
  }

  private final View mView;
  private final float mStartOpacity, mDeltaOpacity;

  public OpacityAnimation(View view, float startOpacity, float endOpacity) {
    mView = view;
    mStartOpacity = startOpacity;
    mDeltaOpacity = endOpacity - startOpacity;

    // Only add layer type change listener after API 16.
    if (ApiCompatUtils.isJellyBeanOrHigher()) {
      setAnimationListener(new OpacityAnimationListener(view));
    }
  }

  @Override
  protected void applyTransformation(float interpolatedTime, Transformation t) {
    mView.setAlpha(mStartOpacity + mDeltaOpacity * interpolatedTime);
  }

  @Override
  public boolean willChangeBounds() {
    return false;
  }
}
