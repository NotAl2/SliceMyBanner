import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-[#10367D] text-white px-4 py-3 rounded-full shadow-[0_12px_32px_rgba(16,54,125,0.25)] border border-[#EBEBEB]/20 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-[#74B4DA] text-[#10367D] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
        </div>
        <p className="text-xs font-semibold text-white pr-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 text-white/80 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
