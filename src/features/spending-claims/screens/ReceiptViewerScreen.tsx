/** Full-screen view of one attached receipt — a thin frame around ReceiptViewer. */
import { useTranslation } from "@/src/shared/i18n";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ReceiptViewer } from "../components/ReceiptViewer";

export interface ReceiptViewerScreenProps {
  /** Parsed from the route; null for a missing or non-positive key (a bad link). */
  fileKey: number | null;
}

export function ReceiptViewerScreen({ fileKey }: ReceiptViewerScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-brand-background h-full">
      <ScreenHeader title={t("spendingClaims.viewer.title")} />
      {fileKey === null ? (
        <div className="flex-1 items-center justify-center px-8">
          <span className="text-sm text-center text-brand-primary" role="alert" aria-label={t("spendingClaims.viewer.loadError")}>
            {t("spendingClaims.viewer.loadError")}
          </span>
        </div>
      ) : (
        <ReceiptViewer fileKey={fileKey} />
      )}
    </div>
  );
}
