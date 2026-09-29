import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { useToast } from "@/src/shared/components/Toast";
import { colors } from "@/src/shared/theme/colors";
import { formatReceiptSize } from "../services/format";
import { ATTACHMENT_GATE_MESSAGE_KEYS, attachmentGateAllowsRetry, type AttachmentGate } from "../services/attachmentGate";
import { useScreenState } from "../hooks/useScreenState";
import { findAttachment } from "../placeholder";

type ViewMode = "image" | "acknowledged" | "unsupported";

/** Stand-in for `spending-claims/services/receiptViewMode.receiptViewMode` (not in the extract). */
function receiptViewMode(contentType: string): ViewMode {
  if (contentType === "image/jpeg" || contentType === "image/png") return "image";
  if (contentType === "application/pdf") return "acknowledged";
  return "unsupported";
}

/**
 * Views one message attachment — the `ReceiptViewer` pattern. The wireframe has
 * no bytes, so an image renders as a neutral placeholder in the app's black
 * frame. `?state=loading|error|pending|blocked` shows the load and scan-gate
 * states (ADR-202).
 */
export function AttachmentViewerScreen() {
  const { attachmentId } = useParams<{ threadId: string; attachmentId: string }>();
  const { t } = useTranslation();
  const toast = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const state = useScreenState(["loading", "error", "pending", "blocked"] as const);

  const attachment = findAttachment(attachmentId);
  const data = { fileName: attachment.fileName, contentType: attachment.contentType, base64: "", contentLength: attachment.sizeBytes };
  const isLoading = state === "loading";
  const isError = state === "error" || state === "pending" || state === "blocked";
  const gate: AttachmentGate | null = state === "pending" ? "pending" : state === "blocked" ? "blocked" : null;

  const handleShare = async () => {
    setIsSharing(true);
    window.setTimeout(() => {
      setIsSharing(false);
      toast.show(t("common.hints.opensShareSheet"));
    }, 600);
  };

  return (
    <div className="flex-1 bg-brand-background" style={{ height: "100%" }}>
      <ScreenHeader title={isError || isLoading ? t("messaging.thread.attachmentViewerTitle") : data.fileName} />

      {isLoading ? (
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : isError ? (
        <ViewerErrorState
          messageKey={gate ? ATTACHMENT_GATE_MESSAGE_KEYS[gate] : "messaging.thread.attachmentLoadError"}
          canRetry={gate === null || attachmentGateAllowsRetry(gate)}
          onRetry={() => undefined}
          isRefetching={false}
        />
      ) : (
        <ViewerBody data={data} onShare={handleShare} isSharing={isSharing} />
      )}
    </div>
  );
}

/** One place for the generic load error and the two scan-gate states; a blocked file gets no Retry. */
function ViewerErrorState({
  messageKey,
  canRetry,
  onRetry,
  isRefetching,
}: {
  messageKey: string;
  canRetry: boolean;
  onRetry: () => void;
  isRefetching: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 items-center justify-center px-8">
      <span className="text-sm text-center text-brand-primary mb-4" role="alert">
        {t(messageKey)}
      </span>
      {canRetry && <Button label={t("common.retry")} onPress={onRetry} disabled={isRefetching} loading={isRefetching} />}
    </div>
  );
}

function ViewerBody({
  data,
  onShare,
  isSharing,
}: {
  data: { contentType: string; base64: string; contentLength: number };
  onShare: () => void;
  isSharing: boolean;
}) {
  const { t } = useTranslation();
  const mode = receiptViewMode(data.contentType);
  const size = formatReceiptSize(data.contentLength);
  const sizeLabel = t(`spendingClaims.receipt.size.${size.unit}`, { value: size.value });

  if (mode === "image") {
    return (
      <div className="flex-1 px-4 py-4">
        <div className="flex-1 rounded-2xl overflow-hidden bg-black">
          {/* Wireframe: neutral placeholder where the decoded image would be. */}
          <div className="flex-1 items-center justify-center" role="img" aria-label={t("messaging.thread.attachmentImageLabel")}>
            <Icon name="image-outline" size={64} color={colors.neutral[500]} />
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-2 text-center">{sizeLabel}</span>
      </div>
    );
  }

  const messageKey = mode === "acknowledged" ? "messaging.thread.viewerAcknowledged" : null;

  return (
    <div className="flex-1 items-center justify-center px-8">
      <Icon name={mode === "acknowledged" ? "document-text-outline" : "help-circle-outline"} size={48} color={colors.neutral[500]} />
      <span className="text-sm text-brand-primary mt-3 text-center">
        {messageKey ? t(messageKey) : t("messaging.thread.attachmentUnsupported")}
      </span>
      <span className="text-xs text-gray-500 mt-2 mb-4">{sizeLabel}</span>
      {mode === "acknowledged" && (
        <Button
          label={t("messaging.thread.openAttachment")}
          onPress={onShare}
          loading={isSharing}
          disabled={isSharing}
          accessibilityHint={t("common.hints.opensShareSheet")}
        />
      )}
    </div>
  );
}
