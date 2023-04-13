/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTSurfaceTouchHandler : UIGestureRecognizer

/*
 * Attaches (and detaches) a view to the touch handler.
 * The receiver does not retain the provided view.
 */
- (void)attachToView:(UIView *)view;
- (void)detachFromView:(UIView *)view;

/*
 * Offset of the attached view relative to the root component in points.
 */
@property (nonatomic, assign) CGPoint viewOriginOffset;

/*
 * Pointer Capture APIs
 */
- (BOOL)isPointerCaptured:(int)pointerId forView:(UIView *)componentView;
- (void)setPointerCapture:(int)pointerId forView:(UIView *)componentView;
- (void)releasePointerCapture:(int)pointerId forView:(UIView *)componentView;

@end

NS_ASSUME_NONNULL_END
