/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTImageSource.h"
#import "RCTUtils.h"

@interface RCTImageSource ()

@property (nonatomic, assign) BOOL packagerAsset;

@end

@implementation RCTImageSource

- (instancetype)initWithURLRequest:(NSURLRequest *)request bundleURL:(NSURL *)bundleURL size:(CGSize)size scale:(CGFloat)scale
{
  if ((self = [super init])) {
    _request = [request copy];
    _bundleURL = [bundleURL copy];
    _size = size;
    _scale = scale;
  }
  return self;
}

- (instancetype)imageSourceWithSize:(CGSize)size scale:(CGFloat)scale
{
  RCTImageSource *imageSource = [[RCTImageSource alloc] initWithURLRequest:_request
                                                                 bundleURL:_bundleURL
                                                                      size:size
                                                                     scale:scale];
  imageSource.packagerAsset = _packagerAsset;
  return imageSource;
}

- (BOOL)isEqual:(RCTImageSource *)object
{
  if (![object isKindOfClass:[RCTImageSource class]]) {
    return NO;
  }
  BOOL bundleURLEqual = ((_bundleURL == nil && object.bundleURL == nil) || [_bundleURL isEqual:object.bundleURL]);
  return [_request isEqual:object.request] && bundleURLEqual && _scale == object.scale &&
  (CGSizeEqualToSize(_size, object.size) || CGSizeEqualToSize(object.size, CGSizeZero));
}

@end

@implementation RCTConvert (ImageSource)

+ (RCTImageSource *)RCTImageSource:(id)json
{
  if (!json) {
    return nil;
  }

  NSURLRequest *request;
  NSURL *bundleURL;
  CGSize size = CGSizeZero;
  CGFloat scale = 1.0;
  BOOL packagerAsset = NO;
  if ([json isKindOfClass:[NSDictionary class]]) {
    if (!(request = [self NSURLRequest:json])) {
      return nil;
    }
    bundleURL = [self NSURL:RCTNilIfNull(json[@"bundle"])];
    size = [self CGSize:json];
    scale = [self CGFloat:json[@"scale"]] ?: [self BOOL:json[@"deprecated"]] ? 0.0 : 1.0;
    packagerAsset = [self BOOL:json[@"__packager_asset"]];
  } else if ([json isKindOfClass:[NSString class]]) {
    request = [self NSURLRequest:json];
  } else {
    RCTLogConvertError(json, @"an image. Did you forget to call resolveAssetSource() on the JS side?");
    return nil;
  }

  RCTImageSource *imageSource = [[RCTImageSource alloc] initWithURLRequest:request
                                                          bundleURL:bundleURL
                                                               size:size
                                                              scale:scale];
  imageSource.packagerAsset = packagerAsset;
  return imageSource;
}

RCT_ARRAY_CONVERTER(RCTImageSource)

@end
