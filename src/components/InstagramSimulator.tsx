import React, { useState } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Logo } from './Logo';
import type { GridConfig, SliceItem } from '../types';

interface InstagramSimulatorProps {
  slices: SliceItem[];
  config: GridConfig;
}

export const InstagramSimulator: React.FC<InstagramSimulatorProps> = ({
  slices,
  config,
}) => {
  const [simulatorTab, setSimulatorTab] = useState<'grid' | 'reels' | 'feed'>('grid');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedFeedSlice, setSelectedFeedSlice] = useState<number>(0);

  if (!slices.length) return null;

  const isReel = config.format.id === 'reel_cover';
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-7 h-7 rounded-full bg-[#74B4DA] text-[#10367D] font-bold font-number text-xs flex items-center justify-center border border-[#74B4DA]">
              3
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10367D] tracking-tight">
              Live Profile Simulator
            </h2>
          </div>
          <p className="text-sm text-[#10367D]/75 font-medium">
            See exactly how your banner looks on a smartphone Instagram profile before uploading!
          </p>
        </div>

        {/* Simulator controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Tab selector */}
          <div className="flex items-center bg-[#EBEBEB]/50 p-1 rounded-full border border-[#EBEBEB] text-xs">
            <button
              onClick={() => setSimulatorTab('grid')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                simulatorTab === 'grid'
                  ? 'bg-[#10367D] text-white shadow-xs'
                  : 'text-[#10367D]/80 hover:text-[#10367D]'
              }`}
            >
              <Grid className={`w-3.5 h-3.5 ${simulatorTab === 'grid' ? 'text-[#74B4DA]' : 'text-[#10367D]'}`} />
              <span className="hidden sm:inline">Profile Grid</span>
              <span className="sm:hidden">Grid</span>
            </button>

            {isReel && (
              <button
                onClick={() => setSimulatorTab('reels')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  simulatorTab === 'reels'
                    ? 'bg-[#10367D] text-white shadow-xs'
                    : 'text-[#10367D]/80 hover:text-[#10367D]'
                }`}
              >
                <Film className={`w-3.5 h-3.5 ${simulatorTab === 'reels' ? 'text-[#74B4DA]' : 'text-[#10367D]'}`} />
                <span className="hidden sm:inline">Reels Tab</span>
                <span className="sm:hidden">Reels</span>
              </button>
            )}

            <button
              onClick={() => setSimulatorTab('feed')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                simulatorTab === 'feed'
                  ? 'bg-[#10367D] text-white shadow-xs'
                  : 'text-[#10367D]/80 hover:text-[#10367D]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${simulatorTab === 'feed' ? 'text-[#74B4DA]' : 'text-[#74B4DA]'}`} />
              <span className="hidden sm:inline">Feed Post</span>
              <span className="sm:hidden">Feed</span>
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-full bg-white hover:bg-[#EBEBEB] text-[#10367D] border border-[#EBEBEB] shadow-xs transition-colors cursor-pointer"
            title="Toggle Phone Dark/Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#74B4DA]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Smartphone Mockup */}
      <div className="flex justify-center py-2 px-1">
        <div className="w-full max-w-[340px] sm:max-w-[380px] rounded-[38px] sm:rounded-[48px] p-2.5 sm:p-3 bg-[#10367D] shadow-[0_25px_60px_-15px_rgba(16,54,125,0.2)] border-2 sm:border-4 border-[#10367D] transition-colors relative">
          {/* Phone Shell */}
          <div
            className={`w-full rounded-[30px] sm:rounded-[38px] overflow-hidden flex flex-col transition-colors ${
              isDark ? 'bg-[#10367D] text-white' : 'bg-white text-[#10367D]'
            }`}
            style={{ minHeight: '620px' }}
          >
            {/* Phone Status Bar */}
            <div className="px-6 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold tracking-tight">
              <span className="font-number">9:41</span>
              <div className="w-20 h-4 bg-[#10367D] rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-number">5G</span>
                <div className="w-4 h-2 border border-current rounded-xs p-0.5">
                  <div className="w-full h-full bg-current rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Instagram App Top Bar */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-[#EBEBEB]">
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm tracking-tight">your_creative_handle</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div className="flex items-center gap-4">
                <Heart className="w-4 h-4" />
                <Send className="w-4 h-4 -rotate-12" />
              </div>
            </div>

            {/* Profile Bio Section */}
            {simulatorTab !== 'feed' && (
              <div className="px-4 pt-3 pb-2 space-y-3">
                {/* Avatar and Stats */}
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <div className="w-18 h-18 rounded-full p-0.5 bg-gradient-to-tr from-[#10367D] via-[#74B4DA] to-[#10367D]">
                      <div className="w-full h-full rounded-full bg-[#EBEBEB] flex items-center justify-center p-2 border-2 border-white shadow-xs overflow-hidden">
                        <Logo variant="theme" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-center text-xs">
                    <div>
                      <span className="block font-bold font-number text-sm">{slices.length}</span>
                      <span className="text-xs text-[#10367D]/70">posts</span>
                    </div>
                    <div>
                      <span className="block font-bold font-number text-sm">34.2K</span>
                      <span className="text-xs text-[#10367D]/70">followers</span>
                    </div>
                    <div>
                      <span className="block font-bold font-number text-sm">412</span>
                      <span className="text-xs text-[#10367D]/70">following</span>
                    </div>
                  </div>
                </div>

                {/* Name & Bio */}
                <div className="text-xs space-y-0.5">
                  <p className="font-bold">Creative Director • Studio</p>
                  <p className="text-[#10367D]/75 dark:text-[#10367D]/50">
                    Seamless grid banner sliced with SliceMyBanner ✨
                  </p>
                  <p className="text-[#74B4DA] font-semibold">canva.com/your-design</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold">
                  <button
                    className={`py-1.5 rounded-lg border border-[#EBEBEB] transition-colors ${
                      isDark ? 'bg-white/10 text-white' : 'bg-[#EBEBEB] text-[#10367D]'
                    }`}
                  >
                    Edit profile
                  </button>
                  <button
                    className={`py-1.5 rounded-lg border border-[#EBEBEB] transition-colors ${
                      isDark ? 'bg-white/10 text-white' : 'bg-[#EBEBEB] text-[#10367D]'
                    }`}
                  >
                    Share profile
                  </button>
                </div>

                {/* Tab Icons */}
                <div className="flex items-center justify-around border-t border-[#EBEBEB] pt-2 text-xs">
                  <button
                    onClick={() => setSimulatorTab('grid')}
                    className={`flex-1 py-1.5 flex justify-center border-b-2 transition-colors cursor-pointer ${
                      simulatorTab === 'grid'
                        ? 'border-[#10367D] text-[#10367D] dark:border-white dark:text-white font-bold'
                        : 'border-transparent text-[#10367D]/50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorTab('reels')}
                    className={`flex-1 py-1.5 flex justify-center border-b-2 transition-colors cursor-pointer ${
                      simulatorTab === 'reels'
                        ? 'border-[#10367D] text-[#10367D] dark:border-white dark:text-white font-bold'
                        : 'border-transparent text-[#10367D]/50'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                  </button>
                  <button
                    className="flex-1 py-1.5 flex justify-center border-b-2 border-transparent text-[#10367D]/50"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PROFILE GRID VIEW */}
            {simulatorTab === 'grid' && (
              <div
                className="grid grid-cols-3 w-full"
                style={{ gap: `${Math.max(1, config.seamGap)}px` }}
              >
                {slices.map((slice) => {
                  return (
                    <div
                      key={slice.id}
                      className="relative w-full aspect-square bg-[#EBEBEB] overflow-hidden"
                    >
                      <img
                        src={slice.dataUrl}
                        alt="Profile Grid Tile"
                        className="w-full h-full object-cover"
                      />

                      {isReel && (
                        <div className="absolute top-1.5 right-1.5">
                          <Film className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: REELS TAB VIEW */}
            {simulatorTab === 'reels' && (
              <div className="grid grid-cols-3 w-full gap-1 p-1">
                {slices.map((slice, idx) => {
                  return (
                    <div
                      key={slice.id}
                      className="relative w-full aspect-[9/16] bg-[#EBEBEB] overflow-hidden rounded"
                    >
                      <img
                        src={slice.dataUrl}
                        alt="Reels Tab Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-number">
                        <Film className="w-3 h-3" />
                        <span>{(14.2 + idx * 6.5).toFixed(1)}K</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: SINGLE POST FEED VIEW */}
            {simulatorTab === 'feed' && (
              <div className="flex flex-col flex-1">
                {/* Slice selector slider */}
                <div className="p-2 border-b border-[#EBEBEB] flex items-center justify-between text-xs bg-white">
                  <span className="text-xs text-[#10367D]/75 font-semibold font-number">
                    Post #{selectedFeedSlice + 1} of {slices.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {slices.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFeedSlice(idx)}
                        className={`w-6 h-6 rounded-full text-xs font-number font-semibold cursor-pointer ${
                          selectedFeedSlice === idx
                            ? 'bg-[#74B4DA] text-[#10367D] font-bold'
                            : 'bg-white text-[#10367D]/75 hover:bg-[#EBEBEB]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feed Item */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#10367D] to-[#74B4DA] p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold">
                        ✂️
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">your_creative_handle</p>
                      <p className="text-xs text-[#10367D]/70 leading-none mt-0.5">Original Audio</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-[#10367D]/50" />
                </div>

                {/* Feed Photo Display */}
                <div
                  className="w-full bg-[#EBEBEB] overflow-hidden"
                  style={{
                    aspectRatio: isReel ? '9 / 16' : '4 / 5',
                  }}
                >
                  <img
                    src={slices[selectedFeedSlice]?.dataUrl}
                    alt="Single Post Feed Display"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Feed Action Buttons */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-[#74B4DA] fill-[#74B4DA]" />
                      <MessageCircle className="w-5 h-5" />
                      <Send className="w-5 h-5 -rotate-12" />
                    </div>
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold font-number">2,419 likes</p>
                  <p className="text-xs leading-relaxed text-[#10367D]/80">
                    <span className="font-bold mr-1.5 text-[#10367D]">your_creative_handle</span>
                    Part <span className="font-number font-semibold">#{selectedFeedSlice + 1}</span> of my seamless Instagram banner! Sliced with SliceMyBanner ✂️
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
