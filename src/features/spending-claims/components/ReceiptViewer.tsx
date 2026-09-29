/**
 * Views one attached receipt (FA-4, Phase 7). Images render through the image
 * decoder from a `data:` URI; PDFs are acknowledged, never rendered (FA4-M4).
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { formatReceiptSize } from "../services/receiptCompression";
import { buildReceiptDataUri, getReceiptViewModeMessageKey, receiptViewMode } from "../services/receiptViewMode";
import { useReceipt } from "../api/spendingClaimsQueries";

export interface ReceiptViewerProps {
  /** A retrievable key from `claim.receipts[].fileKey` or `transaction.receipts[].fileKey`. */
  fileKey: number;
}

export function ReceiptViewer({ fileKey }: ReceiptViewerProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch, isRefetching } = useReceipt(fileKey);

  if (isLoading) {
    return (
      <div className="flex-1 items-center justify-center">
        <Spinner />
        <span className="text-xs text-gray-500 mt-3">{t("common.loading")}</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 items-center justify-center px-8">
        <span className="text-sm text-center text-brand-primary mb-4" role="alert" aria-label={t("spendingClaims.viewer.loadError")}>
          {t("spendingClaims.viewer.loadError")}
        </span>
        <Button label={t("common.retry")} onPress={() => void refetch()} disabled={isRefetching} loading={isRefetching} />
      </div>
    );
  }

  const mode = receiptViewMode(data.contentType);
  const dataUri = buildReceiptDataUri(data.contentType, data.base64);
  const size = formatReceiptSize(data.contentLength);
  const sizeLabel = t(`spendingClaims.receipt.size.${size.unit}`, { value: size.value });

  if (mode === "image" && dataUri) {
    return (
      <div className="flex-1 px-4 py-4">
        <div className="flex-1 rounded-2xl overflow-hidden bg-black">
          <img
            src={dataUri}
            style={{ flex: 1, width: "100%", height: "100%", minHeight: 0, objectFit: "contain" }}
            alt={t("spendingClaims.viewer.imageLabel")}
          />
        </div>
        <span className="text-xs text-gray-500 mt-2 text-center">{sizeLabel}</span>
      </div>
    );
  }

  const messageKey = getReceiptViewModeMessageKey(mode);

  return (
    <div className="flex-1 items-center justify-center px-8">
      <span aria-hidden="true" style={{ display: "flex" }}>
        <Icon name={mode === "acknowledged" ? "document-text-outline" : "help-circle-outline"} size={48} color={colors.neutral[500]} />
      </span>
      <span
        className="text-sm text-brand-primary mt-3 text-center"
        role="text"
        aria-label={messageKey ? t(messageKey) : t("spendingClaims.viewer.unsupported")}
      >
        {messageKey ? t(messageKey) : t("spendingClaims.viewer.unsupported")}
      </span>
      <span className="text-xs text-gray-500 mt-2">{sizeLabel}</span>
    </div>
  );
}
