import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileImage,
  RefreshCw,
} from 'lucide-react';
import type { GridFormat, UploadedImageInfo } from '../types';
import { calculateDimensions } from '../utils/dimensions';

interface ImageUploaderProps {
  format: GridFormat;
  rows: number;
  uploadedImage: UploadedImageInfo | null;
  onImageSelected: (info: UploadedImageInfo, img: HTMLImageElement) => void;
  onGenerateDemo: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  format,
  rows,
  uploadedImage,
  onImageSelected,
  onGenerateDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dims = calculateDimensions(format, rows);
  const expectedRatio = dims.width / dims.height;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const info: UploadedImageInfo = {
          file,
          dataUrl,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height),
          name: file.name,
          size: file.size,
        };
        onImageSelected(info, img);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  let ratioMatch = false;
  let ratioDiffPercent = 0;
  if (uploadedImage) {
    ratioDiffPercent = Math.abs(uploadedImage.aspectRatio - expectedRatio) / expectedRatio;
    ratioMatch = ratioDiffPercent < 0.05;
  }

  return (
    <div className="space-y-6">
      {/* Step Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-7 h-7 rounded-full bg-[#EF5F18] text-white font-bold font-number text-xs flex items-center justify-center border border-[#EF5F18]">
              2
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#261A66] tracking-tight">
              Upload Your Canva Banner
            </h2>
          </div>
          <p className="text-sm text-[#261A66]/75 font-medium">
            Drop the full banner you exported from Canva to slice it into pieces.
          </p>
        </div>

        {/* Try Demo Button */}
        <button
          onClick={onGenerateDemo}
          className="btn-white text-xs py-2 px-3.5 self-start sm:self-auto"
          title="Try slicing immediately with demo art"
        >
          <Sparkles className="w-4 h-4 text-[#261A66] shrink-0" />
          <span className="hidden sm:inline">Load Demo Artwork (1-Click Test)</span>
          <span className="sm:hidden">Try Demo Art</span>
        </button>
      </div>

      {/* DROP ZONE TILE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-12 text-center rounded-3xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
          isDragging
            ? 'bg-[#E6E4EC]/50 border-2 border-dashed border-[#261A66] scale-[1.005]'
            : uploadedImage
            ? 'bg-white border border-[#E6E4EC] shadow-xs'
            : 'bg-gradient-to-b from-[#E6E4EC] to-white border-2 border-dashed border-[#E6E4EC] hover:border-[#261A66] hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {uploadedImage ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#EF5F18] border border-[#EF5F18] flex items-center justify-center text-[#261A66] shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <p className="font-extrabold text-lg text-[#261A66] truncate max-w-md">
                {uploadedImage.name}
              </p>
              <p className="text-xs font-number text-[#261A66]/75 font-medium">
                Resolution: {uploadedImage.width} × {uploadedImage.height} px • {(uploadedImage.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            {/* Aspect Ratio Validation Status */}
            <div className="flex items-center gap-2 pt-1">
              {ratioMatch ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EF5F18] text-[#261A66] border border-[#EF5F18] text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#261A66]" />
                  <span>Aspect ratio matches ({format.name} • <span className="font-number">{rows}</span> rows)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E4EC] text-[#261A66] border border-[#E6E4EC] text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>
                    Aspect mismatch (<span className="font-number">{(ratioDiffPercent * 100).toFixed(0)}%</span> diff). Will fit nicely.
                  </span>
                </div>
              )}
            </div>

            {/* Change Image Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="btn-white text-xs py-2 px-4"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#261A66]/75" />
                <span>Replace Image</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#E6E4EC] border border-[#E6E4EC] flex items-center justify-center text-[#261A66] mx-auto shadow-xs">
              <UploadCloud className="w-8 h-8 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-lg text-[#261A66] tracking-tight">
                Drag and drop your Canva banner here
              </p>
              <p className="text-xs text-[#261A66]/75 font-medium">
                Supports PNG, JPG, or WEBP up to 50MB (processed 100% locally in your browser)
              </p>
            </div>

            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                type="button"
                className="btn-primary text-xs py-2.5 px-5"
              >
                <FileImage className="w-4 h-4" />
                <span>Browse Files</span>
              </button>
            </div>

            <div className="pt-3 border-t border-[#E6E4EC] text-xs text-[#261A66]/75 font-medium flex items-center justify-center gap-2">
              <span>Expected size:</span>
              <strong className="text-[#261A66] font-number font-bold">
                {dims.width} × {dims.height} px
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
