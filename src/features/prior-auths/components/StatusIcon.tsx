/**
 * Ionicons glyph for a prior-auth status. `cloud-upload-outline` is not in the
 * shared icon map, so it comes straight from lucide; everything else goes
 * through the shared `Icon`.
 */
import { CloudUpload } from "lucide-react";
import { Icon } from "@/src/shared/icons";

export function StatusIcon({ name, size, color }: { name: string; size: number; color: string }) {
  if (name.startsWith("cloud-upload")) return <CloudUpload size={size} color={color} className="shrink-0" aria-hidden="true" />;
  return <Icon name={name} size={size} color={color} />;
}
