const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/App.tsx',
  'src/components/GridConfigurator.tsx',
  'src/components/ImageUploader.tsx',
  'src/components/SlicerPreview.tsx',
  'src/components/InstagramSimulator.tsx',
  'src/components/ExportPanel.tsx',
  'src/components/CanvaGuideModal.tsx',
  'src/components/Toast.tsx',
  'src/utils/animations.ts',
  'src/utils/demoGenerator.ts',
  'index.html',
  'scripts/og-template.html'
];

for (const relPath of filesToUpdate) {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Reverse any #10367D, #74B4DA, #EBEBEB back to #6AA6DA, #E1E5AC, #DBE3E9, #FBFBF8
  content = content.replace(/#F8F9FA/g, '#FBFBF8');
  content = content.replace(/#EBEBEB/g, '#DBE3E9');
  content = content.replace(/#d8d8d8/g, '#c5d1dd');
  content = content.replace(/#74B4DA/g, '#E1E5AC');
  content = content.replace(/#5fa7cf/g, '#d6db9b');
  content = content.replace(/#10367D/g, '#6AA6DA');

  fs.writeFileSync(fullPath, content);
  console.log('Restored to card palette:', relPath);
}
console.log('All files restored to card palette (#FBFBF8, #DBE3E9, #6AA6DA, #E1E5AC, #000000)!');
