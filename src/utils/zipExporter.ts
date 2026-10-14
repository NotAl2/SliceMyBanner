import JSZip from 'jszip';
import type { SliceItem, GridConfig } from '../types';


export async function generateZipArchive(
  slices: SliceItem[],
  config: GridConfig,
  baseFilename: string = 'instagram_grid_banner'
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(baseFilename) || zip;

  // Sort slices in the order they must be uploaded (1 to total)
  const sortedByUploadOrder = [...slices].sort((a, b) => a.uploadOrder - b.uploadOrder);

  // Add each image file to the zip
  for (const slice of sortedByUploadOrder) {
    const arrayBuffer = await slice.blob.arrayBuffer();
    folder.file(slice.suggestedFilename, arrayBuffer);
  }

  // Create an instructional README text file
  const totalTiles = slices.length;
  let postingGuideText = `=====================================================
INSTAGRAM GRID BANNER - POSTING GUIDE & REVERSE ORDER
=====================================================
Grid Layout: 3 Columns × ${config.rows} Rows (${totalTiles} total posts)
Format: ${config.format.name} (${config.format.ratioLabel})
Slice Dimensions: ${slices[0]?.width || config.format.tileWidth}px × ${slices[0]?.height || config.format.tileHeight}px

CRITICAL RULE FOR INSTAGRAM:
Instagram displays posts in REVERSE CHRONOLOGICAL ORDER (newest post appears at Top-Left).
To make your banner line up correctly on your profile, you MUST post the slices in the numbered order below:

-----------------------------------------------------
STEP-BY-STEP UPLOADING SEQUENCE:
-----------------------------------------------------
`;

  sortedByUploadOrder.forEach((slice) => {
    const isFirst = slice.uploadOrder === 1;
    const isLast = slice.uploadOrder === totalTiles;
    const isPinned = slice.isPinned;

    let tag = '';
    if (isFirst) tag = ' <<< UPLOAD THIS FIRST (Bottom-Right)';
    else if (isLast) tag = ' <<< UPLOAD THIS LAST (Top-Left)';

    postingGuideText += `Step ${String(slice.uploadOrder).padStart(2, '0')} of ${totalTiles}: ${slice.suggestedFilename}${tag}\n`;
    postingGuideText += `         Grid Position: Row ${slice.row} of ${config.rows}, Column ${slice.col} of 3\n`;
    if (isPinned) {
      postingGuideText += `         [!] Pinned Banner Post (Belongs to Top Row - Pin to Profile if desired)\n`;
    }
    postingGuideText += `\n`;
  });

  postingGuideText += `-----------------------------------------------------
PRO-TIPS FOR SUCCESS:
-----------------------------------------------------
1. PINNING: If this is a permanent header banner, after posting the final 3 posts (Top Row: Step ${totalTiles - 2}, ${totalTiles - 1}, ${totalTiles}), tap "Pin to your profile" on each of the 3 posts. This locks them at the top forever!
2. REEL COVERS: If you used 9:16 Reel covers, the center 1080×1080 square will display seamlessly on your profile grid, while the full vertical 9:16 displays when users view the Reels tab.
3. CAPTIONS: You can add individual captions, hashtags, or carousel slides behind each grid tile if desired.

Generated with InstaGrid Studio.
`;

  folder.file('00_POSTING_GUIDE.txt', postingGuideText);

  // Generate zip blob
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return zipBlob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copySliceToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      return false;
    }
    // Clipboard item expects image/png
    if (blob.type !== 'image/png') {
      // Convert to PNG blob
      const img = new Image();
      const url = URL.createObjectURL(blob);
      await new Promise((res) => {
        img.onload = res;
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob }),
      ]);
      URL.revokeObjectURL(url);
    } else {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
    }
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
