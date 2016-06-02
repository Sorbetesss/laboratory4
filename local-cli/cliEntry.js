/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const cli = require('commander');

const Config = require('./util/Config');
const Promise = require('promise');
const childProcess = require('child_process');

const path = require('path');
const fs = require('fs');
const gracefulFs = require('graceful-fs');

const init = require('./init/init');
const commands = require('./commands');
const assertRequiredOptions = require('./util/assertRequiredOptions');
const pkg = require('../package.json');
const defaultConfig = require('./default.config');

// graceful-fs helps on getting an error when we run out of file
// descriptors. When that happens it will enqueue the operation and retry it.
gracefulFs.gracefulify(fs);

cli.version(pkg.version);

const defaultOptParser = (val) => val;

const handleError = (err) => {
  console.error();
  console.error(err.message || err);
  console.error();
  process.exit(1);
};

const addCommand = (command, config) => {
  const options = command.options || [];

  const cmd = cli
    .command(command.name)
    .usage(command.usage)
    .description(command.description)
    .action(function runAction() {
      const passedOptions = this.opts();

      try {
        assertRequiredOptions(options, passedOptions);
      } catch (e) {
        return handleError(e);
      }

      command.func(arguments, config, passedOptions).catch(handleError);
    });

  options
    .forEach(opt => cmd.option(
      opt.command,
      opt.description,
      opt.parse || defaultOptParser,
      typeof opt.default === 'function' ? opt.default(config) : opt.default,
    ));
};

function run() {
  const config = Config.get(__dirname, defaultConfig);
  const setupEnvScript = /^win/.test(process.platform)
    ? 'setup_env.bat'
    : 'setup_env.sh';

  childProcess.execFileSync(path.join(__dirname, setupEnvScript));

  commands.forEach(cmd => addCommand(cmd, config));

  cli.parse(process.argv);

  if (!cli.args.length) {
    cli.help();
  }
}

module.exports = {
  run: run,
  init: init,
};
