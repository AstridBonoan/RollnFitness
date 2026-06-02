// Removes grey checkerboard from the Rolln logo without eating metallic edges.
// Run with: npm run logo:process

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const outputPath = path.join(projectRoot, 'public', 'rolln-logo.png')

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b

/** Grey checkerboard tiles from the Gemini export (dark ~38, light ~91). */
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
    top: 10,
    bottom: 8,
    left: 8,
    right: 8,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

const { data: check } = await sharp(outputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
let transparent = 0
for (let i = 3; i < check.length; i += 4) {
  if (check[i] === 0) transparent++
}
console.log(
  `Wrote ${path.relative(projectRoot, outputPath)} (${info.width}x${info.height}, ${Math.round((transparent / (width * height)) * 100)}% transparent)`,
)
