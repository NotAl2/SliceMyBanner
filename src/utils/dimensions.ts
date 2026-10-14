import type { GridFormat, GridFormatId, CanvaPreset } from '../types';

export const GRID_FORMATS: Record<GridFormatId, GridFormat> = {
  square: {
    id: 'square',
    name: 'Classic Square',
    tagline: 'Standard Feed & Classic Profile Grid',
    description: 'Perfect for standard Instagram posts. 100% seamless on profile grid and feed with zero cropping.',
    tileWidth: 1080,
    tileHeight: 1080,
    ratioLabel: '1:1',
    aspectRatio: 1,
    badge: 'Classic Default',
    safeZoneDescription: 'Zero profile crop. Exact 1:1 match.',
    cropNotes: 'Instagram profile grid displays this at exact 1:1 with no vertical cropping.',
  },
  portrait: {
    id: 'portrait',
    name: 'Portrait Feed',
    tagline: 'Maximized Feed Real Estate',
    description: 'Takes up the most screen space in followers’ home feeds (1080×1350). On profile grids, Instagram center-crops 135px off the top and bottom.',
    tileWidth: 1080,
    tileHeight: 1350,
    ratioLabel: '4:5',
    aspectRatio: 1080 / 1350,
    badge: 'High Engagement',
    safeZoneDescription: 'Center 1080×1080 square is visible on classic profile grid; full 1080×1350 in feed.',
    cropNotes: 'Keep crucial text and faces centered in each tile to avoid the 135px top/bottom profile grid crop.',
  },
  vertical_grid: {
    id: 'vertical_grid',
    name: 'Modern Vertical Grid',
    tagline: 'New Instagram Profile Format',
    description: 'Tailored for accounts upgraded to Instagram’s new vertical 3:4 profile grid layout (1080×1440).',
    tileWidth: 1080,
    tileHeight: 1440,
    ratioLabel: '3:4',
    aspectRatio: 1080 / 1440,
    badge: 'Modern Grid',
    safeZoneDescription: 'Fills the new 3:4 vertical profile grid tiles edge-to-edge.',
    cropNotes: 'Designed for the new vertical profile grid rollout.',
  },
  reel_cover: {
    id: 'reel_cover',
    name: 'Reel Cover Banner',
    tagline: 'Seamless Video & Reels Banner',
    description: 'Full 1080×1920 Reel thumbnail. Displays full vertical in Reels tab, but crops to center 1080×1080 on the main profile grid.',
    tileWidth: 1080,
    tileHeight: 1920,
    ratioLabel: '9:16',
    aspectRatio: 1080 / 1920,
    badge: 'Reels Compatible',
    safeZoneDescription: 'Center 1080×1080 square is the profile safe zone (420px top & bottom crop).',
    cropNotes: 'Keep hero text, titles & faces strictly within the center 1080×1080 zone for seamless profile continuity.',
  },
};

export const POPULAR_PRESETS: CanvaPreset[] = [
  {
    label: '3-Post Pinned Banner',
    rows: 1,
    formatId: 'square',
    recommendedFor: 'Top Profile Header Banner',
  },
  {
    label: '6-Post Puzzle (2 Rows)',
    rows: 2,
    formatId: 'square',
    recommendedFor: 'Mini Showcase',
  },
  {
    label: '9-Post Classic Grid (3 Rows)',
    rows: 3,
    formatId: 'square',
    recommendedFor: 'Full Brand Takeover',
  },
  {
    label: '3-Post Tall Banner (4:5)',
    rows: 1,
    formatId: 'portrait',
    recommendedFor: 'Max Feed Height Header',
  },
  {
    label: '3-Reel Seamless Covers (9:16)',
    rows: 1,
    formatId: 'reel_cover',
    recommendedFor: 'Reels Tab + Profile Header',
  },
  {
    label: '6-Reel Grid Takeover',
    rows: 2,
    formatId: 'reel_cover',
    recommendedFor: 'Full Reels Grid Banner',
  },
];

