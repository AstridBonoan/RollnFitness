// Extracts logo from checkerboard exports and writes full + emblem-only marks.
// Run with: npm run logo:process

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')
const markPath = path.join(projectRoot, 'public', 'rolln-logo-mark.png')

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

function isCheckerboardLight(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  return sat <= 12 && l >= 88 && l <= 220
}

function isCheckerboardDark(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  return sat <= 14 && l >= 42 && l <= 82
}

function isDarkBackdrop(r, g, b) {
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  const l = luma(r, g, b)
  return sat <= 22 && l >= 28 && l <= 55
}

function isBackground(r, g, b) {
  return (
    isCheckerboardLight(r, g, b) ||
    isCheckerboardDark(r, g, b) ||
    isDarkBackdrop(r, g, b)
  )
}

function isLogoPixel(r, g, b) {
  if (isBackground(r, g, b)) return false

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

function findEmblemBottom(data, width, height) {
  const rowCounts = new Uint32Array(height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[idx(width, x, y) + 3] > 0) rowCounts[y]++
    }
  }

  const textThreshold = width * 0.12
  let textBandStart = height
  for (let y = Math.floor(height * 0.55); y < height; y++) {
    if (rowCounts[y] >= textThreshold) textBandStart = y
  }

  let emblemBottom = Math.floor(height * 0.72)
  for (let y = textBandStart - 1; y >= Math.floor(height * 0.45); y--) {
    if (rowCounts[y] < width * 0.05) {
      emblemBottom = y
      break
    }
  }

  const cap = Math.floor(height * 0.75)
  return Math.min(cap, Math.max(Math.floor(height * 0.68), emblemBottom))
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
    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]

    if (!logoMask[y * width + x] || !isLogoPixel(r, g, b)) {
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

const trimmed = await sharp(out, {
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
  .toBuffer()

const trimmedMeta = await sharp(trimmed).metadata()
const { data: trimmedData, info: trimmedInfo } = await sharp(trimmed)
  .raw()
  .toBuffer({ resolveWithObject: true })

const emblemBottom = findEmblemBottom(
  trimmedData,
  trimmedInfo.width,
  trimmedInfo.height,
)

const cropHeight = Math.min(
  trimmedInfo.height,
  Math.max(1, Math.floor(emblemBottom)),
)

await sharp(trimmed).png({ compressionLevel: 9 }).toFile(outputPath)

await sharp(trimmed)
  .extract({
    left: 0,
    top: 0,
    width: trimmedInfo.width,
    height: cropHeight,
  })
  .extend({
    top: 6,
    bottom: 6,
    left: 6,
    right: 6,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toFile(markPath)

let transparent = 0
const total = width * height
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (out[idx(width, x, y) + 3] === 0) transparent++
  }
}

console.log(
  `Wrote ${path.relative(projectRoot, outputPath)} (${Math.round((transparent / total) * 100)}% transparent, ${trimmedMeta.width}x${trimmedMeta.height})`,
)
console.log(
  `Wrote ${path.relative(projectRoot, markPath)} (emblem crop ${cropHeight}/${trimmedInfo.height}px)`,
)
