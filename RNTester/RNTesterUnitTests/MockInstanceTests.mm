//
//  MockInstanceTests.m
//  RNTesterUnitTests
//
//  Created by Julio Cesar Rocha on 10/22/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <XCTest/XCTest.h>

#import "MockInstance.hpp"
#import "SampleCxxModule.hpp"

@interface MockInstanceTests : XCTestCase

@end

@implementation MockInstanceTests

- (void)setUp {
    [super setUp];
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

- (void)testExample {
    // This is an example of a functional test case.
    // Use XCTAssert and related functions to verify your tests produce the correct results.

  std::shared_ptr<MockInstance> instance = std::make_shared<MockInstance>();
  std::unique_ptr<SampleCxxModule> module = std::make_unique<SampleCxxModule>();
  
  module->setInstance(instance);
}

- (void)testPerformanceExample {
    // This is an example of a performance test case.
    [self measureBlock:^{
        // Put the code you want to measure the time of here.
    }];
}

@end
