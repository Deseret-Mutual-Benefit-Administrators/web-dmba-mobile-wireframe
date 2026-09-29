import type { ReactNode } from "react";
import { badgeToneClasses } from "./badgeToneClasses";
import type { BadgeTone } from "./badgeToneClasses";

export { badgeToneClasses } from "./badgeToneClasses";
export type { BadgeToneClasses, BadgeTone } from "./badgeToneClasses";

interface BadgeProps {
  label: string;
  tone: BadgeTone;
  icon?: ReactNode;
  testID?: string;
}

/** Canonical status pill. Never pressable. */
export function Badge({ label, tone, icon, testID }: BadgeProps) {
  const classes = badgeToneClasses[tone];

  return (
    <div className={`flex-row items-center px-2 py-0.5 rounded-full self-start ${classes.container}`} data-testid={testID}>
      {icon ? <div className="mr-1">{icon}</div> : null}
      <span className={`text-xs font-semibold font-sans-bold ${classes.text}`}>{label}</span>
    </div>
  );
}
