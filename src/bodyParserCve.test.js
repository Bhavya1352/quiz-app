import fs from 'fs';
import path from 'path';

// Guards the fix for GHSA-27r3-jxmh-p828 (CVE-2026-111181): the resolved
// body-parser version must be the patched 2.4.0. The package is a transitive
// dependency of express@4.21.2, so the pin lives in the lockfile (and in the
// package.json override that forces it). This fails when body-parser resolves
// to the vulnerable <2.4.0 line.
test('resolved body-parser version is patched against GHSA-27r3-jxmh-p828', () => {
  const lockfilePath = path.resolve(__dirname, '..', 'package-lock.json');
  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  const resolved = lockfile.packages['node_modules/body-parser'];
  expect(resolved).toBeDefined();
  expect(resolved.version).toBe('2.4.0');
});
