/**
 * Two attachment groups: the itemized bill (required) and proof of payment
 * (optional). `canAddMore` is gated on the combined count across both groups.
 */
import type { CSSProperties } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors } from "@/src/shared/theme/colors";
import { formatReceiptSize } from "../services/receiptSize";
import type { useMessageAttachments } from "../hooks/useMessageAttachments";

type Attachments = ReturnType<typeof useMessageAttachments>;

const addButtonStyle: CSSProperties = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: colors.border,
};

interface AttachmentGroupProps {
  attachments: Attachments;
  titleKey: string;
  helpKey: string;
  required: boolean;
  canAddMore: boolean;
  error?: string | null;
}

function AttachmentGroup({ attachments, titleKey, helpKey, required, canAddMore, error }: AttachmentGroupProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-5">
      <div className="flex-row items-center mb-1.5">
        <span className="text-sm font-medium text-brand-primary">{t(titleKey)}</span>
        {required && (
          <span className="text-sm ml-0.5" style={{ color: colors.error }} aria-hidden="true">
            *
          </span>
        )}
      </div>
      <span className="text-xs text-gray-500 mb-2">{t(helpKey)}</span>

      {attachments.drafts.map((draft) => (
        <div key={draft.localId} className="flex-row items-center bg-brand-surface rounded-xl px-3 py-2.5 mb-2 border border-gray-100">
          <Icon
            name={draft.contentType === "application/pdf" ? "document-text-outline" : "image-outline"}
            size={20}
            color={colors.neutral[500]}
          />
          <div className="flex-1 ml-2 min-w-0">
            <span className="text-sm text-brand-primary truncate">{draft.fileName}</span>
            <span className="text-xs text-gray-500">
              {(() => {
                const size = formatReceiptSize(draft.sizeBytes);
                return t(`spendingClaims.receipt.size.${size.unit}`, { value: size.value });
              })()}
              {draft.status === "error" ? ` · ${t("messaging.compose.attachmentFailed")}` : ""}
            </span>
          </div>
          {draft.status === "uploading" && <Spinner size="small" />}
          {draft.status === "error" && (
            <button
              type="button"
              onClick={() => void attachments.retryUpload(draft.localId)}
              style={{ padding: 6, marginRight: 4 }}
              aria-label={t("messaging.compose.retryUpload")}
            >
              <Icon name="refresh" size={18} color={colors.brand.accent} />
            </button>
          )}
          <button
            type="button"
            onClick={() => void attachments.removeAttachment(draft.localId)}
            style={{ padding: 6 }}
            aria-label={t("messaging.compose.removeAttachment", { fileName: draft.fileName })}
          >
            <Icon name="close-circle" size={18} color={colors.neutral[500]} />
          </button>
        </div>
      ))}

      {attachments.error && (
        <span className="text-xs mb-2" style={{ color: colors.error }} role="alert">
          {t(`messaging.errors.attachment.${attachments.error}`)}
        </span>
      )}

      {error && (
        <span className="text-xs mb-2" style={{ color: colors.error }} role="alert">
          {error}
        </span>
      )}

      {canAddMore && (
        <div className="flex-row gap-2">
          <button
            type="button"
            onClick={() => void attachments.captureFromCamera()}
            disabled={attachments.isBusy}
            style={addButtonStyle}
            aria-label={t("messaging.compose.takePhoto")}
            title={t("common.hints.opensCamera")}
          >
            <Icon name="camera-outline" size={18} color={colors.brand.accent} />
            <span className="text-sm text-brand-accent font-medium ml-1.5">{t("messaging.compose.takePhoto")}</span>
          </button>
          <button
            type="button"
            onClick={() => void attachments.addFromLibrary()}
            disabled={attachments.isBusy}
            style={addButtonStyle}
            aria-label={t("messaging.compose.chooseFromLibrary")}
            title={t("common.hints.opensPhotoLibrary")}
          >
            <Icon name="images-outline" size={18} color={colors.brand.accent} />
            <span className="text-sm text-brand-accent font-medium ml-1.5">{t("messaging.compose.chooseFromLibrary")}</span>
          </button>
          <button
            type="button"
            onClick={() => void attachments.addDocument()}
            disabled={attachments.isBusy}
            style={addButtonStyle}
            aria-label={t("messaging.compose.attachPdf")}
            title={t("common.hints.opensDocumentPicker")}
          >
            <Icon name="document-outline" size={18} color={colors.brand.accent} />
            <span className="text-sm text-brand-accent font-medium ml-1.5">{t("messaging.compose.attachPdf")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface AttachmentsStepProps {
  billAttachments: Attachments;
  proofAttachments: Attachments;
  maxCombined: number;
  billError?: string | null;
}

export function AttachmentsStep({ billAttachments, proofAttachments, maxCombined, billError }: AttachmentsStepProps) {
  const { t } = useTranslation();

  const totalCount = billAttachments.drafts.length + proofAttachments.drafts.length;
  const combinedCapReached = totalCount >= maxCombined;

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-1">{t("claimSubmission.attachments.title")}</span>
      <span className="text-sm text-gray-600 mb-4">{t("claimSubmission.attachments.subtitle")}</span>

      <AttachmentGroup
        attachments={billAttachments}
        titleKey="claimSubmission.attachments.bill"
        helpKey="claimSubmission.attachments.billHelp"
        required
        canAddMore={billAttachments.canAddMore && !combinedCapReached}
        error={billError}
      />
      <AttachmentGroup
        attachments={proofAttachments}
        titleKey="claimSubmission.attachments.proof"
        helpKey="claimSubmission.attachments.proofHelp"
        required={false}
        canAddMore={proofAttachments.canAddMore && !combinedCapReached}
      />

      {combinedCapReached && (
        <span className="text-xs text-gray-500 -mt-3">{t("claimSubmission.attachments.maxCombinedNote", { max: maxCombined })}</span>
      )}
    </div>
  );
}
