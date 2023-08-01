const SUPPORTED_PLATFORMS = ['ios', 'android'];

if (process.argv.length !== 3 || !SUPPORTED_PLATFORMS.includes(process.argv[2])) {
  throw new Error(`Invalid platform. Supported platforms are: ${SUPPORTED_PLATFORMS.join(', ')}`);
}

const platform = process.argv[2];
const { execSync } = require('child_process');
execSync(`E2E_DEVICE=${platform} jest --runInBand`, { stdio: 'inherit' });
