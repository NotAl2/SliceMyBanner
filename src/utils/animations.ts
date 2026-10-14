import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScrolling(): () => void {
  if (typeof window === 'undefined') return () => {};

  // Smooth scroll intercept for all internal anchors (#step-calculator, etc.)
  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      smoothScrollTo(href);
    }
  };

  document.addEventListener('click', handleAnchorClick);
  ScrollTrigger.refresh();

  return () => {
    document.removeEventListener('click', handleAnchorClick);
  };
}

export function smoothScrollTo(target: string | HTMLElement, offset: number = -80) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const targetY = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth',
    });
  }
}

export function initScrollRevealAnimations() {
  const sections = document.querySelectorAll('main > section');
  sections.forEach((section) => {
    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 28,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

export function animateSlicesIn(containerSelector: string) {
  const tiles = document.querySelectorAll(`${containerSelector} .slice-tile`);
  if (!tiles.length) return;

  gsap.fromTo(
    tiles,
    {
      opacity: 0,
      scale: 0.92,
      y: 16,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.45,
      stagger: 0.04,
      ease: 'power2.out',
    }
  );
}

export function animateDimensionsChange(elementSelector: string) {
  const el = document.querySelector(elementSelector);
  if (!el) return;

  gsap.fromTo(
    el,
    { scale: 0.97, opacity: 0.8 },
    { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
  );
}

export function triggerConfetti() {
  confetti({
    particleCount: 75,
    spread: 55,
    origin: { y: 0.82 },
    colors: ['#10367D', '#74B4DA', '#EBEBEB', '#000000', '#F8F9FA'],
  });
}
