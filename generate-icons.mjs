import sharp from 'sharp'
import fs from 'node:fs'

const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="${size*0.22}" fill="#5B7A5F"/>
  <rect x="14" y="14" width="72" height="72" rx="20" fill="none" stroke="white" stroke-opacity="0.12" stroke-width="2"/>
  <path d="M50 18 C50 18 28 36 28 52 C28 64.5 37.5 74 50 74 C62.5 74 72 64.5 72 52 C72 36 50 18 50 18Z" fill="none" stroke="white" stroke-width="4" stroke-linejoin="round"/>
  <path d="M50 74 L50 82" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="52" r="9" fill="white"/>
  <circle cx="50" cy="52" r="3.5" fill="#5B7A5F"/>
  <g opacity="0.0">
    <rect width="100" height="100" fill="#5B7A5F"/>
  </g>
</svg>
`

const maskableSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="0" fill="#5B7A5F"/>
  <g transform="translate(10 10) scale(0.8)">
    <rect x="14" y="14" width="72" height="72" rx="20" fill="none" stroke="white" stroke-opacity="0.12" stroke-width="2"/>
    <path d="M50 18 C50 18 28 36 28 52 C28 64.5 37.5 74 50 74 C62.5 74 72 64.5 72 52 C72 36 50 18 50 18Z" fill="none" stroke="white" stroke-width="4" stroke-linejoin="round"/>
    <path d="M50 74 L50 82" stroke="white" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="52" r="9" fill="white"/>
    <circle cx="50" cy="52" r="3.5" fill="#5B7A5F"/>
  </g>
</svg>
`

async function gen() {
  fs.mkdirSync('public/icons', { recursive: true })
  fs.mkdirSync('public/screenshots', { recursive: true })

  for (const size of [192, 512]) {
    await sharp(Buffer.from(svg(size))).png().toFile(`public/icons/icon-${size}.png`)
    console.log(`icon-${size}`)
  }
  for (const size of [192, 512]) {
    await sharp(Buffer.from(maskableSvg(size))).png().toFile(`public/icons/maskable-${size}.png`)
    console.log(`maskable-${size}`)
  }
  // apple touch 180
  await sharp(Buffer.from(svg(180))).png().toFile(`public/icons/apple-touch.png`)
  await sharp(Buffer.from(svg(180))).png().toFile(`public/apple-touch-icon.png`)
  // favicon svg copy
  fs.writeFileSync('public/favicon.svg', svg(32))

  // screenshots placeholders
  const narrowSvg = `<svg width="540" height="720" viewBox="0 0 540 720" xmlns="http://www.w3.org/2000/svg"><rect width="540" height="720" rx="32" fill="#FDF8F1"/><rect x="20" y="20" width="500" height="680" rx="24" fill="white" stroke="#E5E4E7"/><text x="270" y="360" text-anchor="middle" font-family="system-ui" font-size="24" fill="#5B7A5F" font-weight="600">Scroll Guard — Home</text></svg>`
  const wideSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"><rect width="1280" height="720" fill="#FDF8F1"/><rect x="40" y="40" width="1200" height="640" rx="24" fill="white" stroke="#E5E4E7"/><text x="640" y="360" text-anchor="middle" font-family="system-ui" font-size="28" fill="#5B7A5F" font-weight="600">Scroll Guard — Pause and Decide (Wide)</text></svg>`
  await sharp(Buffer.from(narrowSvg)).png().toFile('public/screenshots/narrow.png')
  await sharp(Buffer.from(wideSvg)).png().toFile('public/screenshots/wide.png')
  console.log('done')
}
gen()
