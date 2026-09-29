/**
 * Receipt capture for the claim form and substantiation (FA-4).
 *
 * Web: no camera. The preview is a dark rectangle carrying the source's overlay
 * (prompt + "Take photo"); "taking" or "choosing" a photo adds a page, shown with
 * a neutral grey receipt thumbnail where the app shows a document icon.
 */
import { useCallback, useEffect } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Card } from "@/src/shared/components/Card";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { useReceiptCapture } from "../hooks/useReceiptCapture";
import type { CapturedReceipt } from "../types";
import { formatReceiptSize } from "../services/receiptCompression";

export interface ReceiptCaptureProps {
  acceptedContentTypes: string[];
  maxBytes: number;
  attachLabel?: string | null;
  onPagesChange?: (pages: CapturedReceipt[]) => void;
  retainPagesOnUnmount?: boolean;
}

export function ReceiptCapture({
  acceptedContentTypes,
  maxBytes,
  attachLabel,
  onPagesChange,
  retainPagesOnUnmount = false,
}: ReceiptCaptureProps) {
  const { t } = useTranslation();
  const { pages, isBusy, error, permission, cameraRef, canAttach, canAddPage, maxPages, captureFromCamera, addFromLibrary, removePage } =
    useReceiptCapture({
      acceptedContentTypes,
      maxBytes,
      deleteOnUnmount: !retainPagesOnUnmount,
    });

  useEffect(() => {
    onPagesChange?.(pages);
  }, [pages, onPagesChange]);

  const handleCapture = useCallback(async () => {
    await captureFromCamera();
  }, [captureFromCamera]);

  const handleChooseFromLibrary = useCallback(async () => {
    await addFromLibrary();
  }, [addFromLibrary]);

  if (!canAttach) return null;

  const showCamera = Boolean(permission?.granted) && canAddPage;
  const showPermissionExplanation = Boolean(permission) && !permission?.granted;

  return (
    <Card className="mx-4 mt-4 mb-2">
      <span className="text-sm font-semibold text-brand-primary mb-1">{attachLabel ?? t("spendingClaims.receipt.title")}</span>
      <span className="text-xs text-gray-500 mb-3">{t("spendingClaims.receipt.subtitle")}</span>

      {showCamera && (
        <div className="rounded-xl overflow-hidden bg-black" style={{ height: 260 }}>
          {/* Stand-in for the live camera preview. */}
          <div
            ref={cameraRef}
            aria-hidden="true"
            className="items-center justify-center"
            style={{ flex: 1, background: "radial-gradient(ellipse at center, #2b2f36 0%, #0b0c0e 75%)" }}
          >
            <div style={{ width: 150, height: 190, borderWidth: 2, borderColor: "rgba(255,255,255,0.6)", borderStyle: "dashed", borderRadius: 10, marginBottom: 36 }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2 flex-row items-center justify-between">
            <span className="text-white text-xs flex-1 pr-3">{t("spendingClaims.receipt.capturePrompt")}</span>
            <button
              type="button"
              onClick={handleCapture}
              disabled={isBusy}
              className="bg-white rounded-full px-4 py-2 active:opacity-80"
              style={isBusy ? { opacity: 0.5 } : undefined}
              aria-label={t("spendingClaims.receipt.takePhoto")}
              aria-disabled={isBusy}
              aria-busy={isBusy}
            >
              {isBusy ? (
                <Spinner size="small" tone="accent" />
              ) : (
                <span className="text-brand-primary text-sm font-semibold">{t("spendingClaims.receipt.takePhoto")}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {showPermissionExplanation && (
        <div className="items-center justify-center px-2 py-5">
          <span aria-hidden="true" style={{ display: "flex" }}>
            <Icon name="camera-outline" size={40} color={colors.neutral[500]} />
          </span>
          <span className="text-brand-primary text-sm font-semibold mt-3 text-center">{t("spendingClaims.receipt.permissionTitle")}</span>
          <span className="text-gray-500 text-xs mt-1 text-center">{t("spendingClaims.receipt.permissionBody")}</span>
          <Button label={t("spendingClaims.receipt.openSettings")} onPress={() => {}} className="mt-4" />
        </div>
      )}

      {canAddPage && (
        <Button
          variant="secondary"
          label={t("spendingClaims.receipt.chooseFromPhotos")}
          onPress={handleChooseFromLibrary}
          disabled={isBusy}
          loading={isBusy}
          icon={<Icon name="images-outline" size={18} color={colors.brand.accent} />}
          className="mt-3"
          accessibilityHint={t("common.hints.opensPhotoLibrary")}
        />
      )}

      {!canAddPage && pages.length >= maxPages && (
        <span className="text-gray-500 text-xs py-2">{t("spendingClaims.receipt.maxPagesReached", { count: maxPages })}</span>
      )}

      {pages.length > 0 && (
        <div className="mt-3">
          {pages.map((page, index) => (
            <ReceiptPageRow key={page.id} page={page} pageNumber={index + 1} onRemove={removePage} />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-3 bg-red-50 rounded-xl px-3 py-3" role="alert">
          <span className="text-red-800 text-xs font-medium">{t(`spendingClaims.receipt.error.${error}`)}</span>
        </div>
      )}
    </Card>
  );
}

interface ReceiptPageRowProps {
  page: CapturedReceipt;
  pageNumber: number;
  onRemove: (id: string) => Promise<void>;
}

function ReceiptPageRow({ page, pageNumber, onRemove }: ReceiptPageRowProps) {
  const { t } = useTranslation();
  const size = formatReceiptSize(page.byteLength);
  const label = t("spendingClaims.receipt.pageLabel", { number: pageNumber });

  return (
    <div className="flex-row items-center justify-between border-t border-gray-100 py-3">
      <div className="flex-row items-center flex-1 pr-3">
        {/* Wireframe: a neutral grey receipt thumbnail in place of the app's document icon. */}
        <div
          aria-hidden="true"
          style={{
            width: 28,
            height: 36,
            marginRight: 10,
            borderRadius: 3,
            backgroundColor: colors.neutral[200],
            borderWidth: 1,
            borderColor: colors.neutral[300],
            paddingTop: 6,
            paddingLeft: 5,
            paddingRight: 5,
            gap: 3,
          }}
        >
          <div style={{ height: 2, backgroundColor: colors.neutral[400] }} />
          <div style={{ height: 2, width: "70%", backgroundColor: colors.neutral[400] }} />
          <div style={{ height: 2, backgroundColor: colors.neutral[400] }} />
          <div style={{ height: 2, width: "50%", backgroundColor: colors.neutral[400] }} />
        </div>
        <div className="flex-1">
          <span className="text-sm text-brand-primary font-medium">{label}</span>
          <span className="text-xs text-gray-500">{t(`spendingClaims.receipt.size.${size.unit}`, { value: size.value })}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          void onRemove(page.id);
        }}
        className="active:opacity-70"
        style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
        aria-label={t("spendingClaims.receipt.removePage", { number: pageNumber })}
      >
        <span style={{ color: colors.error, fontSize: 14, fontWeight: "600" }}>{t("spendingClaims.receipt.remove")}</span>
      </button>
    </div>
  );
}
