import type { ReactNode } from "react";
import { iconChipClasses } from "./iconChipClasses";
import type { IconChipSize, IconChipTone } from "./iconChipClasses";

export { iconChipClasses } from "./iconChipClasses";
export type { IconChipSize, IconChipTone } from "./iconChipClasses";

interface IconChipProps {
  icon: ReactNode;
  size?: IconChipSize;
  tone?: IconChipTone;
}

/** Circular icon badge ahead of a list row's label. Carries no margin; callers position it. */
export function IconChip({ icon, size = "md", tone = "info" }: IconChipProps) {
  return <div className={iconChipClasses(size, tone)}>{icon}</div>;
}
