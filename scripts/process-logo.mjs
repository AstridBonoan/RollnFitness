// Removes grey checkerboard and exports logo for the warm dark site background.
// Run with: npm run logo:process

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')

/** Matches tailwind navy-950 / site background */
const SITE_BG = { r: 15, g: 8, b: 5 }

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

function isBackgroundPixel(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (sat > 22) return false

  const l = luma(r, g, b)
  if (l >= 26 && l <= 52) return true
  if (l >= 70 && l <= 108) return true

  return false
}

function isLogoCore(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)

  if (sat <= 12 && l >= 26 && l <= 108) return false
  if (sat > 22) return true
  if (r > g + 12 && r > b + 8) return true
  if (l < 65) return true

  return false
}

function idx(width, x, y) {
  return (y * width + x) * 4
}

function buildLogoMask(data, width, height, expandRadius = 6) {
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
      out[p] = SITE_BG.r
      out[p + 1] = SITE_BG.g
      out[p + 2] = SITE_BG.b
      out[p + 3] = 255
      continue
    }

    out[p] = r
    out[p + 1] = g
    out[p + 2] = b
    out[p + 3] = 255
  }
}

await sharp(out, {
  raw: { width, height, channels: 4 },
})
  .trim({ background: SITE_BG, threshold: 2 })
  .extend({
    top: 10,
    bottom: 8,
    left: 8,
    right: 8,
    background: SITE_BG,
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Wrote ${path.relative(projectRoot, outputPath)}`)
