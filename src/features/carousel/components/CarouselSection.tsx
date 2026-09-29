import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { CarouselCard } from "./CarouselCard";
import { nextCarouselIndex } from "../services/carouselTransforms";
import { placeholderCards } from "../placeholder";

/** Per-side padding of the dashboard content container (px-4); cancelled to go edge-to-edge. */
const EDGE_BLEED = 16;
/** Visible peek of the neighbouring cards on each side of the centered card. */
const SIDE_PEEK = 32;
/** Gap between adjacent cards. */
const CARD_SPACING = 4;
/** Scale / opacity of the off-center (peeking) cards. */
const MIN_SCALE = 0.88;
const MIN_OPACITY = 0.4;
/** How long each card stays on screen before auto-advancing. */
const AUTO_ROTATE_MS = 6000;
/** Phone frame width — the app reads `useWindowDimensions()`. */
const WINDOW_WIDTH = 393;

/**
 * Dashboard carousel section — horizontal paging strip of editorial articles.
 * The centered card is full size with both neighbours peeking, scaled down and
 * faded. Auto-rotates every AUTO_ROTATE_MS, pauses while the member scrolls,
 * and is off under `prefers-reduced-motion`.
 *
 * Placeholder states: `?carousel=loading` shows the skeleton; the app renders
 * nothing on error or empty, so `?carousel=empty` hides the section.
 */
export function CarouselSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const carouselState = new URLSearchParams(useLocation().search).get("carousel");
  const isLoading = carouselState === "loading";
  const isEmpty = carouselState === "empty" || carouselState === "error";
  const cards = placeholderCards;

  const listRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const itemWidth = WINDOW_WIDTH - SIDE_PEEK * 2;
  const snap = itemWidth + CARD_SPACING;
  const sideInset = SIDE_PEEK - CARD_SPACING / 2;

  useEffect(() => {
    if (prefersReducedMotion || paused || cards.length <= 1 || isLoading || isEmpty) return;
    const id = setInterval(() => {
      const next = nextCarouselIndex(activeIndex, cards.length);
      listRef.current?.scrollTo({ left: next * snap, behavior: "smooth" });
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [activeIndex, prefersReducedMotion, paused, cards.length, snap, isLoading, isEmpty]);

  const handleCardPress = (slug: string) => navigate(`/article/${slug}`);

  if (isLoading) {
    return (
      <div className="mb-3" style={{ marginLeft: -EDGE_BLEED, marginRight: -EDGE_BLEED }} role="progressbar" aria-label={t("carousel.loading")}>
        {/* Card skeleton */}
        <div
          className="bg-brand-surface rounded-2xl overflow-hidden shadow-sm"
          style={{ width: itemWidth, height: 200, marginLeft: SIDE_PEEK, marginRight: SIDE_PEEK }}
        >
          <div className="flex-1 bg-gray-100" />
          <div className="p-4 gap-2">
            <div className="h-3 w-20 bg-gray-200 rounded-full" />
            <div className="h-4 w-40 bg-gray-200 rounded-md" />
            <div className="h-3 w-32 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return null;
  }

  return (
    <div className="mb-3" style={{ marginLeft: -EDGE_BLEED, marginRight: -EDGE_BLEED }}>
      <div
        ref={listRef}
        className="flex-row overflow-x-auto scrollbar-none"
        style={{ scrollSnapType: "x mandatory", paddingLeft: sideInset, paddingRight: sideInset, scrollPaddingLeft: sideInset }}
        onScroll={(e) => {
          const x = e.currentTarget.scrollLeft;
          setScrollX(x);
          setActiveIndex(Math.min(cards.length - 1, Math.max(0, Math.round(x / snap))));
        }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        role="list"
        aria-label={t("carousel.sectionLabel")}
      >
        {cards.map((item, index) => {
          // Scale up + fade in as this card slides toward the center.
          const distance = Math.min(Math.abs(scrollX - index * snap) / snap, 1);
          const scale = 1 - (1 - MIN_SCALE) * distance;
          const opacity = 1 - (1 - MIN_OPACITY) * distance;
          return (
            <div
              key={item.id}
              role="listitem"
              style={{
                width: itemWidth,
                marginLeft: CARD_SPACING / 2,
                marginRight: CARD_SPACING / 2,
                transform: `scale(${scale})`,
                opacity,
                scrollSnapAlign: "start",
              }}
            >
              <CarouselCard card={item} onPress={handleCardPress} cardWidth={itemWidth} />
            </div>
          );
        })}
      </div>

      {/* Dot indicators — only when there is more than one article. */}
      {cards.length > 1 && (
        <div className="flex-row justify-center mt-3 gap-1.5" aria-hidden="true">
          {cards.map((card, index) => (
            <div key={card.id} className={`h-1.5 rounded-full ${index === activeIndex ? "w-4 bg-brand-accent" : "w-1.5 bg-gray-300"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
