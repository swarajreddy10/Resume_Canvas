import { afterAll, describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  executableLines,
  unloadedLcov,
} from '../../scripts/lcov-unloaded-files';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lcov-unloaded-'));
afterAll(() => fs.rmSync(dir, { recursive: true, force: true }));

function write(name: string, text: string) {
  const file = path.join(dir, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  return path.relative('.', file).split(path.sep).join('/');
}

describe('executableLines', () => {
  test('counts statement lines and skips imports, types, comments and blanks', () => {
    const file = write(
      'sample.tsx',
      [
        "import { x } from './x';", // 1 skipped
        'type T = { a: number };', // 2 skipped
        'interface I {', // 3 skipped
        '  b: string;', // 4 skipped
        '}', // 5 skipped
        '', // 6 skipped
        '// a comment', // 7 skipped
        'export function f(a: number) {', // 8
        '  const y = {', // 9
        '    a,', // 10
        '  };', // 11
        '', // 12 skipped
        '  return <div>{y.a}</div>;', // 13
        '}', // 14
        'declare const g: number;', // 15 skipped
        'export const h = 1;', // 16
      ].join('\n')
    );
    expect(executableLines(file)).toEqual([8, 9, 10, 11, 13, 14, 16]);
  });
});

describe('unloadedLcov', () => {
  test('adds a zero-hit record only for files no report covers', () => {
    const root = path.join(dir, 'src');
    const covered = write('src/covered.ts', 'export const a = 1;\n');
    const missed = write('src/nested/missed.ts', 'export const b = 2;\n');
    write('src/types.d.ts', 'declare const c: number;\n');
    write('src/only-types.ts', 'export type D = string;\n');
    const report = path.join(dir, 'lcov.info');
    fs.writeFileSync(report, `TN:\nSF:${covered}\nDA:1,1\nend_of_record\n`);

    expect(unloadedLcov([report], root)).toBe(
      `TN:\nSF:${missed}\nDA:1,0\nLF:1\nLH:0\nend_of_record\n`
    );
  });

  test('is empty when every file is covered', () => {
    const root = path.join(dir, 'all');
    const only = write('all/only.ts', 'export const e = 3;\n');
    const report = path.join(dir, 'all.info');
    fs.writeFileSync(report, `TN:\nSF:${only}\nDA:1,1\nend_of_record\n`);
    expect(unloadedLcov([report], root)).toBe('');
  });
});
