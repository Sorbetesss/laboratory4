// Copyright (c) Facebook, Inc. and its affiliates.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
<<<<<<< HEAD
#import <JavaScriptCore/JSBase.h>
#import <React/RCTUIKit.h> // TODO(macOS ISS#2323203)
=======
#import <UIKit/UIKit.h>
>>>>>>> v0.58.6

#import <React/RCTDefines.h>
#import <React/RCTInspectorPackagerConnection.h>

#if RCT_DEV

@interface RCTInspectorDevServerHelper : NSObject

+ (RCTInspectorPackagerConnection *)connectWithBundleURL:(NSURL *)bundleURL;
+ (void)disableDebugger;
+ (void)attachDebugger:(NSString *)owner
         withBundleURL:(NSURL *)bundleURL
              withView:(UIViewController *)view;
@end

#endif
