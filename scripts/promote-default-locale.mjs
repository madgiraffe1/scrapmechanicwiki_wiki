import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join(process.cwd(), 'out')
const defaultLocale = 'en'

if (!fs.existsSync(outDir)) {
  throw new Error('Missing out directory. Run next build before promoting default locale.')
}

function copyIfExists(from, to) {
  if (!fs.existsSync(from)) return false
  fs.cpSync(from, to, { recursive: true, force: true })
  return true
}

copyIfExists(path.join(outDir, `${defaultLocale}.html`), path.join(outDir, 'index.html'))
copyIfExists(path.join(outDir, `${defaultLocale}.txt`), path.join(outDir, 'index.txt'))

const localeDir = path.join(outDir, defaultLocale)
if (fs.existsSync(localeDir)) {
  for (const entry of fs.readdirSync(localeDir)) {
    copyIfExists(path.join(localeDir, entry), path.join(outDir, entry))
  }
}

console.log(`Promoted ${defaultLocale} static export to root paths.`)
