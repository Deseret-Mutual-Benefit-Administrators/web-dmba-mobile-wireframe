import type { CSSProperties, ReactNode } from "react";

interface KeyboardAvoidingScreenProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pass-through on the web: there is no on-screen keyboard to avoid. Keeps the
 * app's default classes so a screen wrapped in it lays out the same.
 */
export function KeyboardAvoidingScreen({ children, className = "flex-1 bg-brand-background", style }: KeyboardAvoidingScreenProps) {
  return (
    <div className={className} style={{ flex: 1, minHeight: 0, ...style }}>
      {children}
    </div>
  );
}
