import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors, withAlpha } from "@/src/shared/theme/colors";

interface LocationRowProps {
  zip: string;
  onZipChange: (zip: string) => void;
  onUseMyLocation: () => void;
  isLocating: boolean;
  locationActive?: boolean;
  highlighted?: boolean;
}

/**
 * ZIP field + Use My Location. The app's two Animated loops (GPS pulse,
 * highlight border pulse) are CSS `animate-ping` / `animate-pulse` here; both
 * stop under `prefers-reduced-motion` via Tailwind's `motion-reduce:`.
 */
export function LocationRow({
  zip,
  onZipChange,
  onUseMyLocation,
  isLocating,
  locationActive = false,
  highlighted = false,
}: LocationRowProps) {
  const { t } = useTranslation();

  const containerBase = "flex-row items-center rounded-2xl px-3 py-3 shadow-sm";

  return (
    <div
      className={[containerBase, highlighted ? "animate-pulse motion-reduce:animate-none" : ""].filter(Boolean).join(" ")}
      style={
        highlighted
          ? { borderWidth: 1.5, borderStyle: "solid", borderColor: colors.highlight.base, backgroundColor: withAlpha(colors.highlight.light, 0.1) }
          : { borderWidth: 1, borderStyle: "solid", borderColor: colors.neutral[100], backgroundColor: colors.brand.surface }
      }
    >
      <Icon
        name={locationActive ? "location" : "location-outline"}
        size={18}
        color={highlighted ? colors.highlight.base : locationActive ? colors.searchSlate.deep : colors.neutral[500]}
      />
      <input
        value={zip}
        onChange={(e) => onZipChange(e.target.value.replace(/\D/g, "").slice(0, 5))}
        placeholder={highlighted ? t("search.zipRequired") : t("search.zipPlaceholder")}
        inputMode="numeric"
        maxLength={5}
        className={`flex-1 ml-2 text-base text-brand-primary bg-transparent outline-none min-w-0 ${highlighted ? "placeholder:text-amber-600" : "placeholder:text-gray-500"}`}
        role="searchbox"
        aria-label={highlighted ? t("search.zipRequired") : t("search.zipPlaceholder")}
      />
      <div className="pl-2 border-l border-gray-200">
        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={isLocating}
          className="active:opacity-80 disabled:opacity-40"
          aria-label={t("search.useMyLocation")}
        >
          <div style={{ alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            {locationActive && (
              <div
                className="animate-ping motion-reduce:animate-none"
                style={{ position: "absolute", width: 28, height: 28, borderRadius: 14, backgroundColor: colors.searchSlate.deep, opacity: 0.3 }}
              />
            )}
            {locationActive && (
              <div
                style={{ position: "absolute", width: 28, height: 28, borderRadius: 14, backgroundColor: withAlpha(colors.searchSlate.deep, 0.12) }}
              />
            )}
            {isLocating ? (
              <Spinner size="small" />
            ) : (
              <Icon
                name={locationActive ? "navigate" : "navigate-outline"}
                size={20}
                color={locationActive ? colors.searchSlate.deep : colors.searchSlate.base}
              />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
