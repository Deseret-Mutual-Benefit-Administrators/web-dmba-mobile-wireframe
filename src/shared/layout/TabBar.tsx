import { NavLink } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { HOME_INDICATOR_HEIGHT } from "./PhoneFrame";

/**
 * The bottom tab bar from `app/(tabs)/_layout.tsx`: five tabs, active tint
 * `brand.accent`, inactive tint `brand.secondary` (the app's own inactive colour),
 * Ionicons outline glyphs mapped to lucide. 49pt bar + the 34pt bottom inset.
 */
const TABS = [
  { to: "/", labelKey: "tabs.dashboard", icon: "home-outline" },
  { to: "/benefits", labelKey: "tabs.benefits", icon: "shield-checkmark-outline" },
  { to: "/activity", labelKey: "tabs.activity", icon: "receipt-outline" },
  { to: "/search", labelKey: "tabs.search", icon: "search-outline" },
  { to: "/profile", labelKey: "tabs.profile", icon: "person-outline" },
] as const;

export function TabBar() {
  const { t } = useTranslation();
  return (
    <nav
      className="flex-row bg-brand-surface border-t border-gray-200"
      style={{ height: 49 + HOME_INDICATOR_HEIGHT, paddingBottom: HOME_INDICATOR_HEIGHT }}
      aria-label="Tabs"
    >
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/"}
          className="flex-1 items-center justify-center pt-1.5"
          aria-label={t(tab.labelKey)}
        >
          {({ isActive }) => {
            const color = isActive ? colors.brand.accent : colors.brand.secondary;
            return (
              <>
                <Icon name={tab.icon} size={24} color={color} />
                <span className="text-[10px] font-medium mt-0.5" style={{ color }}>
                  {t(tab.labelKey)}
                </span>
              </>
            );
          }}
        </NavLink>
      ))}
    </nav>
  );
}
