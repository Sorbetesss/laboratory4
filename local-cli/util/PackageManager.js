/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const spawnSync = require('child_process').spawnSync;
const yarn = require('../util/yarn');
const spawnOpts = {
  stdio: 'inherit',
  stdin: 'inherit',
};

const projectDir = process.cwd();
const isYarnAvailable =
  yarn.getYarnVersionIfAvailable() &&
  yarn.isGlobalCliUsingYarn(projectDir);

/**
 * Execute npm or yarn command
 *
 * @param  {String} yarnCommand Yarn command to be executed eg. yarn add package
 * @param  {String} npmCommand  Npm command to be executed eg. npm install package
 * @return {object}             spawnSync's result object
 */
function callYarnOrNpm(yarnCommand, npmCommand) {
  let command;

  if (isYarnAvailable) {
    command = yarnCommand;
  } else {
    command = npmCommand;
  }

  const args = command.split(' ');
  const cmd = args.shift();

  const res = spawnSync(cmd, args, spawnOpts);

  return res;
}

/**
 * Install package into project using npm or yarn if available
 * @param  {[type]} packageName Package to be installed
 * @return {[type]}             spawnSync's result object
 */
function add(packageName) {
  return callYarnOrNpm(
    `yarn add ${packageName}`,
    `npm install ${packageName} --save`
  );
}

/**
 * Uninstall package from project using npm or yarn if available
 * @param  {[type]} packageName Package to be uninstalled
 * @return {Object}             spawnSync's result object
 */
function remove(packageName) {
  return callYarnOrNpm(
    `yarn remove ${packageName}`,
    `npm uninstall --save ${packageName}`
  );
}

module.exports = {
  add: add,
  remove: remove,
};