export interface CanvaDimensions {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  cols: number;
  rows: number;
  totalTiles: number;
  aspectRatio: number;
  canvaUrl: string;
  verticalGuides: number[];
  horizontalGuides: number[];
  safeZones: {
    cropTop: number;
    cropBottom: number;
    safeHeight: number;
    safeRatioLabel: string;
    description: string;
  };
}

export function calculateDimensions(format: GridFormat, rows: number): CanvaDimensions {
  const cols = 3;
  const width = cols * format.tileWidth;
  const height = rows * format.tileHeight;
  const totalTiles = cols * rows;

  // Guides
  const verticalGuides = [format.tileWidth, format.tileWidth * 2];
  const horizontalGuides: number[] = [];
  for (let r = 1; r < rows; r++) {
    horizontalGuides.push(r * format.tileHeight);
  }

  // Safe zones for crop quirks
  let cropTop = 0;
  let cropBottom = 0;
  let safeHeight = format.tileHeight;
  let safeRatioLabel = format.ratioLabel;
  let description = '100% visible on profile grid';

  if (format.id === 'portrait') {
    // 1080 x 1350 crops to 1080 x 1080 on classic square grid
    cropTop = 135;
    cropBottom = 135;
    safeHeight = 1080;
    safeRatioLabel = '1:1 Square Safe Zone';
    description = '135px cropped off top & bottom on profile grid thumbnail';
  } else if (format.id === 'vertical_grid') {
    // 1080 x 1440
    cropTop = 0;
    cropBottom = 0;
    safeHeight = 1440;
    safeRatioLabel = '3:4 Profile';
    description = 'Full modern 3:4 profile grid coverage';
  } else if (format.id === 'reel_cover') {
    // 1080 x 1920 crops to 1080 x 1080 on square profile grid
    cropTop = 420;
    cropBottom = 420;
    safeHeight = 1080;
    safeRatioLabel = '1:1 Center Safe Zone (1080×1080)';
    description = '420px top & bottom cropped on profile grid; full 1920px visible on Reels tab';
  }

  // Canva does not support URL query parameters for custom dimensions; link to Canva design home
  const canvaUrl = 'https://www.canva.com/';

  return {
    width,
    height,
    tileWidth: format.tileWidth,
    tileHeight: format.tileHeight,
    cols,
    rows,
    totalTiles,
    aspectRatio: width / height,
    canvaUrl,
    verticalGuides,
    horizontalGuides,
    safeZones: {
      cropTop,
      cropBottom,
      safeHeight,
      safeRatioLabel,
      description,
    },
  };
}

/**
 * Calculates posting order for each tile in reverse-chronological order.
 * Instagram profile grid layout:
 * Row 1 (top):    Tile (1,1)  Tile (1,2)  Tile (1,3)
 * Row 2:          Tile (2,1)  Tile (2,2)  Tile (2,3)
 * ...
 * Row R (bottom): Tile (R,1)  Tile (R,2)  Tile (R,3)
 *
 * Instagram chronological insertion puts the newest post at (1,1),
 * shifting earlier posts right and down.
 * Therefore:
 * - Post #1 (FIRST upload) = Row R, Col 3 (bottom-right)
 * - Post #2                = Row R, Col 2 (bottom-center)
 * - Post #3                = Row R, Col 1 (bottom-left)
 * ...
 * - Post #total (LAST upload) = Row 1, Col 1 (top-left)
 */
export function getTileUploadOrder(row: number, col: number, totalRows: number): number {
  // 1-indexed row (1 to totalRows) and col (1 to 3)
  // Distance from bottom-right:
  const rowFromBottom = totalRows - row; // 0 for bottom row
  const colFromRight = 3 - col; // 0 for col 3, 1 for col 2, 2 for col 1
  return rowFromBottom * 3 + colFromRight + 1;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
