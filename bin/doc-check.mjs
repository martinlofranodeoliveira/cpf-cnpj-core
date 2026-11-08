#!/usr/bin/env node
// Demo: fixed documents, asserts expectations. --assert exits non-zero on mismatch.
import { check } from '../src/doc.mjs';

const CASES = [
  ['529.982.247-25', true],
  ['11.222.333/0001-81', true],
  ['52998224725', true],
  ['52998224726', false],
  ['11111111111', false],
];

let failed = 0;
for (const [input, expected] of CASES) {
  const r = check(input);
  const pass = r.ok === expected;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'} ${input} -> ${r.ok ? r.kind : r.code}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
