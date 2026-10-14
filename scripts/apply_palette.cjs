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

  // Specific replacements
  // 1. Canvas off-white -> #F8F9FA
  content = content.replace(/#FBFBF8/g, '#F8F9FA');

  // 2. Mist borders/gray -> #EBEBEB
  content = content.replace(/#DBE3E9/g, '#EBEBEB');
  content = content.replace(/#c4d0dc/g, '#d8d8d8');
  content = content.replace(/#c5d1dd/g, '#d8d8d8');
  content = content.replace(/#ccd6dd/g, '#d8d8d8');

  // 3. Pear accent -> #74B4DA (Sky Cerulean)
  content = content.replace(/#E1E5AC/g, '#74B4DA');
  content = content.replace(/#d6db9b/g, '#5fa7cf');

  // 4. Cornflower primary accent -> #10367D (Deep Navy)
  content = content.replace(/#6AA6DA/g, '#10367D');

  fs.writeFileSync(fullPath, content);
  console.log('Updated:', relPath);
}
console.log('All files updated to new #10367D, #EBEBEB, #74B4DA palette!');
