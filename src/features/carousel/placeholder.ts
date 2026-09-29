/**
 * Placeholder carousel articles. Generic editorial copy, no images: the hero
 * renders as a neutral gradient block with the article title (`hero: null`
 * would draw the app's plain slate block; the wireframe draws the title on it).
 */
import type { CarouselArticle, CarouselCard } from "./types";

export const placeholderArticles: CarouselArticle[] = [
  {
    id: "article-1",
    slug: "sample-article",
    category: { key: "retirement", displayName: "Retirement Planning", colorToken: "blue" },
    title: "Planning Ahead With Your Health Savings Account",
    excerpt: "A health savings account can do more than cover this year's bills — it can help you save for later, too.",
    readMinutes: 3,
    hero: null,
    publishedAtUtc: "2026-09-01T00:00:00Z",
    displayOrder: 1,
    bodyMarkdown: `## Three ways an HSA helps

Many members use their HSA for this year's medical bills. It can also be a way to set money aside for the future.

1. **Money goes in before tax** — lowering your taxable income.
2. **Growth is not taxed** — while the money stays in the account.
3. **Qualified spending is not taxed** — at any age.

## Getting started

Check your balance on the Home screen, and look at your contributions on the account's detail screen.`,
  },
  {
    id: "article-2",
    slug: "preventive-care",
    category: { key: "wellness", displayName: "Wellness", colorToken: "green" },
    title: "Make the Most of Preventive Care",
    excerpt: "Regular checkups help catch problems early. Here's what to schedule this year.",
    readMinutes: 2,
    hero: null,
    publishedAtUtc: "2026-08-20T00:00:00Z",
    displayOrder: 2,
    bodyMarkdown: "## Why it matters\n\nRegular checkups help you and your doctor spot changes early.\n\n- Annual physical\n- Dental cleanings\n- Eye exams",
  },
  {
    id: "article-3",
    slug: "open-enrollment",
    category: { key: "benefits", displayName: "Benefits", colorToken: "amber" },
    title: "Getting Ready for Open Enrollment",
    excerpt: "A short checklist to review before you choose next year's plans.",
    readMinutes: 4,
    hero: null,
    publishedAtUtc: "2026-08-10T00:00:00Z",
    displayOrder: 3,
    bodyMarkdown: "## Before you choose\n\nLook back at this year's care and costs, then compare next year's options.",
  },
];

export const placeholderCards: CarouselCard[] = placeholderArticles.map(({ bodyMarkdown: _body, ...card }) => card);
