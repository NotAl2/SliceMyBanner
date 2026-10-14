import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Lightbulb, AlertCircle } from 'lucide-react';
import type { GridFormat } from '../types';
import { calculateDimensions } from '../utils/dimensions';

interface CanvaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  format: GridFormat;
  rows: number;
  onCopyText: (text: string, label: string) => void;
}

export const CanvaGuideModal: React.FC<CanvaGuideModalProps> = ({
  isOpen,
  onClose,
  format,
  rows,
  onCopyText,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  if (!isOpen) return null;

  const dims = calculateDimensions(format, rows);

  const handleCopy = (text: string, key: string, label: string) => {
    onCopyText(text, label);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#261A66]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[0_20px_60px_rgba(38, 26, 102,0.15)] border border-[#E6E4EC] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F5F4F8] text-[#261A66]/50 hover:text-[#261A66]/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#EF5F18] border border-[#EF5F18] flex items-center justify-center text-[#261A66] shadow-xs">
            <Lightbulb className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#261A66] tracking-tight">
              Canva Setup & Guide Blueprint
            </h3>
            <p className="text-xs text-[#261A66]/75 font-medium">
              How to configure rulers and safe zones inside Canva
            </p>
          </div>
        </div>

        {/* Dimensions Summary Bar */}
        <div className="bg-[#F5F4F8] border border-[#E6E4EC] rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#261A66] block mb-0.5">
              Custom Canvas Size ({format.name} • <span className="font-number">{rows}</span> {rows === 1 ? 'Row' : 'Rows'})
            </span>
            <span className="font-number text-2xl sm:text-3xl font-extrabold text-[#261A66]">
              {dims.width} × {dims.height} px
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(`${dims.width} x ${dims.height}`, 'dims', 'Dimensions')}
              className="btn-white text-xs py-2 px-3.5"
            >
              {copiedKey === 'dims' ? (
                <Check className="w-4 h-4 text-[#EF5F18]" />
              ) : (
                <Copy className="w-4 h-4 text-[#261A66]/80" />
              )}
              <span>Copy</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${dims.width} x ${dims.height}`);
                onCopyText(`${dims.width} × ${dims.height} px`, 'Dimensions copied! Opening Canva');
                window.open('https://www.canva.com/', '_blank', 'noopener,noreferrer');
              }}
              className="btn-primary text-xs py-2 px-4 cursor-pointer"
            >
              <span>Create in Canva</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-5 text-sm text-[#261A66]">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] border border-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="font-bold text-base text-[#261A66] mb-1">
                Create Custom Canvas in Canva
              </h4>
              <p className="text-xs text-[#261A66]/75 leading-relaxed font-medium">
                In Canva, click <strong>Create a design</strong> &gt; <strong>Custom size</strong>. Set Width to{' '}
                <strong className="text-[#261A66] font-number">{dims.width}</strong> and Height to{' '}
                <strong className="text-[#261A66] font-number">{dims.height}</strong> (unit: <strong>px</strong>).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] border border-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="font-bold text-base text-[#261A66] mb-1">
                Turn on Rulers and Guides
              </h4>
              <p className="text-xs text-[#261A66]/75 leading-relaxed font-medium">
                Go to <strong>File</strong> &gt; <strong>View settings</strong> &gt; check{' '}
                <strong>Show rulers and guides</strong> (or press <kbd className="px-1.5 py-0.5 bg-[#F5F4F8]/50 border border-[#E6E4EC] rounded font-mono text-xs text-[#261A66]">Shift + R</kbd>).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] border border-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="font-bold text-base text-[#261A66] mb-1">
                Add Slicing Columns and Rows
              </h4>
              <p className="text-xs text-[#261A66]/75 leading-relaxed mb-2 font-medium">
                Go to <strong>File</strong> &gt; <strong>View settings</strong> &gt; <strong>Add guides</strong> &gt; choose <strong>Custom</strong>:
              </p>
              <div className="bg-[#F5F4F8] border border-[#E6E4EC] rounded-xl p-3.5 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#261A66]/70 block text-xs">Columns:</span>
                  <span className="text-[#261A66] font-bold font-number text-sm">3 Columns</span> (Gap: 0 px)
                </div>
                <div>
                  <span className="text-[#261A66]/70 block text-xs">Rows:</span>
                  <span className="text-[#261A66] font-bold font-number text-sm">{rows} {rows === 1 ? 'Row' : 'Rows'}</span> (Gap: 0 px)
                </div>
              </div>
            </div>
          </div>

          {/* Special Crop Rules */}
          {(format.id === 'reel_cover' || format.id === 'portrait') && (
            <div className="p-4 sm:p-5 bg-[#EF5F18]/10 border border-[#EF5F18]/40 rounded-2xl">
              <div className="flex items-center gap-2 text-[#261A66] font-bold mb-1.5">
                <AlertCircle className="w-4 h-4 stroke-[2.2]" />
                <span className="text-sm">Safe Zone Crop Guide for {format.name}</span>
              </div>
              {format.id === 'reel_cover' ? (
                <div className="text-xs text-[#261A66] space-y-1.5 leading-relaxed font-medium">
                  <p>
                    Reel covers display full <strong className="font-number">9:16 (1080×1920)</strong> in the Reels tab, but Instagram crops{' '}
                    <strong className="font-number text-[#261A66]">420px from top</strong> and <strong className="font-number text-[#261A66]">420px from bottom</strong> on the profile grid.
                  </p>
                  <p className="bg-white p-2.5 rounded-xl border border-[#E6E4EC] text-[#261A66] font-medium shadow-xs">
                    📐 Horizontal Safe Guide Marks: drag ruler guides to <span className="font-number font-bold text-[#261A66]">420 px</span> and <span className="font-number font-bold text-[#261A66]">1500 px</span> vertically. Keep hero titles and faces between those lines!
                  </p>
                </div>
              ) : (
                <div className="text-xs text-[#261A66] space-y-1.5 leading-relaxed font-medium">
                  <p>
                    Portrait feed posts are <strong className="font-number">4:5 (1080×1350)</strong>, but the profile grid crops{' '}
                    <strong className="font-number text-[#261A66]">135px from top</strong> and <strong className="font-number text-[#261A66]">135px from bottom</strong>.
                  </p>
                  <p className="bg-white p-2.5 rounded-xl border border-[#E6E4EC] text-[#261A66] font-medium shadow-xs">
                    📐 Horizontal Safe Guide Marks: drag ruler guides to <span className="font-number font-bold text-[#261A66]">135 px</span> and <span className="font-number font-bold text-[#261A66]">1215 px</span> vertically.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          <div className="flex items-start gap-3.5">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] border border-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div>
              <h4 className="font-bold text-base text-[#261A66] mb-1">
                Download PNG & Drop Into SliceMyBanner
              </h4>
              <p className="text-xs text-[#261A66]/75 leading-relaxed font-medium">
                When your artwork is complete, export it as <strong>PNG</strong> from Canva, then drop the file into Step 2 to slice!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[#E6E4EC] flex justify-end">
          <button
            onClick={onClose}
            className="btn-dark text-xs py-2.5 px-6"
          >
            Got it, Let's Design
          </button>
        </div>
      </div>
    </div>
  );
};
