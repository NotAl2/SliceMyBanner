export type GridFormatId = 'square' | 'portrait' | 'vertical_grid' | 'reel_cover';

export interface GridFormat {
  id: GridFormatId;
  name: string;
  tagline: string;
  description: string;
  tileWidth: number;
  tileHeight: number;
  ratioLabel: string;
  aspectRatio: number; // width / height
  badge: string;
  safeZoneDescription?: string;
  cropNotes: string;
}

export interface GridConfig {
  cols: number; // Always 3 for Instagram profile grid
  rows: number; // 1 to 10
  format: GridFormat;
  seamGap: number; // 0, 1, 2, 3 pixels simulation
  showSafeZone: boolean;
  showPostingOrder: boolean;
  edgeCropProtection: boolean; // 2px edge bleed safety
}

export interface SliceItem {
  id: string;
  col: number; // 1, 2, 3 (left to right)
  row: number; // 1 to rows (top to bottom)
  uploadOrder: number; // 1 to total (1 is uploaded first on Instagram: bottom-right!)
  tileIndex: number; // 0 to total - 1 (reading order: row-major)
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  isPinned: boolean; // Top row can be pinned as a 3-post banner
  suggestedFilename: string;
}

export interface UploadedImageInfo {
  name: string;
  size: number;
  width: number;
  height: number;
  aspectRatio: number;
  file: File;
  dataUrl: string;
}

export interface CanvaPreset {
  label: string;
  rows: number;
  formatId: GridFormatId;
  recommendedFor: string;
}
