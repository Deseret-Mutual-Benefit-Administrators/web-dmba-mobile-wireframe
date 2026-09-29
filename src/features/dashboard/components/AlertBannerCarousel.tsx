import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

/**
 * Alert banner ("nudges") carousel — horizontal paging strip with dot
 * indicators. Renders nothing until the nudges feature supplies real items: the
 * sample nudges were removed on 2026-09-02 (ADR-157), so the registry is empty.
 * Dismissal is local state here (the app keeps it in its app store).
 */

export interface AlertItem {
  id: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  titleKey: string;
  subtitleKey: string;
}

/** Nudge registry. Deliberately empty (ADR-157). */
const ALERTS: AlertItem[] = [];

interface AlertBannerCarouselProps {
  alerts?: AlertItem[];
}

const CARD_HORIZONTAL_MARGIN = 16;
/** Phone frame width (393) — the app reads `useWindowDimensions()`. */
const SCREEN_WIDTH = 393;

export function AlertBannerCarousel({ alerts = ALERTS }: AlertBannerCarouselProps = {}) {
  const { t } = useTranslation();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));
  const cardWidth = SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN * 2;

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <div
        className="flex-row overflow-x-auto scrollbar-none"
        style={{ scrollSnapType: "x mandatory", paddingLeft: CARD_HORIZONTAL_MARGIN, paddingRight: CARD_HORIZONTAL_MARGIN }}
        onScroll={(e) => setActiveIndex(Math.round(e.currentTarget.scrollLeft / cardWidth))}
      >
        {visibleAlerts.map((item) => (
          <div
            key={item.id}
            className="rounded-xl flex-row items-center px-4 py-3.5"
            style={{ width: cardWidth, backgroundColor: item.bgColor, scrollSnapAlign: "start" }}
          >
            <div className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${item.iconColor}20` }}>
              <Icon name={item.icon} size={20} color={item.iconColor} />
            </div>
            <div className="flex-1 mr-2">
              <span className="text-sm font-semibold text-brand-primary">{t(item.titleKey)}</span>
              <p className="text-xs text-brand-secondary mt-0.5">{t(item.subtitleKey)}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissedAlerts((prev) => [...prev, item.id])}
              className="p-1.5 -mr-1 active:opacity-80"
              aria-label={t("dashboard.alerts.dismiss")}
            >
              <Icon name="close" size={18} color={colors.neutral[500]} />
            </button>
          </div>
        ))}
      </div>

      {visibleAlerts.length > 1 && (
        <div className="flex-row justify-center mt-2 gap-1.5" aria-hidden="true">
          {visibleAlerts.map((alert, index) => (
            <div key={alert.id} className={`h-1.5 rounded-full ${index === activeIndex ? "w-4 bg-brand-accent" : "w-1.5 bg-gray-300"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
