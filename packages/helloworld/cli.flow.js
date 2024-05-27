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

import {run} from './lib/cli';
import {getExistingPath, pauseWatchman} from './lib/filesystem';
import {
  bootSimulator,
  expensivePodCheck,
  getSimulatorDetails,
  getXcodeBuildSettings,
  launchApp,
  launchSimulator,
} from './lib/ios';
import {app, apple} from '@react-native/core-cli-utils';
import {Option, program} from 'commander';
import {readFileSync} from 'fs';
import {Listr} from 'listr2';
import path from 'path';

program.version(JSON.parse(readFileSync('./package.json', 'utf8')).version);

const bootstrap = program.command('bootstrap');

const cwd = {
  ios: path.join(__dirname, 'ios'),
  android: path.join(__dirname, 'android'),
  root: __dirname,
};

const possibleHermescPaths = [
  // OSS checkout
  path.join(cwd.ios, 'Pods/hermes-engine/destroot/bin/hermesc'),
  // internal
  path.join(cwd.ios, 'Pods/hermes-engine/build_host_hermesc/bin/hermesc'),
];

const vmOption = new Option('--vm <vm>', 'Choose VM used on device')
  .choices(['jsc', 'hermes'])
  .default('hermes');

type BootstrapOptions = {
  arch: 'old' | 'new',
  vm: 'hermes' | 'jsc',
  frameworks?: 'static' | 'dynamic',
};

bootstrap
  .command('ios')
  .description('Bootstrap iOS')
  .addOption(
    new Option('--arch <arch>', "Choose React Native's architecture")
      .choices(['new', 'old'])
      .default('new'),
  )
  .addOption(
    new Option(
      '--frameworks <linkage>',
      'Use frameworks instead of static libraries',
    )
      .choices(['static', 'dynamic'])
      .default(undefined),
  )
  .addOption(vmOption)
  .action(async ({vm, arch, frameworks}: BootstrapOptions) => {
    await run(
      apple.bootstrap({
        cwd: cwd.ios,
        frameworks,
        hermes: vm === 'hermes',
        newArchitecture: arch === 'new',
      }),
    );
  });

type BuildOptions = {
  device: string,
  arch: 'old' | 'new',
  prod: boolean,
  vm: 'hermes' | 'jsc',
};

const optionalBool = (value: string | void) => value?.toLowerCase() === 'true';

type BuildSettings = {
  appPath: string,
  bundleId: string,
  bundleBuildDir: string,
  bundleResourceDir: string,
};

const getBuildSettings = (mode: 'Debug' | 'Release'): BuildSettings => {
  const xcode = getXcodeBuildSettings(cwd.ios, mode)[0].buildSettings;
  return {
    appPath: path.join(xcode.TARGET_BUILD_DIR, xcode.EXECUTABLE_FOLDER_PATH),
    bundleId: xcode.PRODUCT_BUNDLE_IDENTIFIER,
    bundleBuildDir: xcode.CONFIGURATION_BUILD_DIR,
    bundleResourceDir: path.join(
      xcode.CONFIGURATION_BUILD_DIR,
      xcode.UNLOCALIZED_RESOURCES_FOLDER_PATH,
    ),
  };
};

const build = program.command('build');

build
  .command('ios')
  .description('Builds your app for iOS')
  .option(
    '--hermes [bool]',
    'Use Hermes or point to a prebuilt tarball',
    optionalBool,
    true,
  )
  .option(
    '--device',
    'Any simulator or a specific device (choices: "simulator", "device", other)',
    'simulator',
  )
  .option('--prod', 'Production build', () => true, false)
  .action(async ({device: _device, prod}: BuildOptions) => {
    const mode = prod ? 'Release' : 'Debug';

    let destination = 'simulator';
    switch (_device) {
      case 'simulator':
        break;
      case 'device':
        const device = await getSimulatorDetails(_device);
        destination = `id=${device.udid}`;
        break;
      default:
        destination = _device;
        break;
    }

    await pauseWatchman(async () => {
      await run(
        apple.build({
          isWorkspace: true,
          name: 'HelloWorld.xcworkspace',
          mode,
          scheme: 'HelloWorld',
          cwd: cwd.ios,
          env: {
            // TODO: This has to be fixed to just use metro and not the CLI
            // FORCE_BUNDLING: only === 'both' ? 'true' : 'false',
            SKIP_BUNDLING: 'true',
          },
          destination,
        }),
      );
    });
  });

