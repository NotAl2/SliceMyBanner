import React, { useState } from 'react';
import {
  Square,
  RectangleVertical,
  Film,
  LayoutGrid,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import type { GridFormat, GridFormatId } from '../types';
import {
  GRID_FORMATS,
  POPULAR_PRESETS,
  calculateDimensions,
} from '../utils/dimensions';

interface GridConfiguratorProps {
  selectedFormat: GridFormat;
  onFormatChange: (format: GridFormat) => void;
  rows: number;
  onRowsChange: (rows: number) => void;
  onCopyText: (text: string, label: string) => void;
  onOpenCanvaGuide: () => void;
}

export const GridConfigurator: React.FC<GridConfiguratorProps> = ({
  selectedFormat,
  onFormatChange,
  rows,
  onRowsChange,
  onCopyText,
  onOpenCanvaGuide,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const dims = calculateDimensions(selectedFormat, rows);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatCards: Array<{
    id: GridFormatId;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'square', icon: Square },
    { id: 'portrait', icon: RectangleVertical },
    { id: 'reel_cover', icon: Film },
    { id: 'vertical_grid', icon: LayoutGrid },
  ];

  return (
    <div className="space-y-8">
      {/* Step Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center border border-[#EF5F18]">
              1
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#261A66] tracking-tight">
              Pick Your Post Style
            </h2>
          </div>
          <p className="text-sm text-[#261A66]/75 font-medium">
            Choose what you're making to calculate exact Canva dimensions.
          </p>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <span className="text-xs font-semibold text-[#261A66]/75 mr-1 shrink-0">
            Quick Pick:
          </span>
          {POPULAR_PRESETS.slice(0, 3).map((preset) => {
            const isMatch =
              selectedFormat.id === preset.formatId && rows === preset.rows;
            return (
              <button
                key={preset.label}
                onClick={() => {
                  onFormatChange(GRID_FORMATS[preset.formatId]);
                  onRowsChange(preset.rows);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer shrink-0 ${
                  isMatch
                    ? 'bg-[#261A66] text-white shadow-xs'
                    : 'bg-white text-[#261A66] border border-[#E6E4EC] hover:border-[#261A66]'
                }`}
              >
                <span className="font-number">{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BIG TILES FOR FORMAT SELECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {formatCards.map(({ id, icon: Icon }) => {
          const fmt = GRID_FORMATS[id];
          const isSelected = selectedFormat.id === fmt.id;

          return (
            <div
              key={fmt.id}
              onClick={() => onFormatChange(fmt)}
              className={`p-7 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-[#261A66] text-white shadow-xl shadow-[#261A66]/25 -translate-y-1'
                  : 'bg-white hover:bg-[#E6E4EC] text-[#261A66] border border-[#E6E4EC] shadow-xs hover:border-[#261A66] hover:-translate-y-0.5'
              }`}
            >
              <div>
                {/* Minimal Icon & Status Pill */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white backdrop-blur-xs'
                        : 'bg-[#E6E4EC] text-[#261A66]'
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-[#EF5F18] text-[#261A66] shadow-xs'
                        : 'bg-[#E6E4EC] text-[#261A66]/80 border border-[#E6E4EC]'
                    }`}
                  >
                    {isSelected ? 'ACTIVE' : 'SELECT'}
                  </span>
                </div>

                <h3
                  className={`font-bold text-lg mb-1.5 tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#261A66]'
                  }`}
                >
                  {fmt.name}
                </h3>
                <p
                  className={`text-xs font-medium leading-relaxed mb-6 ${
                    isSelected ? 'text-white/95' : 'text-[#261A66]/75'
                  }`}
                >
                  {fmt.tagline}
                </p>
              </div>

              {/* Tile Size & Aspect Ratio Specs */}
              <div
                className={`pt-4 border-t flex items-center justify-between text-xs font-medium ${
                  isSelected
                    ? 'border-white/20 text-white'
                    : 'border-[#E6E4EC] text-[#261A66]/75'
                }`}
              >
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isSelected
                      ? 'bg-[#261A66]/25 border border-white/20 text-white'
                      : 'bg-[#E6E4EC]/60 text-[#261A66] border border-[#E6E4EC]'
                  }`}
                >
                  <span className="font-number">{fmt.ratioLabel}</span> Ratio
                </span>
                <span
                  className={`font-number text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-[#261A66]'
                  }`}
                >
                  {fmt.tileWidth} × {fmt.tileHeight} px
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROW COUNT SELECTION */}
      <div className="modern-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-lg text-[#261A66] tracking-tight">
              How Many Rows High?
            </h3>
            <p className="text-xs text-[#261A66]/75 font-medium">
              Instagram profile grid is always 3 columns wide. Select how many rows you want to slice.
            </p>
          </div>

          <div className="text-xs font-bold bg-[#EF5F18] text-[#261A66] border border-[#EF5F18] px-3 py-1.5 rounded-full self-start sm:self-auto">
            Total Output: <strong className="font-number text-[#261A66] font-extrabold">{dims.totalTiles} posts</strong>
          </div>
        </div>

        {/* Row Options as Big Sleek Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
          {[
            { r: 1, tag: 'Top Banner' },
            { r: 2, tag: 'Mini Grid' },
            { r: 3, tag: 'Full Puzzle' },
            { r: 4, tag: 'Tall Grid' },
            { r: 5, tag: 'Giant Grid' },
          ].map(({ r, tag }) => {
            const isSelected = rows === r;
            return (
              <button
                key={r}
                onClick={() => onRowsChange(r)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#261A66] text-white shadow-md'
                    : 'bg-[#E6E4EC] hover:bg-white text-[#261A66] border border-[#E6E4EC] hover:border-[#261A66]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-base tracking-tight font-number">
                    {r} {r === 1 ? 'Row' : 'Rows'}
                  </span>
                  <span
                    className={`text-xs font-number font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#EF5F18] text-[#261A66]'
                        : 'bg-[#E6E4EC] text-[#261A66]'
                    }`}
                  >
                    {r * 3}
                  </span>
                </div>
                <p
                  className={`text-xs font-medium ${
                    isSelected ? 'text-[#E6E4EC]' : 'text-[#261A66]/75'
                  }`}
                >
                  {tag}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CANVA BLUEPRINT BOX */}
      <div className="bg-white border-2 border-[#261A66] border border-[#E6E4EC] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Main Dimensions Readout */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-[#EF5F18] text-[#261A66] px-3 py-1 rounded-full border border-[#EF5F18] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#261A66]" />
              <span>Exact Canva Pixel Dimensions</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-number text-3xl sm:text-5xl font-black text-[#261A66] tracking-tight">
                {dims.width}{' '}
                <span className="text-[#261A66]/50 font-light">×</span>{' '}
                {dims.height}
              </span>
              <span className="text-xs font-bold text-[#261A66] bg-white px-2.5 py-1 rounded-full border border-[#E6E4EC] shadow-xs font-number uppercase">
                Pixels
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#261A66]/80 font-medium max-w-xl">
              Create a custom size in Canva with these dimensions. Slices cleanly into{' '}
              <strong className="font-number text-[#261A66] font-bold">{dims.totalTiles} tiles</strong> of{' '}
              <span className="font-number font-bold text-[#261A66]">
                {dims.tileWidth} × {dims.tileHeight} px
              </span>
              .
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${dims.width} x ${dims.height}`);
                onCopyText(`${dims.width} × ${dims.height} px`, 'Dimensions copied! In Canva: Create a design > Custom size');
                window.open('https://www.canva.com/', '_blank', 'noopener,noreferrer');
              }}
              className="btn-primary text-xs py-3 px-5 cursor-pointer w-full sm:w-auto justify-center order-first lg:order-last"
            >
              <span>Open in Canva</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                handleCopy(`${dims.width} x ${dims.height}`, 'full', 'Dimensions')
              }
              className="btn-white text-xs py-3 px-4 font-number flex-1 sm:flex-initial justify-center"
            >
              {copiedKey === 'full' ? (
                <Check className="w-4 h-4 text-[#EF5F18] stroke-[2.5]" />
              ) : (
                <Copy className="w-4 h-4 text-[#261A66]/80" />
              )}
              <span>{copiedKey === 'full' ? 'Copied!' : 'Copy Size'}</span>
            </button>

            <button
              onClick={() => handleCopy(String(dims.width), 'w', 'Width')}
              className="btn-white text-xs font-number font-bold py-3 px-3.5 text-[#261A66] flex-1 sm:flex-initial justify-center"
              title="Copy width only"
            >
              {copiedKey === 'w' ? (
                <Check className="w-3.5 h-3.5 text-[#EF5F18]" />
              ) : (
                `W: ${dims.width}`
              )}
            </button>

            <button
              onClick={() => handleCopy(String(dims.height), 'h', 'Height')}
              className="btn-white text-xs font-number font-bold py-3 px-3.5 text-[#261A66] flex-1 sm:flex-initial justify-center"
              title="Copy height only"
            >
              {copiedKey === 'h' ? (
                <Check className="w-3.5 h-3.5 text-[#EF5F18]" />
              ) : (
                `H: ${dims.height}`
              )}
            </button>
          </div>
        </div>

        {/* Canva Quick Instruction Bar */}
        <div className="mt-5 p-3 sm:p-3.5 bg-white rounded-2xl border border-[#E6E4EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#261A66]/80 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#E6E4EC] text-[#261A66] font-bold flex items-center justify-center shrink-0 font-number text-[11px]">
              i
            </span>
            <span className="font-medium text-[#261A66]">
              In Canva: Click <strong className="text-[#261A66]">Create a design</strong> (top right) ➔ <strong className="text-[#261A66]">Custom size</strong> ➔ paste <strong className="text-[#261A66] font-number font-bold">{dims.width}</strong> for Width & <strong className="text-[#261A66] font-number font-bold">{dims.height}</strong> for Height.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopy(String(dims.width), 'w', 'Width')}
              className="px-2.5 py-1 rounded-lg bg-[#E6E4EC] hover:bg-[#E6E4EC] text-[#261A66] font-semibold font-number text-xs transition-colors cursor-pointer border border-[#E6E4EC]"
              title="Copy width"
            >
              {copiedKey === 'w' ? 'Copied W!' : `Copy W: ${dims.width}`}
            </button>
            <button
              onClick={() => handleCopy(String(dims.height), 'h', 'Height')}
              className="px-2.5 py-1 rounded-lg bg-[#E6E4EC] hover:bg-[#E6E4EC] text-[#261A66] font-semibold font-number text-xs transition-colors cursor-pointer border border-[#E6E4EC]"
              title="Copy height"
            >
              {copiedKey === 'h' ? 'Copied H!' : `Copy H: ${dims.height}`}
            </button>
          </div>
        </div>

        {/* Safe Zone Alert Section */}
        {(selectedFormat.id === 'reel_cover' || selectedFormat.id === 'portrait') && (
          <div className="mt-6 pt-5 border-t border-[#E6E4EC] flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#EF5F18] flex items-center justify-center shrink-0 mt-0.5 text-[#261A66] border border-[#EF5F18]">
              <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="text-xs text-[#261A66] leading-relaxed font-medium">
              <strong className="text-[#261A66] font-bold block mb-0.5">
                Instagram Crop Rule for {selectedFormat.name}:
              </strong>
              {selectedFormat.id === 'reel_cover' ? (
                <>
                  Each Reel cover is <strong className="font-number">1080×1920 (9:16)</strong> in the Reels tab, but Instagram crops{' '}
                  <span className="font-bold font-number text-[#261A66] underline decoration-[#261A66] decoration-2">
                    420px off the top and bottom
                  </span>{' '}
                  when displayed on your profile grid. Keep hero titles and faces centered within the{' '}
                  <strong className="font-number">1080×1080 square safe box</strong>!
                </>
              ) : (
                <>
                  Each post is <strong className="font-number">1080×1350 (4:5)</strong> in the feed, but Instagram center-crops{' '}
                  <span className="font-bold font-number text-[#261A66] underline decoration-[#261A66] decoration-2">
                    135px off the top and bottom
                  </span>{' '}
                  on classic profile grids.
                </>
              )}
              <button
                onClick={onOpenCanvaGuide}
                className="ml-2 inline-flex items-center gap-1 text-[#261A66] hover:text-[#261A66] font-bold underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" /> View Canva ruler setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
