// Code on slides comes from examples/ by name, with no markers in the code:
//   <<< @/../examples/02-x/src/X/File.cs#Cancel cs {1-3|5|all}
// Slidev's own `<<<` only understands region comments, so lines with a selector are
// replaced here by a fenced code block (keeping the language and highlight steps).
// Lines without a selector (whole files) are left to Slidev.
import { definePreparserSetup } from '@slidev/types'
import { extract } from '../../scripts/snippet.mjs'

const IMPORT = /^(\s*)<<<\s*@\/\.\.\/examples\/(\S+?)#([\w-]+)(?:\s+(\w+))?\s*(\{.*\})?\s*$/

export default definePreparserSetup(() => [
  {
    transformRawLines(lines) {
      for (let i = 0; i < lines.length; i++) {
        const m = IMPORT.exec(lines[i])
        if (!m) continue
        const [, indent, file, selector, lang = '', meta = ''] = m
        const code = extract(file, selector)
        if (code.includes('```'))
          throw new Error(`examples/${file}#${selector} contains a code fence; it can't go on a slide this way`)
        const fence = [`${lang} ${meta}`.trim(), ...code.split('\n'), ''].map((l, j) =>
          j === 0 ? `${indent}\`\`\`${l}` : l ? `${indent}${l}` : '')
        fence[fence.length - 1] = `${indent}\`\`\``
        lines.splice(i, 1, ...fence)
        i += fence.length - 1
      }
    },
  },
])
