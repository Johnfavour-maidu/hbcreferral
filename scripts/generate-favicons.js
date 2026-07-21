const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC = path.join(__dirname, "..", "public", "favicon.png");
const OUT = path.join(__dirname, "..", "public", "favicon");

const SIZES = {
  "favicon-16x16.png": 16,
  "favicon-32x32.png": 32,
  "favicon-48x48.png": 48,
  "favicon-64x64.png": 64,
  "favicon-96x96.png": 96,
  "favicon-128x128.png": 128,
  "apple-touch-icon.png": 180,
  "android-chrome-192x192.png": 192,
  "mstile-150x150.png": 150,
  "favicon-256x256.png": 256,
  "favicon-384x384.png": 384,
  "android-chrome-512x512.png": 512,
};

async function generate() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  // Read source
  const original = sharp(SRC);
  const meta = await original.metadata();
  console.log(`Source: ${meta.width}x${meta.height} ${meta.format}`);

  // Auto-trim: find non-transparent bounding box
  const raw = await sharp(SRC).ensureAlpha().raw().toBuffer();
  const w = meta.width;
  const h = meta.height;

  let top = h, bottom = 0, left = w, right = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = raw[(y * w + x) * 4 + 3]; // alpha channel
      if (a > 10) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  const pad = 12; // transparent padding around icon
  const cropLeft = Math.max(0, left - pad);
  const cropTop = Math.max(0, top - pad);
  const cropWidth = Math.min(w - cropLeft, right - left + pad * 2);
  const cropHeight = Math.min(h - cropTop, bottom - top + pad * 2);

  console.log(`Trimmed: ${cropWidth}x${cropHeight} (offset: ${cropLeft},${cropTop})`);

  // Create trimmed base
  const trimmed = sharp(SRC)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    })
    .png();

  // Make it square by padding the shorter dimension
  const size = Math.max(cropWidth, cropHeight);
  const padded = await trimmed
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Generate all PNG sizes
  for (const [filename, targetSize] of Object.entries(SIZES)) {
    const outPath = path.join(OUT, filename);
    await sharp(padded)
      .resize(targetSize, targetSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, effort: 10 })
      .toFile(outPath);
    console.log(`Generated: ${filename} (${targetSize}x${targetSize})`);
  }

  // Generate ICO manually (header + embedded PNGs)
  const icoSizes = [16, 32, 48];
  const icoPngs = await Promise.all(
    icoSizes.map((s) =>
      sharp(padded).resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
    )
  );

  const numImages = icoSizes.length;
  // ICO header: 6 bytes, each directory entry: 16 bytes
  const headerSize = 6 + numImages * 16;
  let dataOffset = headerSize;
  const entries = [];
  const imageData = [];

  for (let i = 0; i < numImages; i++) {
    const s = icoSizes[i];
    const buf = icoPngs[i];
    const w = s < 256 ? s : 0; // 0 means 256
    const h = s < 256 ? s : 0;
    entries.push(Buffer.from([
      w,            // width
      h,            // height
      0,            // color palette
      0,            // reserved
      1, 0,         // color planes
      32, 0,        // bits per pixel
      buf.length, buf.length >> 8, buf.length >> 16, buf.length >> 24, // data size
      dataOffset, dataOffset >> 8, dataOffset >> 16, dataOffset >> 24, // data offset
    ]));
    imageData.push(buf);
    dataOffset += buf.length;
  }

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);     // reserved
  icoHeader.writeUInt16LE(1, 2);     // type: ICO
  icoHeader.writeUInt16LE(numImages, 4); // number of images

  const ico = Buffer.concat([icoHeader, ...entries, ...imageData]);
  fs.writeFileSync(path.join(OUT, "favicon.ico"), ico);
  console.log(`Generated: favicon.ico (${icoSizes.join(", ")})`);

  // Generate site.webmanifest
  const manifest = {
    name: "Hearts by Charming",
    short_name: "HBC",
    description: "Hearts by Charming Referral Challenge 2026",
    icons: [
      { src: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#C89A2B",
    background_color: "#FFF8EF",
    display: "standalone",
  };

  fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify(manifest, null, 2));
  console.log("Generated: site.webmanifest");

  // Summary
  const files = fs.readdirSync(OUT);
  console.log(`\nDone! ${files.length} files in public/favicon/`);
  files.forEach((f) => {
    const stat = fs.statSync(path.join(OUT, f));
    console.log(`  ${f} (${(stat.size / 1024).toFixed(1)}KB)`);
  });
}

generate().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
