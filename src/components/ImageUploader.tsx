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
            <span className="w-7 h-7 rounded-full bg-[#74B4DA] text-black font-bold font-number text-xs flex items-center justify-center border border-[#5fa7cf]">
              2
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
              Upload Your Canva Banner
            </h2>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            Drop the full banner you exported from Canva to slice it into pieces.
          </p>
        </div>

        {/* Try Demo Button */}
        <button
          onClick={onGenerateDemo}
          className="btn-white text-xs py-2 px-3.5 self-start sm:self-auto"
          title="Try slicing immediately with demo art"
        >
          <Sparkles className="w-4 h-4 text-black shrink-0" />
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
            ? 'bg-[#EBEBEB]/50 border-2 border-dashed border-[#10367D] scale-[1.005]'
            : uploadedImage
            ? 'bg-white border border-[#EBEBEB] shadow-xs'
            : 'bg-gradient-to-b from-[#F8F9FA] to-white border-2 border-dashed border-[#EBEBEB] hover:border-[#10367D] hover:shadow-md'
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
            <div className="w-16 h-16 rounded-full bg-[#74B4DA] border border-[#5fa7cf] flex items-center justify-center text-black shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <p className="font-extrabold text-lg text-black truncate max-w-md">
                {uploadedImage.name}
              </p>
              <p className="text-xs font-number text-slate-600 font-medium">
                Resolution: {uploadedImage.width} × {uploadedImage.height} px • {(uploadedImage.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            {/* Aspect Ratio Validation Status */}
            <div className="flex items-center gap-2 pt-1">
              {ratioMatch ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#74B4DA] text-black border border-[#5fa7cf] text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                  <span>Aspect ratio matches ({format.name} • <span className="font-number">{rows}</span> rows)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBEBEB] text-black border border-[#d8d8d8] text-xs font-semibold">
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
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                <span>Replace Image</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EBEBEB] border border-[#EBEBEB] flex items-center justify-center text-black mx-auto shadow-xs">
              <UploadCloud className="w-8 h-8 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-lg text-black tracking-tight">
                Drag and drop your Canva banner here
              </p>
              <p className="text-xs text-slate-600 font-medium">
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

            <div className="pt-3 border-t border-[#EBEBEB] text-xs text-slate-600 font-medium flex items-center justify-center gap-2">
              <span>Expected size:</span>
              <strong className="text-black font-number font-bold">
                {dims.width} × {dims.height} px
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
