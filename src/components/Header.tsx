import React from 'react';
import { BookOpen, RotateCcw } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  hasUploadedImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onReset,
  hasUploadedImage,
}) => {
  return (
    <header className="w-full bg-[#FBFBF8]/90 backdrop-blur-md border-b border-[#DBE3E9] sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand / Logo - Exactly matches card header */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#DBE3E9] border border-[#c2cdd7] flex items-center justify-center p-1.5 shadow-xs shrink-0 transition-transform hover:scale-105">
            <Logo variant="theme" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-black">
              Slice<span className="text-[#6AA6DA]">My</span>Banner
            </span>
            <span className="hidden lg:inline-flex px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-[#E1E5AC] text-black border border-[#d4da98] rounded-full">
              CANVA IG BANNER & REEL SLICER
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <a
            href="#step-calculator"
            className="hover:text-[#6AA6DA] transition-colors"
          >
            Sizing Blueprint
          </a>
          <a
            href="#step-uploader"
            className="hover:text-[#6AA6DA] transition-colors"
          >
            Upload Banner
          </a>
          <a
            href="#canva-dimensions"
            className="hover:text-[#6AA6DA] transition-colors"
          >
            Dimensions
          </a>
          <a
            href="#faq"
            className="hover:text-[#6AA6DA] transition-colors"
          >
            FAQ
          </a>
          <button
            onClick={onOpenGuide}
            className="hover:text-[#6AA6DA] transition-colors cursor-pointer"
          >
            Canva Guide
          </button>
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {hasUploadedImage && (
            <button
              onClick={onReset}
              className="btn-white text-xs py-1.5 px-2 sm:py-2 sm:px-3.5 flex items-center gap-1"
              title="Start over with a new banner"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline text-xs">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenGuide}
            className="btn-dark text-xs py-1.5 px-2.5 sm:py-2.5 sm:px-5 flex items-center gap-1.5"
            title="Open Canva Sizing Guide"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Canva Guide</span>
            <span className="sm:hidden text-xs font-semibold">Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
