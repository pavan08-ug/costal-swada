import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Utensils, ChevronDown } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
  isExiting: boolean;
}

export function CoastalSwadaIntro({ onComplete, isExiting }: IntroProps) {
  // Current scene: 1: Sea, 3: Cuisine, 4: Brand Reveal (Pauses here until user scrolls), 5: Transitioning
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
    setScene(5);
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [onComplete]);

  // Preload both cinematic images before starting the animation loop
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

    const seaImg = new Image();
    seaImg.onload = done;
    seaImg.onerror = done; // proceed even if an image fails
    seaImg.src = '/cinematic-sea.jpg';

    const cuisineImg = new Image();
    cuisineImg.onload = done;
    cuisineImg.onerror = done;
    cuisineImg.src = '/cinematic-cuisine.jpg';
  }, [onComplete]);

  // Phase 1: Drive scene via requestAnimationFrame (no setInterval jank)
  useEffect(() => {
    if (!imagesReady) return;

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;

      let nextScene: 1 | 3 | 4 | 5;
      if (elapsed < 2000) {
        nextScene = 1;
      } else if (elapsed < 4000) {
        nextScene = 3;
      } else {
        // SCENE 4 REACHED: stop the RAF loop and await scroll
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
    return () => cancelAnimationFrame(rafRef.current);
  }, [imagesReady]);

  // Phase 2: Detect user scroll (mouse wheel, touch swipe, arrow keys, click)
  useEffect(() => {
    if (!isAwaitingScroll) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 4 || Math.abs(e.deltaX) > 10) {
        triggerTransition();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY > 15) {
        triggerTransition();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', 'Space', 'Enter'].includes(e.code)) {
        triggerTransition();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAwaitingScroll, triggerTransition]);

  return (
    <div
      onClick={isAwaitingScroll ? triggerTransition : undefined}
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-[#100d0c] text-[#fff5e8] select-none ${isAwaitingScroll ? 'cursor-pointer' : ''}`}
      style={{
        opacity: isExiting || scene === 5 ? 0 : 1,
        transform: isExiting || scene === 5 ? 'scale3d(1.02, 1.02, 1)' : 'scale3d(1, 1, 1)',
        transition: 'opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: isExiting || scene === 5 ? 'none' : undefined,
        willChange: 'opacity, transform',
      }}
      aria-label="Coastal Swada cinematic introduction"
      role="dialog"
      aria-modal="true"
    >
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
            transition: 'opacity 900ms ease-in-out',
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
            transition: 'opacity 900ms ease-in-out',
            willChange: 'opacity',
          }}
        >
          <img
            src="/cinematic-cuisine.jpg"
            alt="Mangalorean Chicken Ghee Roast, Anjal Fish Fry and Neer Dosa feast"
            className="w-full h-full object-cover object-center"
            style={{
              transform: scene === 4 ? 'scale3d(1.05, 1.05, 1)' : 'scale3d(1, 1, 1)',
              transition: 'transform 1200ms cubic-bezier(0.25, 1, 0.5, 1)',
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
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* SCENE 1 TEXT: KANNADA QUOTE */}
        {scene === 1 && (
          <div className="animate-fade-in-up max-w-3xl space-y-3 px-4">
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
        )}

        {/* SCENE 3 TEXT: KARAVALI CUISINE - KANNADA QUOTE */}
        {scene === 3 && (
          <div className="animate-fade-in-up max-w-3xl space-y-3 px-4">
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
        )}

        {/* SCENE 4: BRAND REVEAL — PAUSES HERE UNTIL USER SCROLLS */}
        {scene >= 4 && (
          <div className="animate-scale-in max-w-2xl space-y-6">
            {/* Logo Emblem */}
            <div className="mx-auto w-16 h-16 rounded-full border-2 border-[#f24b26] bg-[#1b1513]/90 backdrop-blur-md flex items-center justify-center text-[#f24b26] shadow-2xl animate-glow">
              <Utensils className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.35em] text-[#f24b26] font-sans">
                ಕರಾವಳಿ ಕುಟುಂಬ ರೆಸ್ಟಾರೆಂಟ್
              </div>
              <h1 className="font-display uppercase text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#fff5e8] drop-shadow-xl">
                COASTAL SWADA
              </h1>
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#f24b26]" />
                <span className="text-[11px] sm:text-[13px] font-medium tracking-[0.28em] uppercase text-[#bba99d]">
                  The Taste of Karavali
                </span>
                <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#f24b26]" />
              </div>
            </div>

            {/* INTERACTIVE SCROLL TO ENTER PROMPT */}
            <div className="pt-2 flex flex-col items-center gap-3 group select-none">
              <div className="flex items-center gap-2 rounded-full border border-[#43302a] bg-[#1b1513]/90 hover:bg-[#241a17] backdrop-blur-md px-5 py-2.5 text-xs font-semibold tracking-[0.22em] uppercase text-[#fff5e8] group-hover:border-[#f24b26] group-hover:text-[#f24b26] transition-all shadow-xl">
                <span>Scroll to Enter</span>
                <ChevronDown className="w-4 h-4 text-[#f24b26] animate-bounce" />
              </div>

              <div className="w-5 h-9 rounded-full border border-[#43302a] flex items-start justify-center p-1 shadow-md opacity-80 group-hover:opacity-100 group-hover:border-[#f24b26]">
                <div className="w-1.5 h-2.5 rounded-full bg-[#f24b26] animate-scroll-dot" />
              </div>

              <p className="text-[11px] text-[#bba99d]/75 tracking-wider font-light">
                Scroll down or click to enter the table
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
