import type { ReactNode } from "react";
import { Label } from "./Typography";
import { keyValueClasses } from "./keyValueClasses";
import type { KeyValueTone } from "./keyValueClasses";

export { keyValueClasses } from "./keyValueClasses";
export type { KeyValueClasses, KeyValueTone } from "./keyValueClasses";

interface KeyValueRowProps {
  label: string;
  value: string | ReactNode;
  emphasize?: boolean;
  tone?: KeyValueTone;
  divider?: boolean;
  /** Total/summary rows ("You Owe") — larger value text, implies emphasize. */
  prominent?: boolean;
  testID?: string;
}

/**
 * The horizontal "label ..... value" stat row. Distinct from `InfoRow`, which is
 * icon-mandatory and stacks label above value.
 */
export function KeyValueRow({ label, value, emphasize, tone, divider, prominent, testID }: KeyValueRowProps) {
  const classes = keyValueClasses({ emphasize, tone, divider, prominent });

  return (
    <div className={classes.row} data-testid={testID}>
      <Label>{label}</Label>
      {typeof value === "string" ? <span className={classes.value}>{value}</span> : value}
    </div>
  );
}
