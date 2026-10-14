import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Layers,
  Shield,
  Pin,
  ListOrdered,
} from 'lucide-react';
import type { GridConfig, SliceItem } from '../types';
import { copySliceToClipboard, downloadBlob } from '../utils/zipExporter';

interface SlicerPreviewProps {
  slices: SliceItem[];
  config: GridConfig;
  onUpdateConfig: (partial: Partial<GridConfig>) => void;
  onSliceClick?: (slice: SliceItem) => void;
  onToast: (msg: string) => void;
}

export const SlicerPreview: React.FC<SlicerPreviewProps> = ({
  slices,
  config,
  onUpdateConfig,
  onSliceClick,
  onToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grid' | 'upload_order'>('grid');

  if (!slices.length) return null;

  const totalTiles = slices.length;
  const isReel = config.format.id === 'reel_cover';
  const isPortrait = config.format.id === 'portrait';

  const handleCopySlice = async (slice: SliceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copySliceToClipboard(slice.blob);
    if (success) {
      setCopiedId(slice.id);
      onToast(`Copied ${slice.suggestedFilename} to clipboard!`);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      onToast('Direct clipboard copy not supported by your browser. Use Download instead.');
    }
  };

  const handleDownloadSlice = (slice: SliceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadBlob(slice.blob, slice.suggestedFilename);
    onToast(`Downloaded ${slice.suggestedFilename}`);
  };

  const slicesInUploadOrder = [...slices].sort((a, b) => a.uploadOrder - b.uploadOrder);

  return (
    <div className="space-y-6">
      {/* Slicer Controls Bar */}
      <div className="modern-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* View Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#EBEBEB]/50 p-1 rounded-full border border-[#EBEBEB] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('grid')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'grid'
                ? 'bg-[#10367D] text-white shadow-xs'
                : 'text-[#10367D]/80 hover:text-[#10367D]'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'grid' ? 'text-[#74B4DA]' : 'text-[#10367D]'}`} />
            <span>Grid (<span className="font-number">3 × {config.rows}</span>)</span>
          </button>

          <button
            onClick={() => setActiveTab('upload_order')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload_order'
                ? 'bg-[#10367D] text-white shadow-xs'
                : 'text-[#10367D]/80 hover:text-[#10367D]'
            }`}
          >
            <ListOrdered className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'upload_order' ? 'text-[#74B4DA]' : 'text-[#10367D]'}`} />
            <span>Order (<span className="font-number">1→{totalTiles}</span>)</span>
          </button>
        </div>

        {/* Quirks & Safe Zone Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seam Gap Selector */}
          <div className="flex items-center gap-1.5 bg-[#EBEBEB] px-3 py-1.5 rounded-full border border-[#EBEBEB]">
            <span className="text-[#10367D]/75 font-semibold text-xs">Gap:</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((gap) => (
                <button
                  key={gap}
                  onClick={() => onUpdateConfig({ seamGap: gap })}
                  className={`w-6 h-6 rounded-full font-number text-xs font-bold transition-all cursor-pointer ${
                    config.seamGap === gap
                      ? 'bg-[#10367D] text-white shadow-xs'
                      : 'text-[#10367D]/80 hover:bg-[#EBEBEB]'
                  }`}
                >
                  {gap}
                </button>
              ))}
            </div>
          </div>

          {/* Safe Zone Toggle (if Reel or Portrait) */}
          {(isReel || isPortrait) && (
            <button
              onClick={() => onUpdateConfig({ showSafeZone: !config.showSafeZone })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                config.showSafeZone
                  ? 'bg-[#74B4DA] text-[#10367D] border-[#74B4DA]'
                  : 'bg-white text-[#10367D]/80 border-[#EBEBEB] hover:bg-[#EBEBEB]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#10367D]" />
              <span>Safe Crop</span>
            </button>
          )}

          {/* Posting Numbers Toggle */}
          <button
            onClick={() => onUpdateConfig({ showPostingOrder: !config.showPostingOrder })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              config.showPostingOrder
                ? 'bg-[#74B4DA] text-[#10367D] border-[#74B4DA]'
                : 'bg-white text-[#10367D]/80 border-[#EBEBEB] hover:bg-[#EBEBEB]'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-[#10367D]" />
            <span>Post Order</span>
          </button>
        </div>
      </div>

      {/* Grid Mode View */}
      {activeTab === 'grid' && (
        <div className="modern-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[#10367D]/75 flex-wrap gap-2">
            <span className="flex items-center gap-2 text-[#10367D]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10367D]" />
              <span>
                <strong className="font-number font-bold">{totalTiles}</strong> Slices Generated (
                <span className="font-number">{slices[0]?.width} × {slices[0]?.height}</span> px each)
              </span>
            </span>
            <span className="text-[#10367D]/70 font-medium">
              Hover any slice to preview or download
            </span>
          </div>

          {/* Grid Container */}
          <div
            className="grid grid-cols-3 mx-auto transition-all"
            style={{
              gap: `${config.seamGap * 3}px`,
              maxWidth: isReel ? '640px' : isPortrait ? '700px' : '760px',
            }}
          >
            {slices.map((slice) => {
              const isFirstUpload = slice.uploadOrder === 1;
              const isLastUpload = slice.uploadOrder === totalTiles;
              const isPinned = slice.isPinned;

              return (
                <div
                  key={slice.id}
                  onClick={() => onSliceClick && onSliceClick(slice)}
                  className="slice-tile group relative rounded-2xl overflow-hidden border border-[#EBEBEB] bg-white cursor-pointer shadow-xs hover:shadow-md transition-all duration-200"
                  style={{
                    aspectRatio: isReel ? '9 / 16' : isPortrait ? '4 / 5' : '1 / 1',
                  }}
                >
                  {/* Sliced Image */}
                  <img
                    src={slice.dataUrl}
                    alt={`Slice ${slice.suggestedFilename}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Safe Zone Visual Overlay */}
                  {config.showSafeZone && (isReel || isPortrait) && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      {isReel && (
                        <>
                          <div
                            className="w-full bg-[#10367D]/40 border-b border-white/30 text-xs font-number font-medium text-white flex items-center justify-center"
                            style={{ height: '21.875%' }}
                          >
                            <span>Cropped 420px</span>
                          </div>
                          <div className="w-full flex-1 border-2 border-dashed border-[#10367D] bg-[#10367D]/15 relative flex items-center justify-center">
                            <span className="text-xs font-bold text-[#10367D] bg-[#74B4DA] border border-[#74B4DA] px-2 py-0.5 rounded-full shadow-xs">
                              1:1 Safe Zone
                            </span>
                          </div>
                          <div
                            className="w-full bg-[#10367D]/40 border-t border-white/30 text-xs font-number font-medium text-white flex items-center justify-center"
                            style={{ height: '21.875%' }}
                          >
                            <span>Cropped 420px</span>
                          </div>
                        </>
                      )}
                      {isPortrait && (
                        <>
                          <div
                            className="w-full bg-[#10367D]/40 border-b border-white/30 text-xs font-medium text-white flex items-center justify-center"
                            style={{ height: '10%' }}
                          >
                            <span>Cropped</span>
                          </div>
                          <div className="w-full flex-1 border-2 border-dashed border-[#10367D] bg-[#10367D]/15 relative flex items-center justify-center">
                            <span className="text-xs font-bold text-[#10367D] bg-[#74B4DA] border border-[#74B4DA] px-2 py-0.5 rounded-full shadow-xs">
                              1:1 Safe
                            </span>
                          </div>
                          <div
                            className="w-full bg-[#10367D]/40 border-t border-white/30 text-xs font-medium text-white flex items-center justify-center"
                            style={{ height: '10%' }}
                          >
                            <span>Cropped</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Posting Sequence Badge Overlay */}
                  {config.showPostingOrder && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs ${
                          isFirstUpload
                            ? 'bg-[#74B4DA] text-[#10367D] border border-[#74B4DA] font-number font-bold'
                            : isLastUpload
                            ? 'bg-[#10367D] text-white font-number'
                            : 'bg-white text-[#10367D] border border-[#EBEBEB] font-number'
                        }`}
                      >
                        {isFirstUpload
                          ? '1st to Post'
                          : isLastUpload
                          ? `${slice.uploadOrder}th: Last`
                          : `Post #${slice.uploadOrder}`}
                      </span>

                      {isPinned && (
                        <span className="text-xs font-bold bg-[#74B4DA] text-[#10367D] border border-[#74B4DA] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tile Coordinate (Bottom Right) */}
                  <div className="absolute bottom-2 right-2 text-xs font-number font-semibold bg-white/95 text-[#10367D] px-2 py-0.5 rounded-md border border-[#EBEBEB] pointer-events-none shadow-xs">
                    R{slice.row}:C{slice.col}
                  </div>

                  {/* Hover Overlay with Quick Actions */}
                  <div className="absolute inset-0 bg-[#10367D]/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-center">
                    <span className="text-xs font-semibold text-white font-number">
                      Step #{slice.uploadOrder}
                    </span>
                    <span className="text-xs text-[#74B4DA] font-number font-semibold">
                      {slice.width} × {slice.height} px
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={(e) => handleDownloadSlice(slice, e)}
                        className="w-9 h-9 rounded-full bg-white hover:bg-[#10367D] hover:text-white text-[#10367D] shadow-md flex items-center justify-center transition-all cursor-pointer"
                        title="Download this slice"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleCopySlice(slice, e)}
                        className="w-9 h-9 rounded-full bg-white hover:bg-[#10367D] hover:text-white text-[#10367D] shadow-md flex items-center justify-center transition-all cursor-pointer"
                        title="Copy image to clipboard"
                      >
                        {copiedId === slice.id ? (
                          <Check className="w-4 h-4 text-[#74B4DA]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Order Sequence Mode */}
      {activeTab === 'upload_order' && (
        <div className="modern-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-extrabold text-lg text-[#10367D] tracking-tight">
                Instagram Upload Sequence
              </h3>
              <p className="text-sm text-[#10367D]/75 font-medium">
                Post in this exact sequence to ensure your banner displays properly on your profile grid.
              </p>
            </div>
            <span className="text-xs font-bold text-[#10367D] bg-[#74B4DA] border border-[#74B4DA] px-3 py-1 rounded-full font-number">
              {totalTiles} Slices Total
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {slicesInUploadOrder.map((slice) => {
              const isFirst = slice.uploadOrder === 1;
              const isLast = slice.uploadOrder === totalTiles;

              return (
                <div
                  key={slice.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isFirst
                      ? 'bg-[#74B4DA]/30 border-[#74B4DA] shadow-xs'
                      : isLast
                      ? 'bg-[#EBEBEB]/40 border-[#EBEBEB]'
                      : 'bg-white border-[#EBEBEB] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span
                      className={`text-xs font-bold font-number ${
                        isFirst
                          ? 'text-[#10367D] font-extrabold'
                          : isLast
                          ? 'text-[#10367D]'
                          : 'text-[#10367D]/80'
                      }`}
                    >
                      Step {slice.uploadOrder}
                    </span>
                    <span className="text-xs text-[#10367D]/70 font-number">
                      R{slice.row}:C{slice.col}
                    </span>
                  </div>

                  <div
                    className="relative rounded-xl overflow-hidden border border-[#EBEBEB] bg-white"
                    style={{
                      aspectRatio: isReel ? '9 / 16' : isPortrait ? '4 / 5' : '1 / 1',
                    }}
                  >
                    <img
                      src={slice.dataUrl}
                      alt={slice.suggestedFilename}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#10367D]/80 font-medium truncate font-number">
                      {isFirst ? 'Post 1st' : isLast ? 'Post Last' : `Post #${slice.uploadOrder}`}
                    </span>
                    <button
                      onClick={(e) => handleDownloadSlice(slice, e)}
                      className="p-1.5 rounded-full hover:bg-[#EBEBEB] text-[#10367D]/75 transition-colors cursor-pointer"
                      title="Download slice"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
