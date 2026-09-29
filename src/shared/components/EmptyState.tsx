import type { ReactNode } from "react";
import { SectionTitle, Label } from "./Typography";
import { Button } from "./Button";
import { emptyStateContainerClass } from "./emptyStateClasses";

export { emptyStateContainerClass } from "./emptyStateClasses";

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: EmptyStateAction;
}

/** Canonical centered empty-list state (48px glyph, `mt-4` before the text). */
export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className={emptyStateContainerClass}>
      {icon ? <div className="mb-4">{icon}</div> : null}
      <SectionTitle className="text-center">{title}</SectionTitle>
      {message ? <Label className="text-center mt-1">{message}</Label> : null}
      {action ? (
        <Button variant="secondary" size="sm" label={action.label} onPress={action.onPress} className="mt-4" />
      ) : null}
    </div>
  );
}
