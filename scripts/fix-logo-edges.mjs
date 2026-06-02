// Repairs chipped / jagged edges on an already-transparent logo (head, etc.).
// Run with: node scripts/fix-logo-edges.mjs

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const logoPath = path.join(projectRoot, 'public', 'rolln-logo.png')
const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : logoPath
const outputPath = process.argv[3] ? path.resolve(process.argv[3]) : logoPath

function idx(width, x, y) {
  return (y * width + x) * 4
}

function dilateAlpha(out, width, height) {
  const copy = Buffer.from(out)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = idx(width, x, y)
      if (copy[p + 3] < 180) continue

      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
        const np = idx(width, nx, ny)
        if (out[np + 3] >= 80) continue

        out[np] = copy[p]
        out[np + 1] = copy[p + 1]
        out[np + 2] = copy[p + 2]
        out[np + 3] = Math.max(out[np + 3], 200)
      }
    }
  }
}

/** Remove tiny detached fragments (e.g. chipped pixels above the head). */
function removeSmallIslands(out, width, height, minArea = 64) {
  const opaque = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[idx(width, x, y) + 3] >= 72) opaque[y * width + x] = 1
    }
  }

  const visited = new Uint8Array(width * height)
  const components = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (!opaque[start] || visited[start]) continue

      const pixels = []
      const queue = [[x, y]]
      visited[start] = 1

      while (queue.length > 0) {
        const [cx, cy] = queue.pop()
        pixels.push([cx, cy])

        for (const [nx, ny] of [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const ni = ny * width + nx
          if (visited[ni] || !opaque[ni]) continue
          visited[ni] = 1
          queue.push([nx, ny])
        }
      }

      components.push(pixels)
    }
  }

  for (const pixels of components) {
    if (pixels.length >= minArea) continue
    for (const [cx, cy] of pixels) {
      const p = idx(width, cx, cy)
      out[p] = 0
      out[p + 1] = 0
      out[p + 2] = 0
      out[p + 3] = 0
    }
  }
}

function closeSmallHoles(out, width, height, maxArea = 240) {
  const opaque = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[idx(width, x, y) + 3] >= 72) opaque[y * width + x] = 1
    }
  }

  const visited = new Uint8Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (opaque[start] || visited[start]) continue

      const pixels = []
      const queue = [[x, y]]
      visited[start] = 1
      let touchesEdge = false

      while (queue.length > 0) {
        const [cx, cy] = queue.pop()
        pixels.push([cx, cy])
        if (cx === 0 || cy === 0 || cx === width - 1 || cy === height - 1) touchesEdge = true

        for (const [nx, ny] of [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          const ni = ny * width + nx
          if (visited[ni] || opaque[ni]) continue
          visited[ni] = 1
          queue.push([nx, ny])
        }
      }

      if (touchesEdge || pixels.length > maxArea) continue

      let sr = 0
      let sg = 0
      let sb = 0
      let samples = 0

      for (const [cx, cy] of pixels) {
        for (const [nx, ny] of [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          if (!opaque[ny * width + nx]) continue
          const p = idx(width, nx, ny)
          sr += out[p]
          sg += out[p + 1]
          sb += out[p + 2]
          samples++
        }
      }

      if (samples === 0) continue
      const fr = Math.round(sr / samples)
      const fg = Math.round(sg / samples)
      const fb = Math.round(sb / samples)

      for (const [cx, cy] of pixels) {
        const p = idx(width, cx, cy)
        out[p] = fr
        out[p + 1] = fg
        out[p + 2] = fb
        out[p + 3] = 255
      }
    }
  }
}

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height } = info
const out = Buffer.from(data)

removeSmallIslands(out, width, height)
dilateAlpha(out, width, height)
closeSmallHoles(out, width, height)
closeSmallHoles(out, width, height, 320)
dilateAlpha(out, width, height)

await sharp(out, {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Wrote ${path.relative(projectRoot, outputPath)}`)
