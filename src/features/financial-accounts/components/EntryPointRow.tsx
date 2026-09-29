import { Icon } from "@/src/shared/icons";
import { cardShadowStyle } from "@/src/shared/components/Card";
import { colors } from "@/src/shared/theme/colors";

interface EntryPointRowProps {
  icon: string;
  label: string;
  hint: string;
  onPress: () => void;
  /** Extra space above — separates a row from a different group, not just the row before it. */
  spacedAbove?: boolean;
}

/**
 * A tappable "go do this thing" row — benefit cards, the eligibility scanner, submitting a claim.
 * Shared by the spending-accounts list and account detail (U6).
 */
export function EntryPointRow({ icon, label, hint, onPress, spacedAbove = false }: EntryPointRowProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="active:opacity-70"
      style={{
        marginLeft: 16,
        marginRight: 16,
        marginTop: spacedAbove ? 16 : 8,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.brand.surface,
        borderRadius: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 14,
        paddingBottom: 14,
        ...cardShadowStyle,
      }}
      aria-label={label}
      title={hint}
    >
      <span aria-hidden="true" style={{ marginRight: 12, display: "flex" }}>
        <Icon name={icon} size={20} color={colors.financial.gradientStart} />
      </span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: "600", color: colors.brand.primary }}>{label}</span>
      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name="chevron-forward" size={18} color={colors.neutral[500]} />
      </span>
    </button>
  );
}
