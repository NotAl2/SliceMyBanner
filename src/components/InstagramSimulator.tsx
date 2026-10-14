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
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] text-[#261A66] font-bold font-number text-xs flex items-center justify-center border border-[#EF5F18]">
              3
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#261A66] tracking-tight">
              Live Profile Simulator
            </h2>
          </div>
          <p className="text-sm text-[#261A66]/75 font-medium">
            See exactly how your banner looks on a smartphone Instagram profile before uploading!
          </p>
        </div>

        {/* Simulator controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Tab selector */}
          <div className="flex items-center bg-[#E6E4EC]/50 p-1 rounded-full border border-[#E6E4EC] text-xs">
            <button
              onClick={() => setSimulatorTab('grid')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                simulatorTab === 'grid'
                  ? 'bg-[#261A66] text-white shadow-xs'
                  : 'text-[#261A66]/80 hover:text-[#261A66]'
              }`}
            >
              <Grid className={`w-3.5 h-3.5 ${simulatorTab === 'grid' ? 'text-[#EF5F18]' : 'text-[#261A66]'}`} />
              <span className="hidden sm:inline">Profile Grid</span>
              <span className="sm:hidden">Grid</span>
            </button>

            {isReel && (
              <button
                onClick={() => setSimulatorTab('reels')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  simulatorTab === 'reels'
                    ? 'bg-[#261A66] text-white shadow-xs'
                    : 'text-[#261A66]/80 hover:text-[#261A66]'
                }`}
              >
                <Film className={`w-3.5 h-3.5 ${simulatorTab === 'reels' ? 'text-[#EF5F18]' : 'text-[#261A66]'}`} />
                <span className="hidden sm:inline">Reels Tab</span>
                <span className="sm:hidden">Reels</span>
              </button>
            )}

            <button
              onClick={() => setSimulatorTab('feed')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                simulatorTab === 'feed'
                  ? 'bg-[#261A66] text-white shadow-xs'
                  : 'text-[#261A66]/80 hover:text-[#261A66]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${simulatorTab === 'feed' ? 'text-[#EF5F18]' : 'text-[#EF5F18]'}`} />
              <span className="hidden sm:inline">Feed Post</span>
              <span className="sm:hidden">Feed</span>
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-full bg-white hover:bg-[#E6E4EC] text-[#261A66] border border-[#E6E4EC] shadow-xs transition-colors cursor-pointer"
            title="Toggle Phone Dark/Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#EF5F18]" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Smartphone Mockup */}
      <div className="flex justify-center py-2 px-1">
        <div className="w-full max-w-[340px] sm:max-w-[380px] rounded-[38px] sm:rounded-[48px] p-2.5 sm:p-3 bg-[#261A66] shadow-[0_25px_60px_-15px_rgba(38, 26, 102,0.2)] border-2 sm:border-4 border-[#261A66] transition-colors relative">
          {/* Phone Shell */}
          <div
            className={`w-full rounded-[30px] sm:rounded-[38px] overflow-hidden flex flex-col transition-colors ${
              isDark ? 'bg-[#261A66] text-white' : 'bg-white text-[#261A66]'
            }`}
            style={{ minHeight: '620px' }}
          >
            {/* Phone Status Bar */}
            <div className="px-6 pt-3 pb-1.5 flex items-center justify-between text-xs font-semibold tracking-tight">
              <span className="font-number">9:41</span>
              <div className="w-20 h-4 bg-[#261A66] rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-number">5G</span>
                <div className="w-4 h-2 border border-current rounded-xs p-0.5">
                  <div className="w-full h-full bg-current rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Instagram App Top Bar */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-[#E6E4EC]">
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
                    <div className="w-18 h-18 rounded-full p-0.5 bg-gradient-to-tr from-[#261A66] via-[#EF5F18] to-[#261A66]">
                      <div className="w-full h-full rounded-full bg-[#E6E4EC] flex items-center justify-center p-2 border-2 border-white shadow-xs overflow-hidden">
                        <Logo variant="theme" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-center text-xs">
                    <div>
                      <span className="block font-bold font-number text-sm">{slices.length}</span>
                      <span className="text-xs text-[#261A66]/70">posts</span>
                    </div>
                    <div>
                      <span className="block font-bold font-number text-sm">34.2K</span>
                      <span className="text-xs text-[#261A66]/70">followers</span>
                    </div>
                    <div>
                      <span className="block font-bold font-number text-sm">412</span>
                      <span className="text-xs text-[#261A66]/70">following</span>
                    </div>
                  </div>
                </div>

                {/* Name & Bio */}
                <div className="text-xs space-y-0.5">
                  <p className="font-bold">Creative Director • Studio</p>
                  <p className="text-[#261A66]/75 dark:text-[#261A66]/50">
                    Seamless grid banner sliced with SliceMyBanner ✨
                  </p>
                  <p className="text-[#EF5F18] font-semibold">canva.com/your-design</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold">
                  <button
                    className={`py-1.5 rounded-lg border border-[#E6E4EC] transition-colors ${
                      isDark ? 'bg-white/10 text-white' : 'bg-[#E6E4EC] text-[#261A66]'
                    }`}
                  >
                    Edit profile
                  </button>
                  <button
                    className={`py-1.5 rounded-lg border border-[#E6E4EC] transition-colors ${
                      isDark ? 'bg-white/10 text-white' : 'bg-[#E6E4EC] text-[#261A66]'
                    }`}
                  >
                    Share profile
                  </button>
                </div>

                {/* Tab Icons */}
                <div className="flex items-center justify-around border-t border-[#E6E4EC] pt-2 text-xs">
                  <button
                    onClick={() => setSimulatorTab('grid')}
                    className={`flex-1 py-1.5 flex justify-center border-b-2 transition-colors cursor-pointer ${
                      simulatorTab === 'grid'
                        ? 'border-[#261A66] text-[#261A66] dark:border-white dark:text-white font-bold'
                        : 'border-transparent text-[#261A66]/50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorTab('reels')}
                    className={`flex-1 py-1.5 flex justify-center border-b-2 transition-colors cursor-pointer ${
                      simulatorTab === 'reels'
                        ? 'border-[#261A66] text-[#261A66] dark:border-white dark:text-white font-bold'
                        : 'border-transparent text-[#261A66]/50'
                    }`}
                  >
                    <Film className="w-4 h-4" />
                  </button>
                  <button
                    className="flex-1 py-1.5 flex justify-center border-b-2 border-transparent text-[#261A66]/50"
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
                      className="relative w-full aspect-square bg-[#E6E4EC] overflow-hidden"
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
                      className="relative w-full aspect-[9/16] bg-[#E6E4EC] overflow-hidden rounded"
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
                <div className="p-2 border-b border-[#E6E4EC] flex items-center justify-between text-xs bg-white">
                  <span className="text-xs text-[#261A66]/75 font-semibold font-number">
                    Post #{selectedFeedSlice + 1} of {slices.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {slices.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFeedSlice(idx)}
                        className={`w-6 h-6 rounded-full text-xs font-number font-semibold cursor-pointer ${
                          selectedFeedSlice === idx
                            ? 'bg-[#EF5F18] text-[#261A66] font-bold'
                            : 'bg-white text-[#261A66]/75 hover:bg-[#E6E4EC]'
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#261A66] to-[#EF5F18] p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold">
                        ✂️
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">your_creative_handle</p>
                      <p className="text-xs text-[#261A66]/70 leading-none mt-0.5">Original Audio</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-[#261A66]/50" />
                </div>

                {/* Feed Photo Display */}
                <div
                  className="w-full bg-[#E6E4EC] overflow-hidden"
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
                      <Heart className="w-5 h-5 text-[#EF5F18] fill-[#EF5F18]" />
                      <MessageCircle className="w-5 h-5" />
                      <Send className="w-5 h-5 -rotate-12" />
                    </div>
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold font-number">2,419 likes</p>
                  <p className="text-xs leading-relaxed text-[#261A66]/80">
                    <span className="font-bold mr-1.5 text-[#261A66]">your_creative_handle</span>
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
