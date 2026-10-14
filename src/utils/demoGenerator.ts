import type { GridFormat } from '../types';
import { calculateDimensions } from './dimensions';

export function generateDemoBanner(
  format: GridFormat,
  rows: number
): Promise<{ dataUrl: string; imgElement: HTMLImageElement; file: File }> {
  return new Promise((resolve) => {
    const dims = calculateDimensions(format, rows);
    const canvas = document.createElement('canvas');
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const w = dims.width;
    const h = dims.height;

    // Studio gradient background: Canvas + Mist + subtle Cornflower & Pear tint
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#DBE3E9'); // Mist
    bgGradient.addColorStop(0.5, '#FBFBF8'); // Canvas
    bgGradient.addColorStop(1, '#eaf0f5');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Large sweeping continuous Cornflower curve across all 3 columns
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.bezierCurveTo(w * 0.3, h * 0.25, w * 0.65, h * 0.8, w, h * 0.4);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const waveGrad1 = ctx.createLinearGradient(0, h * 0.3, w, h);
    waveGrad1.addColorStop(0, 'rgba(106, 166, 218, 0.35)'); // Cornflower
    waveGrad1.addColorStop(1, 'rgba(106, 166, 218, 0.65)');
    ctx.fillStyle = waveGrad1;
    ctx.fill();
    ctx.restore();

    // Secondary subtle Pear wave
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.bezierCurveTo(w * 0.35, h * 0.95, w * 0.7, h * 0.5, w, h * 0.75);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const waveGrad2 = ctx.createLinearGradient(0, h * 0.5, w, h);
    waveGrad2.addColorStop(0, 'rgba(225, 229, 172, 0.45)'); // Pear
    waveGrad2.addColorStop(1, 'rgba(106, 166, 218, 0.5)');
    ctx.fillStyle = waveGrad2;
    ctx.fill();
    ctx.restore();

    // Large floating sun / horizon orb in Pear / Canvas
    ctx.save();
    ctx.beginPath();
    ctx.arc(dims.tileWidth * 1.5, h * 0.45, Math.min(dims.tileWidth * 0.7, h * 0.4), 0, Math.PI * 2);
    const sunGrad = ctx.createRadialGradient(
      dims.tileWidth * 1.5,
      h * 0.45,
      10,
      dims.tileWidth * 1.5,
      h * 0.45,
      Math.min(dims.tileWidth * 0.7, h * 0.4)
    );
    sunGrad.addColorStop(0, 'rgba(225, 229, 172, 0.8)'); // Pear
    sunGrad.addColorStop(0.6, 'rgba(251, 251, 248, 0.5)'); // Canvas
    sunGrad.addColorStop(1, 'rgba(251, 251, 248, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fill();
    ctx.restore();

    // Text & Tile badges across columns
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= 3; c++) {
        const cx = (c - 0.5) * dims.tileWidth;
        const cy = (r - 0.5) * dims.tileHeight;

        // Elegant translucent tile border inside artwork
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          (c - 1) * dims.tileWidth + 40,
          (r - 1) * dims.tileHeight + 40,
          dims.tileWidth - 80,
          dims.tileHeight - 80
        );

        // Column indicator pill
        ctx.fillStyle = '#000000';
        ctx.font = '700 30px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`TILE ${c + (r - 1) * 3} OF ${dims.totalTiles}`, cx, cy - 80);

        // Big Modern geometric headline across the tiles
        ctx.fillStyle = '#000000';
        ctx.font = '800 80px "Outfit", sans-serif';
        const words = ['EXPERIENCE', 'SEAMLESS', 'CONTINUOUS', 'ELEVATE', 'FREEDOM', 'HORIZON'];
        const word = words[(c - 1 + (r - 1) * 3) % words.length];
        ctx.fillText(word, cx, cy);

        // Subtitle
        ctx.fillStyle = '#6AA6DA';
        ctx.font = '700 32px "Outfit", sans-serif';
        ctx.fillText(`SLICEMYBANNER`, cx, cy + 60);

        // Safe zone visual hint if Reel Cover
        if (format.id === 'reel_cover') {
          ctx.strokeStyle = '#6AA6DA';
          ctx.lineWidth = 4;
          ctx.setLineDash([12, 12]);
          ctx.strokeRect((c - 1) * dims.tileWidth, (r - 1) * dims.tileHeight + 420, dims.tileWidth, 1080);
          ctx.setLineDash([]);
          ctx.fillStyle = '#000000';
          ctx.font = '700 28px "Outfit", sans-serif';
          ctx.fillText('1:1 Profile Safe Zone', cx, (r - 1) * dims.tileHeight + 470);
        }
      }
    }

    const dataUrl = canvas.toDataURL('image/png', 0.95);
    const img = new Image();
    img.onload = () => {
      canvas.toBlob((blob) => {
        const file = new File([blob!], `demo_banner_${dims.width}x${dims.height}.png`, {
          type: 'image/png',
        });
        resolve({ dataUrl, imgElement: img, file });
      }, 'image/png');
    };
    img.src = dataUrl;
  });
}
