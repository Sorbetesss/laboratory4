#!/usr/bin/env bash

function usage {
  echo "usage: syncFromGithub.sh <pathToGithubRepo> <pathToFbAndroidRepo>";
}

function patchfile {
  # Add React Native copyright
  printf "/**\n"  >> /tmp/csslayoutsync.tmp
  printf " * Copyright (c) 2014-present, Facebook, Inc.\n"  >> /tmp/csslayoutsync.tmp
  printf " * All rights reserved.\n" >> /tmp/csslayoutsync.tmp
  printf " * This source code is licensed under the BSD-style license found in the\n"  >> /tmp/csslayoutsync.tmp
  printf " * LICENSE file in the root directory of this source tree. An additional grant\n"  >> /tmp/csslayoutsync.tmp
  printf " * of patent rights can be found in the PATENTS file in the same directory.\n"  >> /tmp/csslayoutsync.tmp
  printf " */\n\n"  >> /tmp/csslayoutsync.tmp
  printf "// NOTE: this file is auto-copied from https://github.com/facebook/css-layout\n" >> /tmp/csslayoutsync.tmp
  # The following is split over four lines so Phabricator doesn't think this file is generated
  printf "// @g" >> /tmp/csslayoutsync.tmp
  printf "enerated <<S" >> /tmp/csslayoutsync.tmp
  printf "ignedSource::*O*zOeWoEQle#+L" >> /tmp/csslayoutsync.tmp
  printf "!plEphiEmie@IsG>>\n\n" >> /tmp/csslayoutsync.tmp
  tail -n +9 $1 >> /tmp/csslayoutsync.tmp
  mv /tmp/csslayoutsync.tmp $1
  $ROOT/scripts/signedsource.py sign $1
}

if [ -z $1 ]; then
  usage
  exit 1
fi

if [ -z $2 ]; then
  usage
  exit 1
fi

GITHUB=$1
ROOT=$2

set -e # exit if any command fails

echo "Making github project..."
pushd $GITHUB
COMMIT_ID=$(git rev-parse HEAD)
popd

SRC=$GITHUB/src/java/src/com/facebook/csslayout
TESTS=$GITHUB/src/java/tests/com/facebook/csslayout
FBA_SRC=$ROOT/java/com/facebook/catalyst/js/react-native-github/ReactAndroid/src/main/java/com/facebook/csslayout/
FBA_TESTS=$ROOT/javatests/com/facebook/csslayout

echo "Copying src files over..."
cp $SRC/*.java $FBA_SRC
echo "Copying test files over..."
cp $TESTS/*.java $FBA_TESTS

echo "Patching files..."
for sourcefile in $FBA_SRC/*.java; do
  patchfile $sourcefile
done
for testfile in $FBA_TESTS/*.java; do
  patchfile $testfile
done

echo "Writing README.facebook"

echo "The source of truth for css-layout is: https://github.com/facebook/css-layout

The code here should be kept in sync with GitHub.
HEAD at the time this code was synced: https://github.com/facebook/css-layout/commit/$COMMIT_ID

There is generated code in:
 - README.facebook (this file)
 - java/com/facebook/csslayout (this folder)
 - javatests/com/facebook/csslayout

The code was generated by running 'make' in the css-layout folder and running:

  ./syncFromGithub.sh <pathToGithubRepo> <pathToFbAndroid>
" > $FBA_SRC/README.facebook

echo "Writing README"

echo "The source of truth for css-layout is: https://github.com/facebook/css-layout

The code here should be kept in sync with GitHub.
HEAD at the time this code was synced: https://github.com/facebook/css-layout/commit/$COMMIT_ID

There is generated code in:
 - README (this file)
 - java/com/facebook/csslayout (this folder)
 - javatests/com/facebook/csslayout

The code was generated by running 'make' in the css-layout folder and copied to React Native.
" > $FBA_SRC/README

echo "fbandroid was updated. Please also update the fbobjc version under" \
  "fbobjc/Libraries/FBReactKit/js/react-native-github/React/Layout/Layout.c."
echo "Please run buck test //javatests/com/facebook/csslayout"
