"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { PropertyImage } from "@/types";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images }: { images: PropertyImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const sorted = [...images].sort((a, b) => a.order - b.order);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + sorted.length) % sorted.length);
    },
    [sorted.length]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, activeIndex, goTo]);

  const active = sorted[activeIndex];

  if (!active) return null;

  return (
    <>
      {/* Main gallery */}
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <div
          className="relative aspect-[16/10] w-full sm:aspect-[16/9]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            key={active.id}
            src={active.url}
            alt={active.alt}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover"
          />

          {/* Count badge */}
          <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            {activeIndex + 1} / {sorted.length}
          </div>

          {/* Fullscreen */}
          <button
            onClick={() => setFullscreen(true)}
            className="absolute bottom-4 left-4 flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
            aria-label="Plein écran"
          >
            <Expand className="size-4" />
          </button>

          {/* Arrows */}
          {sorted.length > 1 && (
            <>
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
                aria-label="Image précédente"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60"
                aria-label="Image suivante"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => goTo(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all",
                i === activeIndex
                  ? "border-gold ring-2 ring-gold/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="96px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/95"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Fermer"
            onClick={() => setFullscreen(false)}
          >
            <X className="size-5" />
          </button>

          <div
            className="relative h-screen w-screen"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              src={active.url}
              alt={active.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-4">
              <button
                onClick={() => goTo(activeIndex - 1)}
                className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Précédente"
              >
                <ChevronLeft className="size-6" />
              </button>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {activeIndex + 1} / {sorted.length}
              </div>
              <button
                onClick={() => goTo(activeIndex + 1)}
                className="flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Suivante"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}