import type { ReactNode } from "react";
import { typographyClasses } from "./typographyClasses";

export { typographyClasses } from "./typographyClasses";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

function mergeClassName(base: string, className?: string): string {
  return [base, className ?? ""].filter(Boolean).join(" ");
}

/** Section/card heading — always a heading element. */
export function SectionTitle({ children, className }: TypographyProps) {
  return <h2 className={mergeClassName(typographyClasses.sectionTitle, className)}>{children}</h2>;
}

/** Secondary/muted text — field labels, row subtitles. */
export function Label({ children, className }: TypographyProps) {
  return <span className={mergeClassName(typographyClasses.label, className)}>{children}</span>;
}

/** Smallest/most muted tier — timestamps, helper text, fine print. */
export function Caption({ children, className }: TypographyProps) {
  return <span className={mergeClassName(typographyClasses.caption, className)}>{children}</span>;
}

/** Small-caps-style section marker (e.g. "FAQ SECTION"). */
export function Eyebrow({ children, className }: TypographyProps) {
  return <span className={mergeClassName(typographyClasses.eyebrow, className)}>{children}</span>;
}
