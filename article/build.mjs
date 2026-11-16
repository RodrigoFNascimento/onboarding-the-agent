// Builds the article into an output folder (default: dist-preview/).
//   node build.mjs [--out <dir>]
// - copies en/, pt-br/ and assets/
// - replaces <!-- snippet: <path under examples/>[#<name>] [lang] --> with that code
//   (found by name, see ../scripts/snippet.mjs)
// - writes a root index.html that redirects to the reader's language
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract } from '../scripts/snippet.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outArg = process.argv.indexOf('--out');
const out = resolve(here, outArg > -1 ? process.argv[outArg + 1] : 'dist-preview');

const LANG_BY_EXT = { '.cs': 'csharp', '.fs': 'fsharp', '.json': 'json', '.xml': 'xml', '.csproj': 'xml', '.sql': 'sql', '.js': 'javascript', '.ts': 'typescript', '.yml': 'yaml', '.yaml': 'yaml', '.sh': 'bash', '.md': 'markdown' };

const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderSnippets(html, page) {
  return html.replace(/^([ \t]*)<!--\s*snippet:\s*([^#\s]+)(?:#(\S+))?(?:\s+(\w+))?\s*-->/gm, (_, indent, file, selector, lang) => {
    try {
      const code = extract(file, selector);
      const language = lang || LANG_BY_EXT[extname(file)] || 'plaintext';
      const src = `https://github.com/RodrigoFNascimento/${slug()}/blob/main/examples/${file}`;
      return `${indent}<pre class="code"><code class="language-${language}">${escape(code)}</code></pre>\n` +
             `${indent}<a class="code-source" href="${src}">${file}</a>`;
    } catch (e) {
      throw new Error(`${page}: ${e.message}`);
    }
  });
}

// The slug is the repo's npm package name (talk/ notes are local only, so CI can't read them).
function slug() {
  return JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8')).name;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(here, 'assets'), join(out, 'assets'), { recursive: true });

for (const lang of ['en', 'pt-br']) {
  const src = join(here, lang, 'index.html');
  const html = renderSnippets(readFileSync(src, 'utf8'), `${lang}/index.html`);
  mkdirSync(join(out, lang), { recursive: true });
  writeFileSync(join(out, lang, 'index.html'), html);
}

writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting…</title>
<link rel="alternate" hreflang="en" href="en/"><link rel="alternate" hreflang="pt-BR" href="pt-br/">
<style>body{background:#0f1218;color:#e8ecf3;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}a{color:#7c9cff}</style>
<script>
  var l = null; try { l = localStorage.getItem('lang'); } catch (e) {}
  if (!l) l = (navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt-br' : 'en';
  location.replace(l + '/');
</script></head>
<body><p><a href="en/">English</a> · <a href="pt-br/">Português (BR)</a></p></body></html>
`);

console.log(`article built → ${out}`);
