const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public/images/hearts-by-charming-logo.png');
const OUT = path.join(ROOT, 'public/assets/logo');

fs.mkdirSync(OUT, { recursive: true });

async function run() {
  const src = sharp(SRC);
  const meta = await src.metadata();
  console.log(`Source: ${meta.width}x${meta.height}, channels: ${meta.channels}`);

  // Step 1: Crop whitespace and remove white background
  const cropped = await sharp(SRC)
    .trim({ threshold: 10 })
    .toBuffer({ resolveWithObject: true });
  
  console.log(`Cropped: ${cropped.info.width}x${cropped.info.height}`);

  // Save cropped transparent base
  const basePng = path.join(OUT, 'base-cropped.png');
  await sharp(cropped.data)
    .png()
    .toFile(basePng);

  // Step 2: Generate horizontal logo at various sizes
  const sizes = {
    'small': 28,
    'medium': 40,
    'large': 60,
    'xl': 100,
  };

  for (const [name, height] of Object.entries(sizes)) {
    await sharp(cropped.data)
      .resize({ height, fit: 'inside' })
      .png()
      .toFile(path.join(OUT, `logo-${name}.png`));
    console.log(`Generated logo-${name}.png (h=${height})`);
  }

  // Step 3: Generate icon-only versions (heart only)
  // The heart icon is approximately the left 25% of the cropped image
  const cw = cropped.info.width;
  const ch = cropped.info.height;
  
  // Extract heart region - roughly left portion
  const heartWidth = Math.round(ch * 1.1); // heart is roughly square
  const heartLeft = Math.round(cw * 0.02); // small left offset after trim
  
  const heartBuffer = await sharp(cropped.data)
    .extract({ 
      left: heartLeft, 
      top: 0, 
      width: Math.min(heartWidth, cw - heartLeft), 
      height: ch 
    })
    .toBuffer({ resolveWithObject: true });

  const iconSizes = [16, 32, 48, 64, 128, 256, 512];
  for (const size of iconSizes) {
    await sharp(heartBuffer.data)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Step 4: Generate favicon sizes
  for (const size of [16, 32, 48]) {
    await sharp(heartBuffer.data)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT, `favicon-${size}.png`));
    console.log(`Generated favicon-${size}.png`);
  }

  // Generate favicon.ico using png (browsers accept .ico with png content)
  await sharp(heartBuffer.data)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(OUT, 'favicon.ico'));
  console.log('Generated favicon.ico');

  // Step 5: Create stacked version (icon on top, text below)
  // We'll create a canvas with icon centered above text
  const stackIconSize = 80;
  const stackedIcon = await sharp(heartBuffer.data)
    .resize(stackIconSize, stackIconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Get the text portion (right side of original)
  const textLeft = heartLeft + Math.min(heartWidth, cw - heartLeft) + 8;
  const textWidth = cw - textLeft;
  
  if (textWidth > 0) {
    const textBuffer = await sharp(cropped.data)
      .extract({ left: textLeft, top: 0, width: textWidth, height: ch })
      .toBuffer();

    // Create stacked: icon on top, text below, centered
    const stackWidth = Math.max(stackIconSize, textWidth);
    const stackHeight = stackIconSize + 12 + ch;
    
    const stackedSvg = `
      <svg width="${stackWidth}" height="${stackHeight}" xmlns="http://www.w3.org/2000/svg">
        <foreignObject x="0" y="0" width="${stackIconSize}" height="${stackIconSize}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:${stackIconSize}px;height:${stackIconSize}px;">
          </div>
        </foreignObject>
      </svg>`;

    // Simpler approach: composite icon centered above text
    const textMeta = await sharp(textBuffer).metadata();
    const compositeWidth = Math.max(stackIconSize, textMeta.width);
    const compositeHeight = stackIconSize + 12 + textMeta.height;

    const stackedCanvas = sharp({
      create: {
        width: compositeWidth,
        height: compositeHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    await stackedCanvas
      .composite([
        {
          input: stackedIcon,
          left: Math.round((compositeWidth - stackIconSize) / 2),
          top: 0,
        },
        {
          input: textBuffer,
          left: Math.round((compositeWidth - textMeta.width) / 2),
          top: stackIconSize + 12,
        }
      ])
      .png()
      .toFile(path.join(OUT, 'logo-stacked.png'));
    console.log('Generated logo-stacked.png');

    // Stacked sizes
    await sharp(path.join(OUT, 'logo-stacked.png'))
      .resize({ height: 120, fit: 'inside' })
      .png()
      .toFile(path.join(OUT, 'logo-stacked-large.png'));
    console.log('Generated logo-stacked-large.png');
  }

  // Step 6: Copy the base cropped as horizontal
  await sharp(cropped.data)
    .png()
    .toFile(path.join(OUT, 'logo-horizontal.png'));
  console.log('Generated logo-horizontal.png');

  // Horizontal sizes for responsive
  await sharp(cropped.data)
    .resize({ height: 36, fit: 'inside' })
    .png()
    .toFile(path.join(OUT, 'logo-horizontal-sm.png'));
  
  await sharp(cropped.data)
    .resize({ height: 48, fit: 'inside' })
    .png()
    .toFile(path.join(OUT, 'logo-horizontal-md.png'));

  await sharp(cropped.data)
    .resize({ height: 64, fit: 'inside' })
    .png()
    .toFile(path.join(OUT, 'logo-horizontal-lg.png'));

  console.log('Generated horizontal responsive sizes');

  // Step 7: Copy favicon to public root for Next.js
  await sharp(heartBuffer.data)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(ROOT, 'public/favicon.png'));
  console.log('Copied favicon to public root');

  // List all generated files
  const files = fs.readdirSync(OUT);
  console.log(`\nGenerated ${files.length} files:`);
  files.forEach(f => {
    const stat = fs.statSync(path.join(OUT, f));
    console.log(`  ${f} (${(stat.size / 1024).toFixed(1)}KB)`);
  });
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
