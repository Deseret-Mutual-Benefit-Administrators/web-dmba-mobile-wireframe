import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface InfoRowProps {
  /** An Ionicons name. */
  icon: string;
  label: string;
  value: string;
}

/** Icon + stacked label/value row with a top hairline. */
export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex-row items-center py-3 border-t border-gray-100">
      <Icon name={icon} size={18} color={colors.brand.secondary} />
      <div className="ml-3 flex-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm text-brand-primary">{value}</span>
      </div>
    </div>
  );
}
