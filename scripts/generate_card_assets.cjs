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

const buf = fs.readFileSync('C:/Users/Aryan/.gemini/antigravity/brain/36c0f957-bdf3-49d2-901c-a68b6f42589d/.user_uploaded/media_1791962914131_0b71a2b6.png');
let pos = 8;
const idats = [];
let width = 840, height = 859;
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.slice(pos + 4, pos + 8).toString('ascii');
  if (type === 'IDAT') idats.push(buf.slice(pos + 8, pos + 8 + len));
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

const pad = 24;
const cropX = Math.max(0, 3 - pad);
const cropY = Math.max(0, 127 - pad);
const cropW = Math.min(width, 837 + pad) - cropX;
const cropH = Math.min(height, 731 + pad) - cropY;

const themeCrop = Buffer.alloc(cropW * cropH * 4);

for (let cy = 0; cy < cropH; cy++) {
  const y = cy + cropY;
  for (let cx = 0; cx < cropW; cx++) {
    const x = cx + cropX;
    const i = (y * width + x) * 4;
    const r = raw[i], g = raw[i+1], b = raw[i+2];

    const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    const ci = (cy * cropW + cx) * 4;

    if (diff <= 3) {
      themeCrop[ci + 3] = 0;
    } else {
      const isNail = (r > 245 && g > 225 && g < 242 && b > 230 && (r - g) >= 14);
      const isCrease = (!isNail && g < 185 && (r - b) > 90);
      
      let alpha = 255;
      if (diff < 35 && !isNail) {
        alpha = Math.min(255, Math.max(0, Math.round((diff / 35) * 255)));
      }

      if (isNail) {
        // Pear #E1E5AC [225, 229, 172]
        themeCrop[ci] = 225;
        themeCrop[ci + 1] = 229;
        themeCrop[ci + 2] = 172;
        themeCrop[ci + 3] = alpha;
      } else if (isCrease) {
        // Deeper Cornflower [65, 130, 188]
        themeCrop[ci] = 65;
        themeCrop[ci + 1] = 130;
        themeCrop[ci + 2] = 188;
        themeCrop[ci + 3] = alpha;
      } else {
        // Cornflower Blue [106, 166, 218]
        themeCrop[ci] = 106;
        themeCrop[ci + 1] = 166;
        themeCrop[ci + 2] = 218;
        themeCrop[ci + 3] = alpha;
      }
    }
  }
}

fs.writeFileSync('public/logo-theme.png', encodePNG(cropW, cropH, themeCrop));

const themeBuf = fs.readFileSync('public/logo-theme.png');
const base64Theme = themeBuf.toString('base64');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#DBE3E9" stroke="#cbd5e0" stroke-width="2" />
  <image href="data:image/png;base64,${base64Theme}" x="12" y="16" width="76" height="68" />
</svg>`;
fs.writeFileSync('public/favicon.svg', faviconSvg);
console.log('Restored public/logo-theme.png and public/favicon.svg to exact card colors!');
