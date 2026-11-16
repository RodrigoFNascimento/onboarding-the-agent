// Extracts a code snippet from a file under examples/, by name, with no markers in the code.
// Shared by the slides (slides/setup/preparser.ts) and the article (article/build.mjs).
//
//   File.cs               the whole file
//   File.cs#Cancel        the C# type or member named Cancel: its attributes ([Fact], ...)
//                         and declaration, through the closing brace or semicolon
//   File.md#conventions   the Markdown section whose heading slugifies to "conventions",
//                         through the line before the next heading of the same or higher level
//   File.md#frontmatter   the YAML frontmatter block, fences included
//
// The selector must match exactly once, or extraction fails loudly: a snippet that silently
// shows the wrong code is worse than a broken build.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const examplesDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'examples');

export function extract(file, selector) {
  const full = join(examplesDir, file);
  if (!existsSync(full)) throw new Error(`snippet file not found: examples/${file}`);
  const lines = readFileSync(full, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n').split('\n');
  if (!selector) return trim(lines);
  const ext = extname(file).toLowerCase();
  if (ext === '.cs') return trim(csharp(lines, selector, file));
  if (ext === '.md') return trim(markdown(lines, selector, file));
  throw new Error(`examples/${file}: selectors work for .cs and .md files only; import the whole file`);
}

function trim(lines) {
  const indents = lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map(l => l.slice(min).trimEnd()).join('\n').replace(/^\n+|\s+$/g, '');
}

function only(matches, what, file) {
  if (matches.length === 1) return matches[0];
  throw new Error(matches.length
    ? `examples/${file}: "${what}" matches ${matches.length} places (lines ${matches.map(i => i + 1).join(', ')})`
    : `examples/${file}: "${what}" not found`);
}

// --- C# -------------------------------------------------------------------------------
// A declaration line names the selector after a type keyword, or right before "(", "{", "=>"
// or "<" with a type in front of it (so calls like `OrderEndpoints.Cancel(` don't match).
function csharp(lines, name, file) {
  const id = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const typeDecl = new RegExp(`\\b(class|record|struct|interface|enum)\\s+${id}\\b`);
  const memberDecl = new RegExp(`^\\s*[\\w<>\\[\\],.?() ]*[\\w>\\]?]\\s+${id}\\s*(<[^>]*>)?\\s*(\\(|\\{|=>|$)`);
  const notStatement = /^\s*(return|var|await|new|if|else|throw|using|yield|case)\b/;
  const matches = lines.flatMap((l, i) => {
    const code = l.replace(/\/\/.*$/, '');
    const isDecl = typeDecl.test(code) || (memberDecl.test(code) && !notStatement.test(code) && !/=[^>]/.test(code.split(name)[0]));
    return isDecl ? [i] : [];
  });
  const decl = only(matches, name, file);

  let start = decl;
  while (start > 0 && /^\s*\[/.test(lines[start - 1])) start--; // attributes belong to it

  // Walk forward until the braces close, or a ';' ends an expression-bodied/abstract member.
  let braces = 0, parens = 0, opened = false;
  for (let i = decl; i < lines.length; i++) {
    for (const ch of stripLiterals(lines[i])) {
      if (ch === '(') parens++;
      else if (ch === ')') parens--;
      else if (ch === '{') { braces++; opened = true; }
      else if (ch === '}') braces--;
      else if (ch === ';' && braces === 0 && parens === 0) return lines.slice(start, i + 1);
    }
    if (opened && braces === 0) return lines.slice(start, i + 1);
  }
  throw new Error(`examples/${file}: couldn't find where "${name}" ends`);
}

// Blank out comments, strings and chars so their braces and semicolons don't count.
// Interpolation holes in $"..." are always balanced, so dropping them is safe.
function stripLiterals(line) {
  return line
    .replace(/\/\/.*$/, '')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)'/g, "''");
}

// --- Markdown -------------------------------------------------------------------------
const slugify = s => s.toLowerCase().replace(/`/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

function markdown(lines, selector, file) {
  if (selector === 'frontmatter') {
    if (lines[0] !== '---') throw new Error(`examples/${file}: no frontmatter`);
    const end = lines.indexOf('---', 1);
    return lines.slice(0, end + 1);
  }
  let inFence = false;
  const headings = [];
  lines.forEach((l, i) => {
    if (/^\s*(```|~~~)/.test(l)) inFence = !inFence;
    const m = !inFence && /^(#{1,6})\s+(.*)$/.exec(l);
    if (m) headings.push({ i, level: m[1].length, slug: slugify(m[2]) });
  });
  const at = only(headings.filter(x => x.slug === selector).map(x => x.i), selector, file);
  const h = headings.find(x => x.i === at);
  const next = headings.find(x => x.i > h.i && x.level <= h.level);
  return lines.slice(h.i, next ? next.i : lines.length);
}
