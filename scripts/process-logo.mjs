// Removes the light gray wall background from the Rolln Enterprises logo.
// Run with: node scripts/process-logo.mjs

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

// Crop inward to drop blurred office edges before background removal.
const CROP = { left: 0.08, top: 0.06, width: 0.84, height: 0.88 }

// Desaturated bright pixels are treated as wall/background.
const BG_SAT_MAX = 42
const BG_LUMA_SOLID = 155
const BG_LUMA_FADE_START = 115
const BG_LUMA_FADE_END = 175

const meta = await sharp(sourcePath).metadata()
const cropLeft = Math.round(meta.width * CROP.left)
const cropTop = Math.round(meta.height * CROP.top)
const cropWidth = Math.round(meta.width * CROP.width)
const cropHeight = Math.round(meta.height * CROP.height)

const { data, info } = await sharp(sourcePath)
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const out = Buffer.alloc(data.length)

for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const a = data[i + 3]
  const l = luma(r, g, b)
  const sat = Math.max(r, g, b) - Math.min(r, g, b)

  out[i] = r
  out[i + 1] = g
  out[i + 2] = b
  out[i + 3] = a

  if (sat >= BG_SAT_MAX) continue

  if (l >= BG_LUMA_SOLID) {
    out[i + 3] = 0
    continue
  }

  if (l >= BG_LUMA_FADE_START && l < BG_LUMA_FADE_END) {
    const t = (l - BG_LUMA_FADE_START) / (BG_LUMA_FADE_END - BG_LUMA_FADE_START)
    out[i + 3] = Math.round(a * (1 - t))
  }
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Wrote ${path.relative(projectRoot, outputPath)}`)
