import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GridConfigurator } from './components/GridConfigurator';
import { CanvaGuideModal } from './components/CanvaGuideModal';
import { DonateModal } from './components/DonateModal';
import { ImageUploader } from './components/ImageUploader';
import { SlicerPreview } from './components/SlicerPreview';
import { InstagramSimulator } from './components/InstagramSimulator';
import { ExportPanel } from './components/ExportPanel';
import { Toast } from './components/Toast';
import { Logo } from './components/Logo';
import type { GridFormat, GridConfig, UploadedImageInfo, SliceItem } from './types';
import { GRID_FORMATS } from './utils/dimensions';
import { sliceBannerImage } from './utils/imageSlicer';
import { generateDemoBanner } from './utils/demoGenerator';
import {
  initSmoothScrolling,
  initScrollRevealAnimations,
  smoothScrollTo,
  animateSlicesIn,
  triggerConfetti,
} from './utils/animations';
import { ArrowRight, Play, CheckCircle2, Coffee } from 'lucide-react';

export function App() {
  const [format, setFormat] = useState<GridFormat>(GRID_FORMATS.square);
  const [rows, setRows] = useState<number>(1);
  const [config, setConfig] = useState<GridConfig>({
    cols: 3,
    rows: 1,
    format: GRID_FORMATS.square,
    seamGap: 2,
    showSafeZone: true,
    showPostingOrder: true,
    edgeCropProtection: false,
  });

  const [uploadedImage, setUploadedImage] = useState<UploadedImageInfo | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [slices, setSlices] = useState<SliceItem[]>([]);
  const [isSlicing, setIsSlicing] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isImageDonePopup, setIsImageDonePopup] = useState<boolean>(false);
  const [hasShownDonateAfterSlice, setHasShownDonateAfterSlice] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize smooth momentum scrolling & scroll-triggered entrance animations
  useEffect(() => {
    const cleanup = initSmoothScrolling();
    const timer = setTimeout(() => {
      initScrollRevealAnimations();
    }, 120);

    return () => {
      cleanup();
      clearTimeout(timer);
    };
  }, []);

  // Sync format and rows to config
  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      rows,
      format,
    }));
  }, [format, rows]);

  // Re-slice when image exists and format/rows change
  useEffect(() => {
    if (imgElement && uploadedImage) {
      handleSliceImage(imgElement);
    }
  }, [format, rows]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleSliceImage = async (img: HTMLImageElement, isInitialUpload = false) => {
    try {
      setIsSlicing(true);
      const newSlices = await sliceBannerImage(img, {
        rows,
        format,
        exportFormat: 'image/png',
      });
      setSlices(newSlices);

      setTimeout(() => {
        animateSlicesIn('#slices-container');
        smoothScrollTo('#slices-container', -60);
      }, 100);

      // Trigger Buy Me a Coffee popup after image is done slicing (if not shown yet in this session)
      if (isInitialUpload && !hasShownDonateAfterSlice) {
        setHasShownDonateAfterSlice(true);
        setTimeout(() => {
          setIsImageDonePopup(true);
          setIsDonateOpen(true);
        }, 1300);
      }
    } catch (err) {
      console.error('Slicing error:', err);
      showToast('Error slicing image. Please check image format.');
    } finally {
      setIsSlicing(false);
    }
  };

  const handleImageSelected = (info: UploadedImageInfo, img: HTMLImageElement) => {
    setUploadedImage(info);
    setImgElement(img);
    handleSliceImage(img, true);
    showToast(`Loaded ${info.name}!`);
  };

  const handleGenerateDemo = async () => {
    showToast('Generating demo artwork...');
    const demo = await generateDemoBanner(format, rows);
    setUploadedImage({
      name: `demo_artwork_${format.id}_${rows}row.png`,
      size: 1024 * 720,
      width: demo.imgElement.width,
      height: demo.imgElement.height,
      aspectRatio: demo.imgElement.width / demo.imgElement.height,
      file: demo.file,
      dataUrl: demo.dataUrl,
    });
    setImgElement(demo.imgElement);
    await handleSliceImage(demo.imgElement, true);
    triggerConfetti();
    showToast('Demo artwork loaded and sliced!');
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImgElement(null);
    setSlices([]);
    showToast('Reset back to step 1.');
    smoothScrollTo('#step-calculator', -80);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6E4EC] text-[#261A66] selection:bg-[#261A66] selection:text-white">
      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDonate={() => {
          setIsImageDonePopup(false);
          setIsDonateOpen(true);
        }}
        onReset={handleReset}
        hasUploadedImage={!!uploadedImage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
        {/* HERO SECTION — WW/Studio Canvas + Mist + Cornflower + Pear theme */}
        <section className="hero-gradient-card p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E6E4EC]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content with Step Line */}
            <div className="lg:col-span-8 flex gap-5 sm:gap-8">
              {/* Vertical Step Line Indicator */}
              <div className="hidden sm:flex flex-col items-center pt-2 select-none shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#EF5F18] border border-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center shadow-xs">
                  1
                </div>
                <div className="w-[1.5px] h-14 bg-gradient-to-b from-[#261A66] via-[#EF5F18] to-[#E6E4EC] my-1.5" />
                <div className="w-7 h-7 rounded-full bg-white border border-[#E6E4EC] text-[#261A66]/70 font-semibold font-number text-xs flex items-center justify-center">
                  2
                </div>
                <div className="w-[1.5px] h-14 bg-[#E6E4EC] my-1.5" />
                <div className="w-7 h-7 rounded-full bg-white border border-[#E6E4EC] text-[#261A66]/70 font-semibold font-number text-xs flex items-center justify-center">
                  3
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF5F18] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>Experience The Magic Of Flawless Grids</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#261A66] leading-tight">
                  Free Instagram Grid & Reel Cover Slicer for Canva
                </h1>

                <p className="text-xs sm:text-sm text-[#261A66]/75 font-normal leading-relaxed max-w-xl">
                  Get exact Canva dimensions for multi-post puzzle banners and Reel covers. Slice your design into high-resolution parts, account for Instagram crop quirks, and post in reverse order seamlessly.
                </p>

                {/* Call-to-action pills */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="#step-calculator"
                    className="btn-primary text-xs sm:text-sm py-2.5 px-5"
                  >
                    <span>Get Canva Dimensions</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    onClick={handleGenerateDemo}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white text-[#261A66] text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md border border-[#E6E4EC] hover:border-[#EF5F18] transition-all cursor-pointer"
                    title="Load ready-made demo artwork"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#F5F4F8] text-[#261A66] flex items-center justify-center">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span>Try Demo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Visual Stats Column — hidden on mobile to save space */}
            <div className="hidden lg:flex lg:col-span-4 flex-col justify-center gap-3">
              <div className="border-l-2 border-[#261A66]/25 pl-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#261A66]/80 uppercase tracking-wider">
                    Live Blueprint
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EF5F18] text-white">
                    {format.name} ({format.ratioLabel})
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-extrabold text-[#261A66] font-number tracking-tight">
                  3240 <span className="text-[#261A66]/50 font-light">×</span> {rows * format.tileHeight}{' '}
                  <span className="text-xs font-semibold text-[#261A66]/70 tracking-normal uppercase ml-1">
                    px
                  </span>
                </div>

                <p className="text-xs text-[#261A66]/75 font-medium">
                  Configured for <strong className="font-number font-bold text-[#261A66]">{rows * 3}</strong> tiles with center safe-box protection.
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#261A66]/80 font-medium pt-2 border-t border-[#E6E4EC]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#261A66] shrink-0" />
                  <span>Exact 3-column split with 0px loss</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#261A66] shrink-0" />
                  <span>Accounts for 420px Reel grid crops</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#261A66] shrink-0" />
                  <span>Reverse posting sequence generator</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compatibility Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-7 gap-y-2 text-xs font-semibold text-[#261A66]/75 py-1.5 border-b border-[#E6E4EC]">
          <span className="uppercase tracking-wider text-xs text-[#261A66] font-bold w-full sm:w-auto text-center">Compatible With:</span>
          <span className="hover:text-[#261A66] transition-colors">Canva Custom Sizes</span>
          <span className="hidden sm:inline text-[#EF5F18]">•</span>
          <span className="hover:text-[#261A66] transition-colors">Instagram 1:1 Squares</span>
          <span className="hidden sm:inline text-[#EF5F18]">•</span>
          <span className="hover:text-[#261A66] transition-colors">4:5 Portrait Feeds</span>
          <span className="hidden sm:inline text-[#EF5F18]">•</span>
          <span className="hover:text-[#261A66] transition-colors">9:16 Reel Cover Banners</span>
        </div>

        {/* STEP 1: PICK FORMAT & SIZE */}
        <section className="scroll-mt-24" id="step-calculator">
          <GridConfigurator
            selectedFormat={format}
            onFormatChange={setFormat}
            rows={rows}
            onRowsChange={setRows}
            onCopyText={(text, label) => showToast(`Copied ${label} (${text})!`)}
            onOpenCanvaGuide={() => setIsGuideOpen(true)}
          />
        </section>

        {/* STEP 2: UPLOAD CANVA BANNER */}
        <section className="scroll-mt-24" id="step-uploader">
          <ImageUploader
            format={format}
            rows={rows}
            uploadedImage={uploadedImage}
            onImageSelected={handleImageSelected}
            onGenerateDemo={handleGenerateDemo}
          />
        </section>

        {/* STEP 3 & 4: SLICES, SIMULATOR & EXPORT */}
        {isSlicing && (
          <div className="flex items-center justify-center gap-3 p-8 bg-[#E6E4EC]/30 border border-[#E6E4EC] rounded-3xl shadow-xs">
            <div className="w-5 h-5 border-2 border-[#261A66] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-[#261A66]">
              Slicing your banner into high-resolution parts...
            </span>
          </div>
        )}

        {slices.length > 0 && (
          <div id="slices-container" className="space-y-12 animate-in fade-in duration-300">
            {/* Interactive Slicer Preview */}
            <section id="step-slices">
              <SlicerPreview
                slices={slices}
                config={config}
                onUpdateConfig={(partial) => setConfig((prev) => ({ ...prev, ...partial }))}
                onToast={showToast}
              />
            </section>

            {/* Live Instagram Smartphone Simulator */}
            <section id="step-simulator">
              <InstagramSimulator slices={slices} config={config} />
            </section>

            {/* Export & Download ZIP */}
            <section id="step-export">
              <ExportPanel
                slices={slices}
                config={config}
                onToast={showToast}
                onOpenDonate={() => {
                  setIsImageDonePopup(false);
                  setIsDonateOpen(true);
                }}
                onDownloadDone={() => {
                  setTimeout(() => {
                    setIsImageDonePopup(true);
                    setIsDonateOpen(true);
                  }, 600);
                }}
              />
            </section>
          </div>
        )}

        {/* SEO SECTION 1: CANVA SIZING BLUEPRINT REFERENCE TABLE */}
        <section
          id="canva-dimensions"
          className="scroll-mt-24 bg-white rounded-3xl border border-[#E6E4EC] p-6 sm:p-10 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4EC] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#261A66]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#261A66]/70">
                  Cheat Sheet & Reference
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#261A66] tracking-tight">
                Canva Sizing Blueprint for Instagram Grids & Banners
              </h2>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="btn-white text-xs py-2 px-4 self-start sm:self-auto cursor-pointer"
            >
              Open Full Guide
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#261A66]/75 leading-relaxed max-w-3xl">
            When creating multi-post panoramic grids or seamless puzzle feeds in Canva, set your canvas to these exact pixel dimensions. Each banner spans 3 horizontal columns across your Instagram profile grid:
          </p>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-[#E6E4EC] text-[#261A66] font-extrabold text-xs uppercase tracking-wider bg-[#E6E4EC]">
                  <th className="py-3 px-4 rounded-l-xl">Grid Format</th>
                  <th className="py-3 px-3">Rows</th>
                  <th className="py-3 px-3">Posts</th>
                  <th className="py-3 px-4">Canva Custom Size</th>
                  <th className="py-3 px-4">Tile Size</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E4EC]/60">
                <tr className="hover:bg-[#E6E4EC]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#261A66]">1:1 Square Grid (3×1)</td>
                  <td className="py-3.5 px-3 text-[#261A66]/75 font-number">1 Row</td>
                  <td className="py-3.5 px-3 font-semibold text-[#261A66] font-number">3 posts</td>
                  <td className="py-3.5 px-4 font-extrabold font-number text-[#261A66]">3240 × 1080 px</td>
                  <td className="py-3.5 px-4 text-[#261A66]/75 font-number">1080 × 1080 px</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('3240 x 1080');
                        showToast('Copied Canva size (3240 × 1080 px)!');
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E6E4EC] hover:bg-[#261A66] hover:text-white transition-colors cursor-pointer"
                      title="Copy Canva custom size"
                    >
                      Copy Size
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#E6E4EC]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#261A66]">1:1 Square Grid (3×2)</td>
                  <td className="py-3.5 px-3 text-[#261A66]/75 font-number">2 Rows</td>
                  <td className="py-3.5 px-3 font-semibold text-[#261A66] font-number">6 posts</td>
                  <td className="py-3.5 px-4 font-extrabold font-number text-[#261A66]">3240 × 2160 px</td>
                  <td className="py-3.5 px-4 text-[#261A66]/75 font-number">1080 × 1080 px</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('3240 x 2160');
                        showToast('Copied Canva size (3240 × 2160 px)!');
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E6E4EC] hover:bg-[#261A66] hover:text-white transition-colors cursor-pointer"
                    >
                      Copy Size
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#E6E4EC]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#261A66]">1:1 Square Grid (3×3)</td>
                  <td className="py-3.5 px-3 text-[#261A66]/75 font-number">3 Rows</td>
                  <td className="py-3.5 px-3 font-semibold text-[#261A66] font-number">9 posts</td>
                  <td className="py-3.5 px-4 font-extrabold font-number text-[#261A66]">3240 × 3240 px</td>
                  <td className="py-3.5 px-4 text-[#261A66]/75 font-number">1080 × 1080 px</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('3240 x 3240');
                        showToast('Copied Canva size (3240 × 3240 px)!');
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E6E4EC] hover:bg-[#261A66] hover:text-white transition-colors cursor-pointer"
                    >
                      Copy Size
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#E6E4EC]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#261A66]">4:5 Portrait Feed (3×1)</td>
                  <td className="py-3.5 px-3 text-[#261A66]/75 font-number">1 Row</td>
                  <td className="py-3.5 px-3 font-semibold text-[#261A66] font-number">3 posts</td>
                  <td className="py-3.5 px-4 font-extrabold font-number text-[#261A66]">3240 × 1350 px</td>
                  <td className="py-3.5 px-4 text-[#261A66]/75 font-number">1080 × 1350 px</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('3240 x 1350');
                        showToast('Copied Canva size (3240 × 1350 px)!');
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E6E4EC] hover:bg-[#261A66] hover:text-white transition-colors cursor-pointer"
                    >
                      Copy Size
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#E6E4EC]/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#261A66]">9:16 Reel Cover Banner (3×1)</td>
                  <td className="py-3.5 px-3 text-[#261A66]/75 font-number">1 Row</td>
                  <td className="py-3.5 px-3 font-semibold text-[#261A66] font-number">3 covers</td>
                  <td className="py-3.5 px-4 font-extrabold font-number text-[#261A66]">3240 × 1920 px</td>
                  <td className="py-3.5 px-4 text-[#261A66]/75 font-number">1080 × 1920 px</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('3240 x 1920');
                        showToast('Copied Canva size (3240 × 1920 px)!');
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#E6E4EC] hover:bg-[#261A66] hover:text-white transition-colors cursor-pointer"
                    >
                      Copy Size
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SEO SECTION 2: FREQUENTLY ASKED QUESTIONS */}
        <section
          id="faq"
          className="scroll-mt-24 bg-white rounded-3xl border border-[#E6E4EC] p-6 sm:p-10 shadow-xs space-y-6"
        >
          <div className="border-b border-[#E6E4EC] pb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF5F18]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#261A66]/70">
                Common Questions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#261A66] tracking-tight">
              Frequently Asked Questions About Instagram Grid Slicing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#E6E4EC] border border-[#E6E4EC] space-y-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#261A66]">
                How do I split a Canva banner into an Instagram 3-post grid?
              </h3>
              <p className="text-xs sm:text-sm text-[#261A66]/75 leading-relaxed">
                Create a custom size canvas in Canva sized <strong>3240 × 1080 px</strong> (for 1:1 squares) or <strong>3240 × 1350 px</strong> (for 4:5 portrait feeds). Design your artwork across the entire banner, download as a high-quality PNG, and upload it into SliceMyBanner to split it into 3 equal 1080px columns.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#E6E4EC] border border-[#E6E4EC] space-y-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#261A66]">
                Why do I need to post Instagram grid slices in reverse order?
              </h3>
              <p className="text-xs sm:text-sm text-[#261A66]/75 leading-relaxed">
                Instagram automatically places your newest post at the top-left of your profile, pushing previous posts to the right. To make your banner read left-to-right, upload the bottom-right tile first (e.g. <code className="bg-[#E6E4EC] px-1.5 py-0.5 rounded text-[11px] font-mono">tile_03.png</code>) and the top-left tile last (e.g. <code className="bg-[#E6E4EC] px-1.5 py-0.5 rounded text-[11px] font-mono">tile_01.png</code>).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#E6E4EC] border border-[#E6E4EC] space-y-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#261A66]">
                How does SliceMyBanner protect my image privacy?
              </h3>
              <p className="text-xs sm:text-sm text-[#261A66]/75 leading-relaxed">
                SliceMyBanner operates 100% client-side in your browser using the HTML5 Canvas API. Your pictures are never uploaded to any remote server or stored in the cloud. It's completely private and safe.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#E6E4EC] border border-[#E6E4EC] space-y-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#261A66]">
                Can I use SliceMyBanner for 9:16 Instagram Reel cover banners?
              </h3>
              <p className="text-xs sm:text-sm text-[#261A66]/75 leading-relaxed">
                Yes! When creating 3 Reel covers side-by-side, set Canva to <strong>3240 × 1920 px</strong>. SliceMyBanner includes safe-zone overlays so your key text remains centered when Instagram crops the cover to 1:1 on your profile feed and 4:5 in the Reels tab.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6E4EC] bg-white py-10 text-xs text-[#261A66]/75 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#E6E4EC] border border-[#E6E4EC] flex items-center justify-center p-1 shrink-0">
              <Logo variant="theme" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-base text-[#261A66]">
              Slice<span className="text-[#EF5F18]">My</span>Banner
            </span>
            <span className="hidden md:inline text-[#261A66]/70">— The simple Canva Instagram grid & reel slicer</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#261A66]">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-[#EF5F18] transition-colors cursor-pointer"
            >
              Canva Sizing Guide
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setIsImageDonePopup(false);
                setIsDonateOpen(true);
              }}
              className="hover:text-[#EF5F18] transition-colors cursor-pointer flex items-center gap-1 text-[#EF5F18]"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Buy Me a Coffee</span>
            </button>
            <span>•</span>
            <span className="text-[#261A66] font-number font-semibold">100% Free & Private</span>
          </div>
        </div>
      </footer>

      {/* Canva Guide Modal */}
      <CanvaGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        format={format}
        rows={rows}
        onCopyText={(text, label) => showToast(`Copied ${label} (${text})!`)}
      />

      {/* Buy Me a Coffee Donate Modal */}
      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        isImageDone={isImageDonePopup}
        onDonated={() => {
          showToast('Thank you so much for your support! ☕💖');
          setIsDonateOpen(false);
        }}
      />

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}

export default App;
