import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Utensils, ChevronDown, ArrowRight } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
  isExiting: boolean;
}

export function CoastalSwadaIntro({ onComplete, isExiting }: IntroProps) {
  // Current scene: 1: Sea, 3: Cuisine, 4: Brand Reveal, 5: Transitioning/Exit
  const [scene, setScene] = useState<1 | 3 | 4 | 5>(1);
  const [imagesReady, setImagesReady] = useState(false);
  const [isAwaitingScroll, setIsAwaitingScroll] = useState(false);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const hasTriggeredRef = useRef<boolean>(false);
  const sceneRef = useRef<1 | 3 | 4 | 5>(1);

  const triggerTransition = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    setScene(5);
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Preload both cinematic images with safe timeout fallback
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    let loaded = 0;
    const total = 2;
    const done = () => {
      loaded++;
      if (loaded >= total) setImagesReady(true);
    };

    // Safety timeout: never leave screen frozen in black on slow mobile networks
    const safetyTimer = setTimeout(() => {
      setImagesReady(true);
    }, 1200);

    const seaImg = new Image();
    seaImg.onload = done;
    seaImg.onerror = done;
    seaImg.src = '/cinematic-sea.jpg';
    if (seaImg.complete) done();

    const cuisineImg = new Image();
    cuisineImg.onload = done;
    cuisineImg.onerror = done;
    cuisineImg.src = '/cinematic-cuisine.jpg';
    if (cuisineImg.complete) done();

    return () => clearTimeout(safetyTimer);
  }, [onComplete]);

  // Phase 1: Drive scenes via RAF with safe cancellation
  useEffect(() => {
    if (!imagesReady) return;

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      if (hasTriggeredRef.current) return;

      const elapsed = now - startTimeRef.current;

      let nextScene: 1 | 3 | 4 | 5;
      if (elapsed < 2000) {
        nextScene = 1;
      } else if (elapsed < 3800) {
        nextScene = 3;
      } else {
        // SCENE 4 REACHED: stop loop and wait for user interaction
        setScene(4);
        sceneRef.current = 4;
        setIsAwaitingScroll(true);
        return;
      }

      if (nextScene !== sceneRef.current) {
        sceneRef.current = nextScene;
        setScene(nextScene);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesReady]);

  // Phase 2: Detect user interaction (wheel, swipe, touch tap, keydown)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 4 || Math.abs(e.deltaX) > 8) {
        triggerTransition();
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = Math.abs(touchStartY - touchEndY);
      const deltaX = Math.abs(touchStartX - touchEndX);

      // Any intentional touch gesture or tap when waiting
      if (deltaY > 12 || deltaX > 12 || isAwaitingScroll) {
        triggerTransition();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'Space', 'Enter', 'Escape'].includes(e.code)) {
        triggerTransition();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAwaitingScroll, triggerTransition]);

  return (
    <div
      onClick={triggerTransition}
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#100d0c] text-[#fff5e8] select-none cursor-pointer"
      style={{
        opacity: isExiting || scene === 5 ? 0 : 1,
        transform: isExiting || scene === 5 ? 'scale3d(1.02, 1.02, 1)' : 'scale3d(1, 1, 1)',
        transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isExiting || scene === 5 ? 'none' : 'auto',
        willChange: 'opacity, transform',
      }}
      aria-label="Coastal Swada cinematic introduction"
      role="dialog"
      aria-modal="true"
    >
      {/* TOP RIGHT SKIP BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerTransition();
        }}
        className="absolute top-5 right-5 z-20 flex items-center gap-1.5 rounded-full border border-[#43302a] bg-[#1b1513]/85 hover:bg-[#241a17] backdrop-blur-md px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#fff5e8] hover:text-[#ff8b48] hover:border-[#ff8b48] transition-all shadow-lg active:scale-95"
        aria-label="Skip introduction"
        data-testid="button-skip-intro"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* BACKGROUND SCENES — layers always in DOM, crossfaded by opacity only */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      >
        {/* Scene 1: Arabian Sea */}
        <div
          className="absolute inset-0"
          style={{
            opacity: scene === 1 ? 1 : 0,
            transition: 'opacity 800ms ease-in-out',
            willChange: 'opacity',
          }}
        >
          <img
            src="/cinematic-sea.jpg"
            alt="The Arabian Sea at golden hour along Karnataka coast"
            className="w-full h-full object-cover object-center animate-cinematic-pan"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100d0c]/85 via-transparent to-[#100d0c]/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#100d0c]/60 via-transparent to-[#100d0c]/60" />
        </div>

        {/* Scene 3 & 4: Authentic Karavali Cuisine Feast */}
        <div
          className="absolute inset-0"
          style={{
            opacity: scene >= 3 ? 1 : 0,
            transition: 'opacity 800ms ease-in-out',
            willChange: 'opacity',
          }}
        >
          <img
            src="/cinematic-cuisine.jpg"
            alt="Mangalorean Chicken Ghee Roast, Anjal Fish Fry and Neer Dosa feast"
            className="w-full h-full object-cover object-center"
            style={{
              transform: scene === 4 ? 'scale3d(1.05, 1.05, 1)' : 'scale3d(1, 1, 1)',
              transition: 'transform 1000ms cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform',
            }}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100d0c]/90 via-[#100d0c]/40 to-[#100d0c]/60" />
          <div className="absolute inset-0 bg-radial-vignette" />
        </div>

        {/* Cinematic Warm Glint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f24b26]/5 to-transparent mix-blend-overlay pointer-events-none" />
      </div>

      {/* CENTER STAGE: SCENE-BY-SCENE STORYTELLING & BRAND REVEAL */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 text-center">
        {/* SCENE 1 TEXT: KANNADA QUOTE */}
        <div
          className="max-w-3xl space-y-3 px-4 transition-all duration-700 ease-out"
          style={{
            display: scene === 1 ? 'block' : 'none',
            opacity: scene === 1 ? 1 : 0,
            transform: scene === 1 ? 'translate3d(0, 0, 0)' : 'translate3d(0, -14px, 0)',
          }}
        >
          <p
            style={{ fontFamily: "'Noto Serif Kannada', serif" }}
            className="text-2xl sm:text-5xl md:text-6xl font-semibold tracking-wide text-[#fff5e8] drop-shadow-xl leading-tight"
          >
            ಸಂಸ್ಕೃತಿಯಲ್ಲಿ ಶ್ರೀಮಂತ, ರುಚಿಯಲ್ಲಿ ಅನನ್ಯ —
          </p>
          <p
            style={{ fontFamily: "'Noto Serif Kannada', serif" }}
            className="text-2xl sm:text-5xl md:text-6xl font-bold tracking-wide text-[#f9c778] drop-shadow-xl leading-tight"
          >
            ನಮ್ಮ ಹೆಮ್ಮೆಯ ಕರಾವಳಿ!
          </p>
        </div>

        {/* SCENE 3 TEXT: KARAVALI CUISINE - KANNADA QUOTE */}
        <div
          className="max-w-3xl space-y-3 px-4 transition-all duration-700 ease-out"
          style={{
            display: scene === 3 ? 'block' : 'none',
            opacity: scene === 3 ? 1 : 0,
            transform: scene === 3 ? 'translate3d(0, 0, 0)' : 'translate3d(0, -14px, 0)',
          }}
        >
          <p
            style={{ fontFamily: "'Noto Serif Kannada', serif" }}
            className="text-2xl sm:text-5xl md:text-6xl font-semibold tracking-wide text-[#fff5e8] drop-shadow-xl leading-tight"
          >
            ಕರಾವಳಿಯ ರುಚಿ ಹೇಗಿರಬೇಕೆಂದು ಕೇಳಬೇಡಿ,
          </p>
          <p
            style={{ fontFamily: "'Noto Serif Kannada', serif" }}
            className="text-2xl sm:text-5xl md:text-6xl font-bold tracking-wide text-[#f9c778] drop-shadow-xl leading-tight"
          >
            ಒಮ್ಮೆ ನಮ್ಮಲ್ಲಿಗೆ ಬನ್ನಿ!
          </p>
        </div>

        {/* SCENE 4: BRAND REVEAL */}
        <div
          className="max-w-2xl space-y-5 sm:space-y-6 transition-all duration-700 ease-out"
          style={{
            display: scene >= 4 ? 'block' : 'none',
            opacity: scene >= 4 ? 1 : 0,
            transform: scene >= 4 ? 'scale3d(1, 1, 1)' : 'scale3d(0.95, 0.95, 1)',
          }}
        >
          {/* Logo Emblem */}
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#f24b26] bg-[#1b1513]/90 backdrop-blur-md flex items-center justify-center text-[#f24b26] shadow-2xl animate-glow">
            <Utensils className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.3em] text-[#f24b26] font-sans">
              ಕರಾವಳಿ ಕುಟುಂಬ ರೆಸ್ಟಾರೆಂಟ್
            </div>
            <h1 className="font-display uppercase text-4xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#fff5e8] drop-shadow-xl leading-none">
              COASTAL SWADA
            </h1>
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#f24b26]" />
              <span className="text-[10px] sm:text-[13px] font-medium tracking-[0.25em] uppercase text-[#bba99d]">
                The Taste of Karavali
              </span>
              <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#f24b26]" />
            </div>
          </div>

          {/* INTERACTIVE SCROLL TO ENTER PROMPT */}
          <div className="pt-2 flex flex-col items-center gap-2.5 group select-none">
            <div className="flex items-center gap-2 rounded-full border border-[#43302a] bg-[#1b1513]/90 hover:bg-[#241a17] backdrop-blur-md px-4 sm:px-5 py-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#fff5e8] group-hover:border-[#f24b26] group-hover:text-[#f24b26] transition-all shadow-xl">
              <span>Tap or Scroll to Enter</span>
              <ChevronDown className="w-4 h-4 text-[#f24b26] animate-bounce" />
            </div>

            <div className="w-5 h-8 sm:h-9 rounded-full border border-[#43302a] flex items-start justify-center p-1 shadow-md opacity-80 group-hover:opacity-100 group-hover:border-[#f24b26]">
              <div className="w-1.5 h-2.5 rounded-full bg-[#f24b26] animate-scroll-dot" />
            </div>

            <p className="text-[10px] sm:text-[11px] text-[#bba99d]/80 tracking-wider font-light">
              Tap anywhere or scroll to explore our menu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
