// Removes checkerboard background from the Rolln logo PNG without eating figure edges.
// Run with: npm run logo:process && npm run logo:fix

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

  if (sat > 28) return false
  if (l >= 200) return true
  if (l >= 95 && l <= 210 && sat <= 20) return true

  return false
}

function isLogoCore(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (sat > 24) return true
  if (b > r + 6 && b > g + 3) return true
  return false
}

function idx(width, x, y) {
  return (y * width + x) * 4
}

function buildLogoMask(data, width, height, expandRadius = 4) {
  const core = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = idx(width, x, y)
      if (isLogoCore(data[p], data[p + 1], data[p + 2])) core[y * width + x] = 1
    }
  }

  const mask = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!core[y * width + x]) continue
      for (let dy = -expandRadius; dy <= expandRadius; dy++) {
        for (let dx = -expandRadius; dx <= expandRadius; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          mask[ny * width + nx] = 1
        }
      }
    }
  }

  return mask
}

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
const logoMask = buildLogoMask(data, width, height)
const out = Buffer.alloc(data.length)

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = idx(width, x, y)
    const i = y * width + x
    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]

    if (isBackgroundPixel(r, g, b) && !logoMask[i]) {
      out[p] = 0
      out[p + 1] = 0
      out[p + 2] = 0
      out[p + 3] = 0
      continue
    }

    out[p] = r
    out[p + 1] = g
    out[p + 2] = b
    out[p + 3] = data[p + 3]

    if (out[p + 3] > 0) {
      const pixelLuma = luma(out[p], out[p + 1], out[p + 2])
      const boost = pixelLuma < 140 ? 1.25 + ((140 - pixelLuma) / 140) * 0.45 : 1.12
      out[p] = Math.min(255, Math.round(out[p] * boost + 12))
      out[p + 1] = Math.min(255, Math.round(out[p + 1] * boost + 14))
      out[p + 2] = Math.min(255, Math.round(out[p + 2] * boost + 18))
    }
  }
}

const PAD_TOP = 14
const PAD_SIDE = 6

await sharp(out, {
  raw: { width, height, channels: 4 },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .extend({
    top: PAD_TOP,
    bottom: PAD_SIDE,
    left: PAD_SIDE,
    right: PAD_SIDE,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Wrote ${path.relative(projectRoot, outputPath)}`)
