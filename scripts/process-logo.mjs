// Converts checkerboard transparency export to real PNG alpha.
// Run with: npm run logo:process

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

/** Light (#c8c8c8) and dark (#3c3c3c) checkerboard tiles. */
function isCheckerboard(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (sat > 18) return false

  const l = luma(r, g, b)
  if (l >= 82 && l <= 118) return true
  if (l >= 48 && l <= 72) return true

  return false
}

function idx(width, x, y) {
  return (y * width + x) * 4
}

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
const out = Buffer.alloc(data.length)

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = idx(width, x, y)

    if (isCheckerboard(data[p], data[p + 1], data[p + 2])) {
      out[p] = 0
      out[p + 1] = 0
      out[p + 2] = 0
      out[p + 3] = 0
      continue
    }

    out[p] = data[p]
    out[p + 1] = data[p + 1]
    out[p + 2] = data[p + 2]
    out[p + 3] = 255
  }
}

await sharp(out, {
  raw: { width, height, channels: 4 },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .extend({
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

let transparent = 0
const total = width * height
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (out[idx(width, x, y) + 3] === 0) transparent++
  }
}
console.log(
  `Wrote ${path.relative(projectRoot, outputPath)} (${Math.round((transparent / total) * 100)}% transparent)`,
)
