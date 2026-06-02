// Builds crisp transparent emblem marks from rolln-logo-mark-source.png
// Run with: npm run logo:mark

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-mark-source.png')
const markPath = path.join(projectRoot, 'public', 'rolln-logo-mark.png')
const mark2xPath = path.join(projectRoot, 'public', 'rolln-logo-mark@2x.png')

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

function isTealGreenGradient(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  if (sat < 25 || l < 40) return false
  if (b > 70 && g > 60) return true
  if (g > 80 && r < 120) return true
  return false
}

function isDarkBackdrop(r, g, b, a = 255) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  if (a < 12) return true
  if (l <= 48 && sat <= 40) return true
  if (r < 45 && g < 55 && b < 55 && g >= r - 8 && b >= r - 10) return true
  return false
}

function isLogoPixel(r, g, b, a = 255) {
  if (isDarkBackdrop(r, g, b, a)) return false

  if (
    isWarmMetal(r, g, b) ||
    isCyanEnergy(r, g, b) ||
    isVitalityGreen(r, g, b) ||
    isCircuitGold(r, g, b) ||
    isTealGreenGradient(r, g, b)
  ) {
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
      if (isLogoPixel(data[p], data[p + 1], data[p + 2], data[p + 3])) {
        core[y * width + x] = 1
      }
    }
  }

  const mask = new Uint8Array(width * height)
  const radius = 2
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

function rgbaBuffer(data, width, height, logoMask) {
  const out = Buffer.alloc(data.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = idx(width, x, y)
      const r = data[p]
      const g = data[p + 1]
      const b = data[p + 2]

      if (!logoMask[y * width + x] || !isLogoPixel(r, g, b, data[p + 3])) {
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
  return out
}

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
const logoMask = buildLogoMask(data, width, height)
const out = rgbaBuffer(data, width, height, logoMask)

const mark1x = await sharp(out, { raw: { width, height, channels: 4 } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .extend({
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 6, adaptiveFiltering: true })
  .toBuffer()

const meta = await sharp(mark1x).metadata()
await sharp(mark1x).toFile(markPath)

await sharp(mark1x)
  .resize({
    width: meta.width * 2,
    height: meta.height * 2,
    kernel: sharp.kernel.lanczos3,
  })
  .sharpen({ sigma: 0.65, m1: 0.75, m2: 0.25, x1: 2, y2: 8, y3: 16 })
  .png({ compressionLevel: 6, adaptiveFiltering: true })
  .toFile(mark2xPath)

console.log(`Wrote ${path.relative(projectRoot, markPath)} (${meta.width}x${meta.height})`)
console.log(
  `Wrote ${path.relative(projectRoot, mark2xPath)} (${meta.width * 2}x${meta.height * 2})`,
)
