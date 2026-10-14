import type { GridFormat, SliceItem } from '../types';
import { getTileUploadOrder } from './dimensions';

export interface SlicingOptions {
  rows: number;
  format: GridFormat;
  exportFormat?: 'image/png' | 'image/jpeg';
  jpegQuality?: number;
  preserveSourceResolution?: boolean;
}

export async function sliceBannerImage(
  img: HTMLImageElement,
  options: SlicingOptions
): Promise<SliceItem[]> {
  const { rows, format, exportFormat = 'image/png', jpegQuality = 0.95, preserveSourceResolution = true } = options;
  const cols = 3;
  const totalTiles = cols * rows;

  // Source image dimensions
  const srcWidth = img.naturalWidth || img.width;
  const srcHeight = img.naturalHeight || img.height;

  // Calculate slice dimensions
  const sliceSrcWidth = srcWidth / cols;
  const sliceSrcHeight = srcHeight / rows;

  // Destination slice dimensions
  let destWidth = format.tileWidth;
  let destHeight = format.tileHeight;

  if (preserveSourceResolution) {
    destWidth = Math.round(sliceSrcWidth);
    destHeight = Math.round(sliceSrcHeight);
  }

  const slices: SliceItem[] = [];

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const tileIndex = (r - 1) * cols + (c - 1);
      const uploadOrder = getTileUploadOrder(r, c, rows);

      // Create an offscreen canvas for each slice
      const canvas = document.createElement('canvas');
      canvas.width = destWidth;
      canvas.height = destHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      if (!ctx) {
        throw new Error('Failed to get 2D canvas context');
      }

      // Smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Source rectangle
      const sx = (c - 1) * sliceSrcWidth;
      const sy = (r - 1) * sliceSrcHeight;
      const sw = sliceSrcWidth;
      const sh = sliceSrcHeight;

      // Draw slice
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, destWidth, destHeight);

      // Convert to blob and dataUrl
      const dataUrl = canvas.toDataURL(exportFormat, jpegQuality);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create slice Blob'));
          },
          exportFormat,
          jpegQuality
        );
      });

      // Filename format: e.g. "01_Upload_FIRST_R2_C3.png"
      const paddedOrder = String(uploadOrder).padStart(2, '0');
      let orderLabel = `Step_${paddedOrder}`;
      if (uploadOrder === 1) {
        orderLabel = `${paddedOrder}_UPLOAD_FIRST`;
      } else if (uploadOrder === totalTiles) {
        orderLabel = `${paddedOrder}_UPLOAD_LAST_TOP_LEFT`;
      }

      const extension = exportFormat === 'image/jpeg' ? 'jpg' : 'png';
      const suggestedFilename = `${orderLabel}_Row${r}_Col${c}.${extension}`;

      slices.push({
        id: `slice-r${r}-c${c}`,
        col: c,
        row: r,
        uploadOrder,
        tileIndex,
        dataUrl,
        blob,
        width: destWidth,
        height: destHeight,
        isPinned: r === 1,
        suggestedFilename,
      });
    }
  }

  // Sort slices by tileIndex (visual reading order for display), or we can sort by uploadOrder
  return slices;
}

/**
 * Extracts a centered square preview for 9:16 or 4:5 images,
 * simulating how Instagram crops on the profile grid.
 */
export async function generateSquareCropPreview(
  sliceBlob: Blob,
  cropRatio: number = 1 // 1:1 square
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = Math.min(img.width, img.height * cropRatio);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;

      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(sliceBlob);
  });
}
