import React, { useState } from 'react';
import {
  FileArchive,
  Check,
  Copy,
  ArrowDownToLine,
  Sparkles,
  Coffee,
} from 'lucide-react';
import type { GridConfig, SliceItem } from '../types';
import { generateZipArchive, downloadBlob } from '../utils/zipExporter';
import { triggerConfetti } from '../utils/animations';

interface ExportPanelProps {
  slices: SliceItem[];
  config: GridConfig;
  onToast: (msg: string) => void;
  onOpenDonate?: () => void;
  onDownloadDone?: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  slices,
  config,
  onToast,
  onOpenDonate,
  onDownloadDone,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);

  if (!slices.length) return null;

  const totalTiles = slices.length;
  const sortedSlices = [...slices].sort((a, b) => a.uploadOrder - b.uploadOrder);

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateZipArchive(slices, config, 'slicemybanner_slices');
      const filename = `slicemybanner_${config.format.id}_${config.rows}x3_slices.zip`;
      downloadBlob(zipBlob, filename);
      triggerConfetti();
      onToast(`Downloaded ${filename}!`);
      if (onDownloadDone) {
        onDownloadDone();
      }
    } catch (err) {
      console.error('ZIP generation error:', err);
      onToast('Failed to create ZIP. Try downloading tiles individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyGuide = () => {
    let guide = `SLICEMYBANNER POSTING GUIDE (${totalTiles} Posts Total):\n\n`;
    sortedSlices.forEach((slice) => {
      const isFirst = slice.uploadOrder === 1;
      const isLast = slice.uploadOrder === totalTiles;
      const tag = isFirst
        ? ' [UPLOAD THIS FIRST (Bottom-Right)]'
        : isLast
        ? ' [UPLOAD THIS LAST (Top-Left)]'
        : '';
      guide += `Step ${slice.uploadOrder}: ${slice.suggestedFilename}${tag}\n`;
    });
    guide += `\nUploading in reverse order makes your banner line up seamlessly on your profile!`;

    navigator.clipboard.writeText(guide);
    setCopiedGuide(true);
    onToast('Posting guide text copied to clipboard!');
    setTimeout(() => setCopiedGuide(false), 2000);
  };

  return (
    <div className="modern-card p-6 sm:p-10 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] text-[#261A66] font-bold font-number text-xs flex items-center justify-center border border-[#EF5F18]">
              4
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#261A66] tracking-tight">
              Download Slices & Posting Guide
            </h2>
          </div>
          <p className="text-sm text-[#261A66]/75 font-medium">
            Everything is pre-numbered in reverse order so you can post without making a single mistake.
          </p>
        </div>

        <button
          onClick={handleCopyGuide}
          className="btn-white text-xs py-2 px-3.5 self-start sm:self-auto"
        >
          {copiedGuide ? (
            <Check className="w-4 h-4 text-[#EF5F18]" />
          ) : (
            <Copy className="w-4 h-4 text-[#261A66]/75" />
          )}
          <span className="hidden sm:inline">Copy Posting Order</span>
          <span className="sm:hidden">Copy Order</span>
        </button>
      </div>

      {/* Main Download Big Banner Tile */}
      <div className="bg-[#261A66] text-white rounded-3xl p-5 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xl border border-[#E6E4EC]/30">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#EF5F18] text-white px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Complete ZIP Bundle (<span className="font-number">{totalTiles}</span> Slices)</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
            Download All <span className="font-number">{totalTiles}</span> Slices
          </h3>
          <p className="text-xs sm:text-sm text-white/80 font-medium max-w-lg leading-relaxed">
            Slices are cleanly named like{' '}
            <code className="bg-white/15 px-2 py-0.5 rounded-full font-number font-semibold text-xs text-[#EF5F18]">
              01_UPLOAD_FIRST_...
            </code>{' '}
            so you know exactly what order to post on Instagram!
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm bg-[#EF5F18] hover:bg-white text-white hover:text-[#261A66] shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          {isZipping ? (
            <>
              <div className="w-4 h-4 border-2 border-[#261A66] border-t-transparent rounded-full animate-spin" />
              <span>Packaging ZIP...</span>
            </>
          ) : (
            <>
              <FileArchive className="w-4 h-4 text-[#261A66]" />
              <span>Download All as ZIP</span>
            </>
          )}
        </button>
      </div>

      {/* Buy Me a Coffee Support Banner */}
      {onOpenDonate && (
        <div className="bg-[#EF5F18]/10 border border-[#EF5F18]/30 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-full bg-[#EF5F18] flex items-center justify-center text-white shrink-0 shadow-xs mx-auto sm:mx-0">
              <Coffee className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-[#261A66]">
                Did SliceMyBanner save you time?
              </h4>
              <p className="text-xs text-[#261A66]/75 font-medium">
                Keep it 100% free and ad-free by chipping in for a coffee ($2, $5, $10, or $15)!
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDonate}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm hover:shadow-md transition-all shrink-0"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Buy Me a Coffee ($2 - $15)</span>
          </button>
        </div>
      )}

      {/* Upload Order Checklist */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs uppercase font-bold tracking-wider text-[#261A66]/75">
          Upload Order Checklist:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sortedSlices.map((slice) => {
            const isFirst = slice.uploadOrder === 1;
            const isLast = slice.uploadOrder === totalTiles;

            return (
              <div
                key={slice.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                  isFirst
                    ? 'bg-[#EF5F18]/25 border-[#EF5F18] shadow-xs'
                    : isLast
                    ? 'bg-[#E6E4EC]/40 border-[#E6E4EC]'
                    : 'bg-[#E6E4EC] border-[#E6E4EC] hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-number font-bold shrink-0 ${
                      isFirst
                        ? 'bg-[#EF5F18] text-[#261A66] border border-[#EF5F18]'
                        : isLast
                        ? 'bg-[#261A66] text-white'
                        : 'bg-white text-[#261A66] border border-[#E6E4EC] shadow-2xs'
                    }`}
                  >
                    {slice.uploadOrder}
                  </span>
                  <div className="truncate">
                    <p className="text-[#261A66] font-bold text-xs truncate">
                      {isFirst ? '1st: Post First' : isLast ? 'Last: Post Last' : `Post #${slice.uploadOrder}`}
                    </p>
                    <p className="text-xs text-[#261A66]/70 font-medium font-number">
                      Row {slice.row}, Col {slice.col}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    downloadBlob(slice.blob, slice.suggestedFilename);
                    onToast(`Downloaded ${slice.suggestedFilename}`);
                    if (onDownloadDone) {
                      onDownloadDone();
                    }
                  }}
                  className="p-2 rounded-full hover:bg-[#261A66] hover:text-white text-[#261A66]/80 transition-colors cursor-pointer"
                  title="Download single slice"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
