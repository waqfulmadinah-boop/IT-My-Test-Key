import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw image data with filter byte (0) per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // None filter
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = c ^ buf[n];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);

  const payload = Buffer.concat([typeBuf, data]);
  const crcValue = crc32(payload);
  crcBuf.writeUInt32BE(crcValue, 0);

  return Buffer.concat([length, payload, crcBuf]);
}

// Generate keyboard themed icon
function keyboardPixel(x, y, w, h, maskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Background
  let r = 15, g = 23, b = 42; // #0f172a slate-900

  // Keyboard pad frame
  const margin = maskable ? 0.2 : 0.08;
  if (nx >= margin && nx <= 1 - margin && ny >= margin && ny <= 1 - margin) {
    r = 30; g = 41; b = 59; // slate-800
    // Highlight border
    if (
      Math.abs(nx - margin) < 0.015 || Math.abs(nx - (1 - margin)) < 0.015 ||
      Math.abs(ny - margin) < 0.015 || Math.abs(ny - (1 - margin)) < 0.015
    ) {
      r = 59; g = 130; b = 246; // blue-500
    }
    // Key button 1 (Bengali blue)
    if (nx > 0.25 && nx < 0.45 && ny > 0.35 && ny < 0.6) {
      r = 37; g = 99; b = 235; // blue-600
    }
    // Key button 2 (Arabic emerald)
    if (nx > 0.55 && nx < 0.75 && ny > 0.35 && ny < 0.6) {
      r = 16; g = 185; b = 129; // emerald-500
    }
    // Space bar
    if (nx > 0.25 && nx < 0.75 && ny > 0.68 && ny < 0.82) {
      r = 71; g = 85; b = 105; // slate-600
    }
  }

  return [r, g, b, 255];
}

fs.mkdirSync('./public', { recursive: true });

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, (x, y, w, h) => keyboardPixel(x, y, w, h, false)));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, (x, y, w, h) => keyboardPixel(x, y, w, h, false)));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, (x, y, w, h) => keyboardPixel(x, y, w, h, true)));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, (x, y, w, h) => keyboardPixel(x, y, w, h, false)));
fs.writeFileSync('./public/favicon.ico', createPNG(32, 32, (x, y, w, h) => keyboardPixel(x, y, w, h, false)));

console.log('PWA PNG Icons successfully generated!');
