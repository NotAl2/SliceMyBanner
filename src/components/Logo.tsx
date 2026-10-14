import React from 'react';

export interface LogoProps {
  className?: string;
  variant?: 'theme' | 'original' | 'black';
  withBadge?: boolean;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = 'w-6 h-6',
  variant = 'theme',
  withBadge = false,
  alt = 'SliceMyBanner Scissor-Hand Logo',
}) => {
  const src =
    variant === 'original'
      ? '/logo-original.png'
      : variant === 'black'
      ? '/logo-black.png'
      : '/logo-theme.png';

  const img = (
    <img
      src={src}
      alt={alt}
      className={`object-contain select-none pointer-events-none ${className}`}
      draggable={false}
      loading="eager"
    />
  );

  if (withBadge) {
    return (
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#DBE3E9] border border-[#c4d0dc] flex items-center justify-center p-1.5 shadow-xs transition-transform hover:scale-105 shrink-0">
        {img}
      </div>
    );
  }

  return img;
};

export default Logo;
