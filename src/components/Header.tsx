import React from 'react';
import { BookOpen, RotateCcw, Coffee } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenDonate: () => void;
  onReset: () => void;
  hasUploadedImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenDonate,
  onReset,
  hasUploadedImage,
}) => {
  return (
    <header className="w-full bg-[#F5F4F8]/90 backdrop-blur-md border-b border-[#E6E4EC] sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#E6E4EC] flex items-center justify-center p-1 shadow-xs shrink-0 transition-transform hover:scale-105">
            <Logo variant="theme" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#261A66] whitespace-nowrap">
              Slice<span className="text-[#EF5F18]">My</span>Banner
            </span>
            <span className="hidden lg:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#EF5F18] text-white rounded-full whitespace-nowrap">
              IG Banner Slicer
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-bold text-[#261A66]">
          <a
            href="#step-calculator"
            className="whitespace-nowrap hover:text-[#EF5F18] transition-colors"
          >
            Sizing Blueprint
          </a>
          <a
            href="#step-uploader"
            className="whitespace-nowrap hover:text-[#EF5F18] transition-colors"
          >
            Upload Banner
          </a>
          <a
            href="#canva-dimensions"
            className="whitespace-nowrap hover:text-[#EF5F18] transition-colors"
          >
            Dimensions
          </a>
          <a
            href="#faq"
            className="whitespace-nowrap hover:text-[#EF5F18] transition-colors"
          >
            FAQ
          </a>
          <button
            onClick={onOpenDonate}
            className="whitespace-nowrap hover:text-[#EF5F18] transition-colors cursor-pointer flex items-center gap-1 text-[#EF5F18]"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>
        </nav>

        {/* Quick Actions (matching pill buttons in reference) */}
        <div className="flex items-center gap-2 shrink-0">
          {hasUploadedImage && (
            <button
              onClick={onReset}
              className="btn-white text-xs py-1.5 px-3 flex items-center gap-1 whitespace-nowrap"
              title="Start over with a new banner"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#261A66]/70" />
              <span className="text-xs">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenGuide}
            className="btn-dark text-xs py-2 px-3 sm:px-3.5 flex items-center gap-1.5 whitespace-nowrap"
            title="Open Canva Sizing Guide"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Canva Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          <button
            onClick={onOpenDonate}
            className="btn-primary text-xs py-2 px-3 sm:px-3.5 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            title="Buy me a coffee"
          >
            <Coffee className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Buy Me a Coffee</span>
            <span className="sm:hidden">Donate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
