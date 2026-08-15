import sharp from "sharp";
import { mkdirSync } from "fs";

const outDir = "public/xamxam-icons";
mkdirSync(outDir, { recursive: true });

const sourceLogo = "public/logo majalis.png";
// Square crop of just the "M" mark (no wordmark) from the source logo.
const markCrop = { left: 277, top: 60, width: 700, height: 700 };

const roundedRectSvg = (size, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/>
  </svg>`;

const icons = [
  { size: 192, name: "icon-192.png", radiusRatio: 0.2, contentRatio: 0.76 },
  { size: 512, name: "icon-512.png", radiusRatio: 0.2, contentRatio: 0.76 },
  { size: 512, name: "icon-maskable-512.png", radiusRatio: 0, contentRatio: 0.6 },
  { size: 180, name: "apple-touch-icon.png", radiusRatio: 0, contentRatio: 0.78 },
];

const mark = sharp(sourceLogo).extract(markCrop);

for (const { size, name, radiusRatio, contentRatio } of icons) {
  const contentSize = Math.round(size * contentRatio);
  const offset = Math.round((size - contentSize) / 2);

  const canvas = await sharp(Buffer.from(roundedRectSvg(size, Math.round(size * radiusRatio))))
    .png()
    .toBuffer();

  const content = await mark.clone().resize(contentSize, contentSize).png().toBuffer();

  await sharp(canvas)
    .composite([{ input: content, left: offset, top: offset }])
    .png()
    .toFile(`${outDir}/${name}`);

  console.log(`Generated ${outDir}/${name}`);
}

console.log("Done.");
