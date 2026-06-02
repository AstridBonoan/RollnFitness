// Smooth-edge transparent marks from rolln-logo-mark-source.png or rolln-logo-source.png
// Run with: npm run logo:mark

import sharp from 'sharp'
import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const markSourcePath = path.join(projectRoot, 'public', 'rolln-logo-mark-source.png')
const fullSourcePath = path.join(projectRoot, 'public', 'rolln-logo-source.png')
const markPath = path.join(projectRoot, 'public', 'rolln-logo-mark.png')
const mark2xPath = path.join(projectRoot, 'public', 'rolln-logo-mark@2x.png')

const luma = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b
const sat = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b)

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function isFlatBackground(r, g, b) {
  const s = sat(r, g, b)
  const l = luma(r, g, b)
  if (s <= 12 && l >= 88 && l <= 220) return true
  if (s <= 14 && l >= 42 && l <= 82) return true
  if (s <= 28 && l <= 52) return true
  return false
}

function sampleBackground(data, width, height) {
  const pts = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [width >> 1, 2],
    [2, height >> 1],
  ]
  let r = 0
  let g = 0
  let b = 0
  let n = 0
  for (const [x, y] of pts) {
    const p = (y * width + x) * 4
    const pr = data[p]
    const pg = data[p + 1]
    const pb = data[p + 2]
    if (isFlatBackground(pr, pg, pb)) {
      r += pr
      g += pg
      b += pb
      n++
    }
  }
  if (!n) return [19, 36, 35]
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
}

function colorDistance(r, g, b, bg) {
  const dr = r - bg[0]
  const dg = g - bg[1]
  const db = b - bg[2]
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function alphaForPixel(r, g, b, bg) {
  if (isFlatBackground(r, g, b)) return 0

  const s = sat(r, g, b)
  const l = luma(r, g, b)
  const dist = colorDistance(r, g, b, bg)

  let a = smoothstep(10, 48, dist)

  if (s > 70 && l > 55) a = Math.max(a, 0.92)
  if (s > 100 || l > 130) a = 1
  if (l > 175 && s > 25) a = 1

  return a
}

function defringe(r, g, b, a, bg) {
  if (a <= 0) return [0, 0, 0, 0]
  if (a >= 1) return [r, g, b, 255]

  const f = a
  const inv = 1 - f
  const nr = Math.round(Math.min(255, Math.max(0, (r - bg[0] * inv) / f)))
  const ng = Math.round(Math.min(255, Math.max(0, (g - bg[1] * inv) / f)))
  const nb = Math.round(Math.min(255, Math.max(0, (b - bg[2] * inv) / f)))
  return [nr, ng, nb, Math.round(a * 255)]
}

function idx(width, x, y) {
  return (y * width + x) * 4
}

function buildRgba(data, width, height) {
  const bg = sampleBackground(data, width, height)
  const out = Buffer.alloc(data.length)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = idx(width, x, y)
      const a = alphaForPixel(data[p], data[p + 1], data[p + 2], bg)
      const [r, g, b, alpha] = defringe(data[p], data[p + 1], data[p + 2], a, bg)
      out[p] = r
      out[p + 1] = g
      out[p + 2] = b
      out[p + 3] = alpha
    }
  }

  return out
}

function findEmblemBottom(data, width, height) {
  const rowCounts = new Uint32Array(height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[idx(width, x, y) + 3] > 8) rowCounts[y]++
    }
  }

  let textBandStart = height
  for (let y = Math.floor(height * 0.58); y < height; y++) {
    if (rowCounts[y] > width * 0.14) textBandStart = y
  }

  let emblemBottom = Math.floor(height * 0.74)
  for (let y = textBandStart - 1; y >= Math.floor(height * 0.45); y--) {
    if (rowCounts[y] < width * 0.035) {
      emblemBottom = y
      break
    }
  }

  return Math.min(Math.floor(height * 0.76), Math.max(Math.floor(height * 0.68), emblemBottom + 4))
}

async function pickSourcePath() {
  try {
    await access(markSourcePath)
    const meta = await sharp(markSourcePath).metadata()
    if ((meta.width ?? 0) >= 900) return markSourcePath
  } catch {
    /* use full source */
  }
  return fullSourcePath
}

const sourcePath = await pickSourcePath()
const hasFullText = sourcePath === fullSourcePath

const { data, info } = await sharp(sourcePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
let rgba = buildRgba(data, width, height)

let cropHeight = height
if (hasFullText) {
  cropHeight = findEmblemBottom(rgba, width, height)
}

let pipeline = sharp(rgba, { raw: { width, height, channels: 4 } })
if (cropHeight < height) {
  pipeline = pipeline.extract({ left: 0, top: 0, width, height: cropHeight })
}
const cropped = await pipeline.png().toBuffer()

const trimmed = await sharp(cropped)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
  .extend({
    top: 6,
    bottom: 6,
    left: 6,
    right: 6,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer()

const trimmedMeta = await sharp(trimmed).metadata()
const targetWidth = Math.min(520, trimmedMeta.width ?? 520)

const mark1x = await sharp(trimmed)
  .resize({ width: targetWidth, kernel: sharp.kernel.lanczos3 })
  .png({ compressionLevel: 6, adaptiveFiltering: false })
  .toBuffer()

const meta = await sharp(mark1x).metadata()
await sharp(mark1x).toFile(markPath)

await sharp(mark1x)
  .resize({
    width: (meta.width ?? targetWidth) * 2,
    kernel: sharp.kernel.lanczos3,
  })
  .png({ compressionLevel: 6, adaptiveFiltering: false })
  .toFile(mark2xPath)

const { data: outData, info: outInfo } = await sharp(mark1x)
  .raw()
  .toBuffer({ resolveWithObject: true })
let semi = 0
for (let i = 3; i < outData.length; i += 4) {
  if (outData[i] > 0 && outData[i] < 255) semi++
}

console.log(`Source: ${path.relative(projectRoot, sourcePath)}`)
console.log(
  `Wrote ${path.relative(projectRoot, markPath)} (${meta.width}x${meta.height}, ${Math.round((semi / (outInfo.width * outInfo.height)) * 100)}% soft edge)`,
)
console.log(
  `Wrote ${path.relative(projectRoot, mark2xPath)} (${(meta.width ?? 0) * 2}x${(meta.height ?? 0) * 2})`,
)
