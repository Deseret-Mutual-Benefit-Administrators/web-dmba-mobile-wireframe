/** Web stand-ins for the app's accessible-label composers (not in the extract). */
export function composeFieldAccessibilityLabel(opts: { label: string; required: boolean; requiredText: string }): string {
  return opts.required ? `${opts.label}, ${opts.requiredText}` : opts.label;
}

export function composeSelectAccessibilityLabel(opts: {
  label: string;
  required: boolean;
  requiredText: string;
  selectedLabel: string;
  placeholder: string;
}): string {
  const base = composeFieldAccessibilityLabel(opts);
  return `${base}, ${opts.selectedLabel !== "" ? opts.selectedLabel : opts.placeholder}`;
}
