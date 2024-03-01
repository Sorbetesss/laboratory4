#!/usr/bin/env node
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

const {name, version: currentVersion} = require('./package.json');
const chalk = require('chalk');
const {get} = require('https');
const {URL} = require('url');

let cli = {
  run: () => {
    throw new Error(
      'react-native/cli is deprecated, please use @react-native-community/cli instead',
    );
  },
};

const isNpxRuntime = process.env.npm_lifecycle_event === 'npx';
const DEFAULT_REGISTRY_HOST =
  process.env.npm_config_registry ?? 'https://registry.npmjs.org/';
const HEAD = '1000.0.0';
const CLI_DEPRECATION_DATE = new Date('2024-10-01');

async function getLatestVersion(registryHost = DEFAULT_REGISTRY_HOST) {
  return new Promise((res, rej) => {
    const url = new URL(registryHost);
    url.pathname = 'react-native/latest';
    get(url.toString(), resp => {
      const buffer = [];
      resp.on('data', data => buffer.push(data));
      resp.on('end', () => {
        try {
          res(JSON.parse(Buffer.concat(buffer).toString('utf8')).version);
        } catch (e) {
          rej(e);
        }
      });
    }).on('error', e => rej(e));
  });
}

/**
 * Warn when users are using `npx react-native init`, to raise awareness of the changes from RFC 0759.
 *
 * Phase 1
 *
 * @see https://github.com/react-native-community/discussions-and-proposals/tree/main/proposals/0759-react-native-frameworks.md
 */
function warnWhenRunningInit() {
  if (process.argv[2] === 'init') {
    console.warn(
      `\nRunning: ${chalk.grey.bold('npx @react-native-community/cli init')}\n`,
    );
  }
}

/**
 * Warn more sternly that the ability to call `npx react-native init` is going away.
 *
 * Phase 2
 *
 * @see https://github.com/react-native-community/discussions-and-proposals/tree/main/proposals/0759-react-native-frameworks.md
 */
function warnWithDeprecationSchedule() {
  if (process.argv[2] !== 'init') {
    return;
  }

  const daysRemaining = Math.ceil(
    (CLI_DEPRECATION_DATE.getTime() - new Date().getTime()) / 86_400_000,
  );

  const emphasis =
    daysRemaining < 10
      ? chalk.bgRed.white.bold
      : daysRemaining < 30
        ? chalk.red.bold
        : daysRemaining < 60
          ? chalk.green.bold
          : chalk.blueBright.bold;

  console.warn(`
${chalk.yellow('⚠️')} The \`init\` command is deprecated.
The behavior will be changed on ${chalk.white.bold(CLI_DEPRECATION_DATE.toLocaleDateString())} ${emphasis(`(${daysRemaining} day${daysRemaining > 1 ? 's' : ''})`)}.

- Switch to ${chalk.dim('npx @react-native-community/cli init')} for the identical behavior.
- Refer to the documentation for information about alternative tools: ${chalk.dim('https://reactnative.dev/docs/getting-started')}`);
}

function warnWithDeprecated() {
  if (process.argv[2] !== 'init') {
    return;
  }

  console.warn(`
${chalk.yellow('⚠')}️ The \`init\` command is deprecated.

- Switch to ${chalk.dim('npx @react-native-community/cli init')} for the identical behavior.
- Refer to the documentation for information about alternative tools: ${chalk.dim('https://reactnative.dev/docs/getting-started')}`);
}

/**
 * npx react-native -> @react-native-community/cli
 *
 * Will perform a version check and warning if you're not running the latest community cli when executed using npx. If
 * you know what you're doing, you can skip this check:
 *
 *  SKIP=true npx react-native ...
 *
 */
async function main() {
  if (isNpxRuntime && !process.env.SKIP && currentVersion !== HEAD) {
    try {
      const latest = await getLatestVersion();
      if (latest !== currentVersion) {
        const msg = `
  ${chalk.bold.yellow('WARNING:')} You should run ${chalk.white.bold(
    'npx react-native@latest',
  )} to ensure you're always using the most current version of the CLI. NPX has cached version (${chalk.bold.yellow(
    currentVersion,
  )}) != current release (${chalk.bold.green(latest)})
  `;
        console.warn(msg);
      }
    } catch (_) {
      // Ignore errors, since it's a nice to have warning
    }
  }

  const isDeprecated =
    CLI_DEPRECATION_DATE.getTime() <= new Date().getTime() ||
    currentVersion.startsWith('0.76');

  if (currentVersion !== HEAD && isDeprecated) {
    warnWithDeprecated();
    process.exit(1);
  }

  if (currentVersion.startsWith('0.75')) {
    warnWithDeprecationSchedule();
  }

  warnWhenRunningInit();

  return require('@react-native-community/cli').run(name);
}

if (require.main === module) {
  main();
} else {
  try {
    cli = require('@react-native-community/cli');
  } catch (_) {
    // Ignore errors, once this dependency goes use MUST throw an exception
  }
}

module.exports = cli;