type BundleOptions = {
  prod: boolean,
  watch: boolean,
  vm: 'hermes' | 'jsc',
};

const bundle = program.command('bundle');

bundle
  .command('ios')
  // TODO: Not sure if this is required, possibly just checking if hermes has been installed
  //       Q: does Pods/hermes-engine check work for prebuilt?
  //       Q: HERMES_ENGINE_TARBALL_PATH -> can we point
  .addOption(vmOption)
  .option(
    '--watch',
    'Watch and update JS changes',
    optionalBool,
    false,
  )
  .option('--prod', 'Production build', () => true, false)
  .action(async ({ prod, watch, vm }: BundleOptions) => {
    const mode = prod ? 'Release' : 'Debug';

    const isHermesInstalled = expensivePodCheck(cwd.ios, 'hermes-engine');
    const settings = await getBuildSettings(mode);

    // Metro: src -> js
    const jsBundlePath = path.join(settings.bundleBuildDir, 'main.jsbundle.js');
    // Hermes: js -> Hermes Byte Code
    const binaryBundlePath = path.join(
      settings.bundleResourceDir,
      'main.jsbundle',
    );

    // Validate only after initial build, as hermesc may not be prebuilt
    const hermesc = getExistingPath(possibleHermescPaths);

    if (hermesc == null) {
      throw new Error(
        `Unable to find hermesc at:\n-${possibleHermescPaths
          .map(line => ' - ' + line)
          .join('\n')}`,
      );
    }

    const bundler = watch
      ? app.bundle({
          mode: 'watch',
          cwd: cwd.root,
          entryFile: 'index.js',
          platform: 'ios',
          outputJsBundle: jsBundlePath,
          minify: false,
          optimize: false,
          outputSourceMap: settings.bundleResourceDir,
          outputBundle: binaryBundlePath,
          dev: !prod,
          vm: isHermesInstalled ? 'hermes' : 'jsc',
          hermes: {
            path: path.join(cwd.ios, 'Pods', 'hermes-engine'),
            hermesc: 'build_host_hermesc/bin/hermesc',
          },
          callback: metroProcess => {
            const readline = require('readline');
            readline.emitKeypressEvents(process.stdin);
            process.stdout.write('Press any key to close Metro...');
            // $FlowFixMe[prop-missing]
            process.stdin.setRawMode(true);
            process.stdin.once('keypress', () => {
              metroProcess.kill('SIGTERM');
            });
          },
        })
      : app.bundle({
          mode: 'bundle',
          cwd: cwd.root,
          entryFile: 'index.js',
          platform: 'ios',
          outputJsBundle: jsBundlePath,
          minify: false,
          optimize: false,
          outputSourceMap: settings.bundleResourceDir,
          outputBundle: binaryBundlePath,
          dev: !prod,
          vm: isHermesInstalled ? 'hermes' : 'jsc',
          hermes: {
            path: path.join(cwd.ios, 'Pods', 'hermes-engine'),
            hermesc: 'build_host_hermesc/bin/hermesc',
          },
        });

    // JS Bundle
    await run(bundler);
  });

type ShipOptions = {
  prod: boolean,
  device: string,
};

const ship = program.command('ship');

ship
  .command('ios')
  .option('--prod', 'Production build')
  .option('--device', 'Any simulator or a specific device', 'simulator')
  .action(async ({device: _device, prod}: ShipOptions) => {
    const [device, settings] = await Promise.all([
      getSimulatorDetails(_device),
      getBuildSettings(prod ? 'Release' : 'Debug'),
    ]);

    const {install} = apple.ios.install({
      cwd: cwd.ios,
      device: device.udid,
      appPath: settings.appPath,
      bundleId: settings.bundleId,
    });

    await new Listr([
      {
        title: 'Booting simulator',
        task: (_: mixed, task) => {
          if (device.state === 'Booted') {
            task.skip('Simulator currently Booted');
          } else {
            return bootSimulator(device);
          }
        },
      },
      {
        title: 'Launching simulator',
        task: () => launchSimulator(device),
      },
      {
        title: 'Installing app on simulator',
        task: () => install.action(),
      },
      {
        title: 'Launching app on simulator',
        task: () => launchApp(device.udid, settings.bundleId),
      },
    ]).run();
  });

if (require.main === module) {
  program.parse();
}

export default program;
