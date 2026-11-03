/**
 * Appends a zero-coverage LCOV record for every application source file that no test run
 * loaded, so SonarQube Cloud counts those files as uncovered instead of leaving them out.
 *
 * Bun's coverage "only tracks files that are loaded" and has no option to include the
 * rest (https://bun.com/docs/test/code-coverage; oven-sh/bun#5928). Without these records
 * a pull request that adds a file no test imports would show no lines to cover, and the
 * coverage-on-new-code gate would pass it.
 *
 * A record lists the non-blank, non-comment lines of the file's top-level executable
 * statements, found with the TypeScript parser; imports, type-only declarations and
 * `declare` statements are skipped. On the 66 source files the tests do load, this counts
 * 4,884 lines where Bun counts 4,567 (1.07x, measured 2026-11-03), so an unloaded file
 * weighs about what Bun would give it.
 *
 * Usage: bun scripts/lcov-unloaded-files.ts <lcov.info>... > coverage-unloaded/lcov.info
 */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const SOURCE_ROOT = 'src';

/** Absolute paths of the files an LCOV report covers (its paths are cwd-relative). */
function filesIn(lcovPath: string): Set<string> {
  const files = new Set<string>();
  for (const line of fs.readFileSync(lcovPath, 'utf8').split('\n')) {
    if (line.startsWith('SF:')) files.add(path.resolve(line.slice(3).trim()));
  }
  return files;
}

/** Absolute paths of the TypeScript sources under `dir`, declaration files excluded. */
function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.resolve(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')
      ? [full]
      : [];
  });
}

function isExecutable(node: ts.Statement): boolean {
  if (
    ts.isImportDeclaration(node) ||
    ts.isImportEqualsDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEmptyStatement(node) ||
    (ts.isExportDeclaration(node) && node.isTypeOnly)
  ) {
    return false;
  }
  const modifiers = ts.canHaveModifiers(node)
    ? ts.getModifiers(node)
    : undefined;
  return !modifiers?.some((m) => m.kind === ts.SyntaxKind.DeclareKeyword);
}

/**
 * 1-based numbers of the non-blank, non-comment lines spanned by the file's top-level
 * executable statements.
 */
export function executableLines(file: string): number[] {
  const text = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const textLines = text.split('\n');
  const lines = new Set<number>();
  for (const node of source.statements) {
    if (!isExecutable(node)) continue;
    const first = source.getLineAndCharacterOfPosition(
      node.getStart(source)
    ).line;
    const last = source.getLineAndCharacterOfPosition(node.getEnd()).line;
    for (let i = first; i <= last; i++) {
      const s = textLines[i].trim();
      if (
        s &&
        !s.startsWith('//') &&
        !s.startsWith('/*') &&
        !s.startsWith('*')
      ) {
        lines.add(i + 1);
      }
    }
  }
  return [...lines].sort((a, b) => a - b);
}

/** LCOV records, at zero hits, for the files under `root` that no report covers. */
export function unloadedLcov(reports: string[], root = SOURCE_ROOT): string {
  const loaded = new Set(reports.flatMap((r) => [...filesIn(r)]));
  const out: string[] = [];
  for (const file of sourceFiles(root)) {
    if (loaded.has(file)) continue;
    const lines = executableLines(file);
    if (lines.length === 0) continue;
    // Repository-relative with forward slashes, as Bun writes on CI; SonarQube Cloud
    // resolves it from the project root.
    out.push('TN:', `SF:${path.relative('.', file).split(path.sep).join('/')}`);
    for (const n of lines) out.push(`DA:${n},0`);
    out.push(`LF:${lines.length}`, 'LH:0', 'end_of_record');
  }
  return out.length ? out.join('\n') + '\n' : '';
}

if (import.meta.main) {
  const reports = process.argv.slice(2);
  if (reports.length === 0) {
    throw new Error('usage: bun scripts/lcov-unloaded-files.ts <lcov.info>...');
  }
  process.stdout.write(unloadedLcov(reports));
}
