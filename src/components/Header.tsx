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
    <header className="w-full bg-[#F5F4F8]/90 backdrop-blur-md border-b border-[#E6E4EC] sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F5F4F8] border border-[#E6E4EC] flex items-center justify-center p-1 sm:p-1.5 shadow-xs shrink-0 transition-transform hover:scale-105">
            <Logo variant="theme" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-xl tracking-tight text-[#261A66]">
              Slice<span className="text-[#EF5F18]">My</span>Banner
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#EF5F18] text-white font-bold border border-[#EF5F18] rounded-full">
              IG Banner Slicer
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#261A66]/80">
          <a
            href="#step-calculator"
            className="hover:text-[#261A66] transition-colors"
          >
            Sizing Blueprint
          </a>
          <a
            href="#step-uploader"
            className="hover:text-[#261A66] transition-colors"
          >
            Upload Banner
          </a>
          <a
            href="#canva-dimensions"
            className="hover:text-[#261A66] transition-colors"
          >
            Dimensions
          </a>
          <a
            href="#faq"
            className="hover:text-[#261A66] transition-colors"
          >
            FAQ
          </a>
          <button
            onClick={onOpenGuide}
            className="hover:text-[#261A66] transition-colors cursor-pointer"
          >
            Canva Guide
          </button>
        </nav>

        {/* Quick Actions (matching pill buttons in reference) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {hasUploadedImage && (
            <button
              onClick={onReset}
              className="btn-white text-xs py-1.5 px-2 sm:py-2 sm:px-3.5 flex items-center gap-1"
              title="Start over with a new banner"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#261A66]/70" />
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
