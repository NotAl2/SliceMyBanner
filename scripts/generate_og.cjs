const fs = require('fs');
const zlib = require('zlib');

// CRC32
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.slice(4, 8 + len);
  buf.writeUInt32BE(crc32(typeAndData), 8 + len);
  return buf;
}
function encodePNG(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = 1 + width * 4;
  const filtered = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    filtered[y * stride] = 0;
    rgbaBuffer.copy(filtered, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }

  const idatData = zlib.deflateSync(filtered, { level: 9 });
  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function decodePNG(buf) {
  let pos = 8;
  const idats = [];
  let width = 0, height = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString('ascii');
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idats.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idats));
  const stride = 1 + width * 4;
  const raw = Buffer.alloc(width * height * 4);
  let prevRow = Buffer.alloc(width * 4);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const src = decompressed.slice(y * stride + 1, (y + 1) * stride);
    const curRow = Buffer.alloc(width * 4);
    for (let x = 0; x < width * 4; x++) {
      const a = x >= 4 ? curRow[x - 4] : 0;
      const b = prevRow[x];
      const c = x >= 4 ? prevRow[x - 4] : 0;
      let val = src[x];
      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
        val = (val + pr) & 0xff;
      }
      curRow[x] = val;
    }
    curRow.copy(raw, y * width * 4);
    prevRow = curRow;
  }
  return { width, height, data: raw };
}

// Canvas Dimensions
const W = 1200;
const H = 630;
const canvas = Buffer.alloc(W * H * 4);

// Fill with #FBFBF8
for (let i = 0; i < canvas.length; i += 4) {
  canvas[i] = 251;     // R
  canvas[i + 1] = 251; // G
  canvas[i + 2] = 248; // B
  canvas[i + 3] = 255; // A
}

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) * 4;
  if (a === 255) {
    canvas[idx] = r;
    canvas[idx + 1] = g;
    canvas[idx + 2] = b;
    canvas[idx + 3] = 255;
  } else if (a > 0) {
    const alpha = a / 255;
    canvas[idx] = Math.round(r * alpha + canvas[idx] * (1 - alpha));
    canvas[idx + 1] = Math.round(g * alpha + canvas[idx + 1] * (1 - alpha));
    canvas[idx + 2] = Math.round(b * alpha + canvas[idx + 2] * (1 - alpha));
    canvas[idx + 3] = 255;
  }
}

function fillRect(x0, y0, w, h, r, g, b, a = 255) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      setPixel(x, y, r, g, b, a);
    }
  }
}

function strokeRect(x0, y0, w, h, thickness, r, g, b, a = 255) {
  fillRect(x0, y0, w, thickness, r, g, b, a);
  fillRect(x0, y0 + h - thickness, w, thickness, r, g, b, a);
  fillRect(x0, y0, thickness, h, r, g, b, a);
  fillRect(x0 + w - thickness, y0, thickness, h, r, g, b, a);
}

function fillCircle(cx, cy, radius, r, g, b, a = 255) {
  const r2 = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y++) {
    for (let x = cx - radius; x <= cx + radius; x++) {
      const d2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (d2 <= r2) {
        setPixel(x, y, r, g, b, a);
      }
    }
  }
}

// 1. Draw outer boundary card (border #DBE3E9)
strokeRect(32, 32, W - 64, H - 64, 2, 219, 227, 233, 255);

// 2. Draw soft accent glow behind left brand
fillCircle(180, 180, 140, 106, 166, 218, 25);
fillCircle(980, 440, 160, 225, 229, 172, 45);

// 3. Composite Scissor Hand Logo
const logoRaw = fs.readFileSync('public/logo-theme.png');
const logo = decodePNG(logoRaw);

// Draw circular badge for logo
const badgeX = 90, badgeY = 90, badgeR = 60;
fillCircle(badgeX + badgeR, badgeY + badgeR, badgeR, 219, 227, 233, 255);
// Inner white ring
fillCircle(badgeX + badgeR, badgeY + badgeR, badgeR - 3, 251, 251, 248, 255);

// Scale logo into badge (approx 90x65 px inside badge)
const targetLW = 92;
const targetLH = Math.round(targetLW * (logo.height / logo.width));
const startLX = badgeX + badgeR - Math.round(targetLW / 2);
const startLY = badgeY + badgeR - Math.round(targetLH / 2);

for (let dy = 0; dy < targetLH; dy++) {
  const sy = Math.floor((dy / targetLH) * logo.height);
  for (let dx = 0; dx < targetLW; dx++) {
    const sx = Math.floor((dx / targetLW) * logo.width);
    const sidx = (sy * logo.width + sx) * 4;
    const a = logo.data[sidx + 3];
    if (a > 0) {
      setPixel(startLX + dx, startLY + dy, logo.data[sidx], logo.data[sidx + 1], logo.data[sidx + 2], a);
    }
  }
}

// 4. Draw Right Side Banner Slices Simulation (A 3-Tile Sliced Banner Preview)
// 3 tiles, each 140w x 280h with 12px gap
const tileW = 146;
const tileH = 260;
const tileGap = 10;
const startGridX = 670;
const startGridY = 175;

// Outer phone/grid container
strokeRect(startGridX - 16, startGridY - 16, (tileW * 3) + (tileGap * 2) + 32, tileH + 32, 2, 219, 227, 233, 255);
fillRect(startGridX - 14, startGridY - 14, (tileW * 3) + (tileGap * 2) + 28, tileH + 28, 255, 255, 255, 255);

// Draw gradient panorama across all 3 tiles
for (let col = 0; col < 3; col++) {
  const tx = startGridX + col * (tileW + tileGap);
  const ty = startGridY;

  for (let y = 0; y < tileH; y++) {
    const normY = y / tileH;
    for (let x = 0; x < tileW; x++) {
      const globalX = (col * tileW + x) / (tileW * 3);
      // Beautiful gradient from Cornflower (#6AA6DA) to Pear (#E1E5AC) across the banner
      const r = Math.round(106 * (1 - globalX) + 225 * globalX);
      const g = Math.round(166 * (1 - globalX) + 229 * globalX);
      const b = Math.round(218 * (1 - globalX) + 172 * globalX);
      setPixel(tx + x, ty + y, r, g, b, 255);
    }
  }

  // Draw tile border
  strokeRect(tx, ty, tileW, tileH, 2, 219, 227, 233, 255);

  // Draw Tile Order Badge in corner: [03], [02], [01]
  const badgeNum = (3 - col);
  fillRect(tx + 12, ty + 12, 36, 24, 0, 0, 0, 220);
  fillCircle(tx + 12, ty + 24, 4, 0, 0, 0, 220);
  fillCircle(tx + 48, ty + 24, 4, 0, 0, 0, 220);
}

// 5. Draw decorative feature pill bars in bottom left
const pillY = 480;
// Pill 1: Canva Custom Sizes
fillRect(90, pillY, 180, 42, 225, 229, 172, 255);
strokeRect(90, pillY, 180, 42, 1, 212, 218, 152, 255);

// Pill 2: 1-Click ZIP Export
fillRect(285, pillY, 170, 42, 219, 227, 233, 255);
strokeRect(285, pillY, 170, 42, 1, 195, 205, 214, 255);

// Pill 3: 100% In-Browser & Free
fillRect(470, pillY, 170, 42, 255, 255, 255, 255);
strokeRect(470, pillY, 170, 42, 1, 219, 227, 233, 255);

// Save generated image
const pngData = encodePNG(W, H, canvas);
fs.writeFileSync('public/og-image.png', pngData);
console.log('Successfully generated public/og-image.png (1200x630)!');
