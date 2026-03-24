import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function resolveVersion() {
  const ciSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.CI_COMMIT_SHA;
  if (ciSha) return ciSha.slice(0, 12);

  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
  } catch {
    return Date.now().toString(36);
  }
}

const version = resolveVersion();
const output = `self.__SW_CACHE_VERSION__ = '${version}';\n`;
const targetPath = path.join(process.cwd(), 'public', 'sw-version.js');
fs.writeFileSync(targetPath, output, 'utf8');
console.log(`[sw-version] ${version}`);
