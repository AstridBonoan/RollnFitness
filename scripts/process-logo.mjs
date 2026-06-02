// Removes checkerboard / flat backgrounds from the Rolln logo PNG.
// Run with: node scripts/process-logo.mjs

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

function isBackgroundPixel(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)

  // Keep saturated logo colors (teal, blue, purple)
  if (sat > 28) return false

  // Checkerboard uses white + light/medium gray squares
  if (l >= 200) return true
  if (l >= 95 && l <= 210 && sat <= 20) return true

  return false
}

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const out = Buffer.alloc(data.length)

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const a = data[i + 3]

  out[i] = r
  out[i + 1] = g
  out[i + 2] = b
  out[i + 3] = a

  if (isBackgroundPixel(r, g, b)) {
    out[i + 3] = 0
    continue
  }

  // Soft edge: partially transparent near background tones
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  if (sat <= 28 && l >= 85 && l <= 220) {
    const t = Math.min(1, Math.max(0, (l - 85) / 135))
    out[i + 3] = Math.round(a * (1 - t * 0.85))
  }
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Wrote ${path.relative(projectRoot, outputPath)}`)
