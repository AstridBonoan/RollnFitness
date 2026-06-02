// Keeps only logo artwork (figure, trails, text) — removes gray patch + dark backdrop.
// Run with: npm run logo:process

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

function isWarmMetal(r, g, b) {
  return r > 108 && g > 78 && b < 98 && r > b + 14 && r >= g - 20
}

function isCyanEnergy(r, g, b) {
  return b > 105 && b > r + 28
}

function isVitalityGreen(r, g, b) {
  return g > 125 && g > r + 32 && g > b + 10
}

function isCircuitGold(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  return r > 155 && g > 105 && sat > 38
}

function isNeutralBackdrop(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  return sat < 32 && l < 95 && Math.abs(r - g) < 22 && Math.abs(g - b) < 28
}

function isLogoPixel(r, g, b) {
  if (isWarmMetal(r, g, b) || isCyanEnergy(r, g, b) || isVitalityGreen(r, g, b) || isCircuitGold(r, g, b)) {
    return true
  }

  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)

  if (sat > 55 && l > 35) return true
  if (l > 175 && sat > 28) return true

  return false
}

function idx(width, x, y) {
  return (y * width + x) * 4
}

function buildLogoMask(data, width, height) {
  const core = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = idx(width, x, y)
      if (isLogoPixel(data[p], data[p + 1], data[p + 2])) core[y * width + x] = 1
    }
  }

  const mask = new Uint8Array(width * height)
  const radius = 3
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!core[y * width + x]) continue
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
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

    if (!logoMask[y * width + x]) {
      out[p] = 0
      out[p + 1] = 0
      out[p + 2] = 0
      out[p + 3] = 0
      continue
    }

    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]

    if (!isLogoPixel(r, g, b) || isNeutralBackdrop(r, g, b)) {
      out[p] = 0
      out[p + 1] = 0
      out[p + 2] = 0
      out[p + 3] = 0
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
