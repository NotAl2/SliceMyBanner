const fs = require('fs');

fs.copyFileSync('public/logo-theme-navy.png', 'public/logo-theme.png');

const themeBuf = fs.readFileSync('public/logo-theme.png');
const base64Theme = themeBuf.toString('base64');
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#EBEBEB" stroke="#10367D" stroke-width="2.5" />
  <image href="data:image/png;base64,${base64Theme}" x="12" y="16" width="76" height="68" />
</svg>`;
fs.writeFileSync('public/favicon.svg', faviconSvg);
console.log('Updated logo-theme.png and favicon.svg with new #10367D, #EBEBEB, #74B4DA palette!');
