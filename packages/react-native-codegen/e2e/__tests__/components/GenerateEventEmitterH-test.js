/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @oncall react_native
 */

'use strict';

const {FlowParser} = require('../../../src/parsers/flow/parser');
const {buildSchema} = require('../../../src/parsers/flow');
const generator = require('../../../src/generators/components/GenerateEventEmitterH');
const fs = require('fs');

const FIXTURE_DIR = `${__dirname}/../../__test_fixtures__/components`;

const fixtures = fs.readdirSync(FIXTURE_DIR);

const parser = new FlowParser();

fixtures.forEach(fixture => {
  it(`GenerateEventEmitterH can generate for '${fixture}'`, () => {
    const libName = 'RNCodegenModuleFixtures';
    const schema = parser.parseFile(`${FIXTURE_DIR}/${fixture}`, buildSchema);
    const output = generator.generate(libName, schema);
    expect(Object.fromEntries(output)).toMatchSnapshot();
  });
});
