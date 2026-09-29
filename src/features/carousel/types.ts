/**
 * Carousel feature types.
 * Mirror the §3 member read-API DTOs from docs/integrations/content-carousel-contract.md.
 *
 * Both endpoints share the same envelope shape.
 * GET /content/carousel        → CarouselCard[] (no bodyMarkdown)
 * GET /content/carousel/{slug} → CarouselArticle (adds bodyMarkdown)
 */

export interface CarouselCategory {
  /** Internal key, e.g. "retirement" — used for targeting/cache keys. */
  key: string;
  /** Localized display label, e.g. "Retirement Planning". */
  displayName: string;
  /**
   * Theme palette token from content.Category.ColorToken.
   * Maps to NativeWind color class at render time (see categoryColorClass helper).
   */
  colorToken: string;
}

export interface CarouselHero {
  url: string;
  /** Per-locale alt text from content.ArticleTranslation.HeroAltText. Required for a11y. */
  altText: string;
  width: number;
  height: number;
}

/**
 * Card shape returned by GET /content/carousel (no body).
 * Sorted by displayOrder asc, then publishedAtUtc desc (server-side).
 *
 * `hero` is nullable — the API allows HeroAssetId to be null on a card
 * (CarouselHeroResponse? in the member read-API). The publish gate in the
 * admin API enforces a hero before moving to Published, but the mobile
 * consumer must still guard against null so a misconfigured or in-flight
 * article never crashes the UI.
 */
export interface CarouselCard {
  id: string;
  slug: string;
  category: CarouselCategory;
  title: string;
  excerpt: string;
  /** Computed from word count ~225 wpm; ReadMinutesOverride wins if set. */
  readMinutes: number;
  hero: CarouselHero | null;
  publishedAtUtc: string;
  displayOrder: number;
}

/**
 * Full article shape returned by GET /content/carousel/{slug}.
 * Extends CarouselCard with the rendered Markdown body.
 */
export interface CarouselArticle extends CarouselCard {
  bodyMarkdown: string;
}
