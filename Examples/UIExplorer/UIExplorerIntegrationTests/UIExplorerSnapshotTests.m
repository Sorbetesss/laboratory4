/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <RCTTest/RCTTestRunner.h>

#import "RCTAssert.h"
#import "RCTRedBox.h"
#import "RCTRootView.h"

@interface UIExplorerSnapshotTests : XCTestCase
{
  RCTTestRunner *_runner;
}

@end

@implementation UIExplorerSnapshotTests

- (void)setUp
{
  _runner = RCTInitRunnerForApp(@"Examples/UIExplorer/js/UIExplorerApp.ios", nil);
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 10) {
    _runner.testSuffix = @"-iOS10";
  }
  _runner.recordMode = NO;
}

#define RCT_TEST(name)                  \
- (void)test##name                      \
{                                       \
  [_runner runTest:_cmd module:@#name]; \
}

RCT_TEST(ViewExample)
RCT_TEST(LayoutExample)
#if !TARGET_OS_TV  // TextExample uses fonts that don't exist on Apple TV
RCT_TEST(TextExample)
#endif
RCT_TEST(SwitchExample)
RCT_TEST(SliderExample)
#if !TARGET_OS_TV  // Fails randomly on Apple TV, needs investigation
RCT_TEST(TabBarExample)
#endif

- (void)testZZZNotInRecordMode
{
  XCTAssertFalse(_runner.recordMode, @"Don't forget to turn record mode back to off");
}

@end
