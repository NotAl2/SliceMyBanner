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

    // Studio gradient background: Canvas + Mist
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#FFFFFF');
    bgGradient.addColorStop(0.5, '#F5F4F8');
    bgGradient.addColorStop(1, '#F5F4F8');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // Large sweeping continuous Sky Blue curve across all 3 columns
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.bezierCurveTo(w * 0.3, h * 0.25, w * 0.65, h * 0.8, w, h * 0.4);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const waveGrad1 = ctx.createLinearGradient(0, h * 0.3, w, h);
    waveGrad1.addColorStop(0, 'rgba(239, 95, 24, 0.35)'); // #EF5F18
    waveGrad1.addColorStop(1, 'rgba(239, 95, 24, 0.65)');
    ctx.fillStyle = waveGrad1;
    ctx.fill();
    ctx.restore();

    // Secondary subtle Navy curve
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.bezierCurveTo(w * 0.35, h * 0.95, w * 0.7, h * 0.5, w, h * 0.75);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const waveGrad2 = ctx.createLinearGradient(0, h * 0.5, w, h);
    waveGrad2.addColorStop(0, 'rgba(38, 26, 102, 0.2)'); // #261A66
    waveGrad2.addColorStop(1, 'rgba(239, 95, 24, 0.4)');
    ctx.fillStyle = waveGrad2;
    ctx.fill();
    ctx.restore();

    // Large floating sun / horizon orb in Sky Blue / Soft Gray
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
    sunGrad.addColorStop(0, 'rgba(239, 95, 24, 0.6)'); // #EF5F18
    sunGrad.addColorStop(0.6, 'rgba(235, 235, 235, 0.4)');
    sunGrad.addColorStop(1, 'rgba(235, 235, 235, 0)');
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
        ctx.fillStyle = '#261A66';
        ctx.font = '700 30px "Comfortaa", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`TILE ${c + (r - 1) * 3} OF ${dims.totalTiles}`, cx, cy - 80);

        // Big Modern geometric headline across the tiles
        ctx.fillStyle = '#261A66';
        ctx.font = '700 74px "Comfortaa", sans-serif';
        const words = ['EXPERIENCE', 'SEAMLESS', 'CONTINUOUS', 'ELEVATE', 'FREEDOM', 'HORIZON'];
        const word = words[(c - 1 + (r - 1) * 3) % words.length];
        ctx.fillText(word, cx, cy);

        // Subtitle
        ctx.fillStyle = '#EF5F18';
        ctx.font = '700 32px "Comfortaa", sans-serif';
        ctx.fillText(`SLICEMYBANNER`, cx, cy + 60);

        // Safe zone visual hint if Reel Cover
        if (format.id === 'reel_cover') {
          ctx.strokeStyle = '#261A66';
          ctx.lineWidth = 4;
          ctx.setLineDash([12, 12]);
          ctx.strokeRect((c - 1) * dims.tileWidth, (r - 1) * dims.tileHeight + 420, dims.tileWidth, 1080);
          ctx.setLineDash([]);
          ctx.fillStyle = '#261A66';
          ctx.font = '700 28px "Comfortaa", sans-serif';
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
