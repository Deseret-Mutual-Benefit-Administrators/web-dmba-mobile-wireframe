import { useEffect, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

/** True only when the browser reports no connection. */
export function useIsOffline(): boolean {
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && navigator.onLine === false);
  useEffect(() => {
    const update = () => setOffline(navigator.onLine === false);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return offline;
}

/**
 * Offline banner. In the app it pads for the top safe area itself; inside the
 * phone frame the status bar is drawn separately, so only the 10pt remains.
 */
export function OfflineBanner() {
  const { t } = useTranslation();
  const isOffline = useIsOffline();
  if (!isOffline) return null;

  return (
    <div className="bg-warning/90 px-4 pb-2.5 flex-row items-center justify-center" style={{ paddingTop: 10 }} role="alert" aria-live="polite">
      <Icon name="cloud-offline-outline" size={16} color={colors.brand.primary} />
      <span className="text-brand-primary text-sm font-medium ml-2">{t("offline.banner")}</span>
    </div>
  );
}
