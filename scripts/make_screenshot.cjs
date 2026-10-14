const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = path.resolve(__dirname, 'og-template.html').replace(/\\/g, '/');
const outPath = path.resolve(__dirname, '../public/og-image.png').replace(/\\/g, '/');

const cmd = `"${chromePath}" --headless=new --disable-gpu --screenshot="${outPath}" --window-size=1200,630 "file:///${htmlPath}"`;
console.log('Running cmd:', cmd);
try {
  execSync(cmd);
  console.log('Done! Exists:', fs.existsSync(outPath), 'Size:', fs.existsSync(outPath) ? fs.statSync(outPath).size : 0);
} catch (err) {
  console.error('Failed:', err.message);
}
