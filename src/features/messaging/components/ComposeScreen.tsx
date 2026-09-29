import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { SelectField, type SelectOption } from "@/src/shared/components/SelectField";
import { FormFieldShell } from "@/src/shared/components/FormFieldShell";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Button } from "@/src/shared/components/Button";
import { Spinner } from "@/src/shared/components/Spinner";
import { Card } from "@/src/shared/components/Card";
import { Badge } from "@/src/shared/components/Badge";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { SectionTitle } from "@/src/shared/components/Typography";
import { composeFieldAccessibilityLabel } from "@/src/shared/services/formFieldLabel";
import { colors } from "@/src/shared/theme/colors";
import { formatReceiptSize, oneLine } from "../services/format";
import { useCompose } from "../hooks/useCompose";
import { TOPICS, topicLabelKey } from "../services/topics";
import { SUBJECT_MAX_LENGTH, BODY_MAX_LENGTH, MAX_ATTACHMENTS } from "../services/rules";
import type { MessageTopic, RegardingOption } from "../types";

/** Stand-ins for `family-permissions/services/familyPermissions` helpers (not in the extract). */
function fullName(option: RegardingOption): string {
  return `${option.firstName} ${option.lastName}`;
}
function relationshipLabelKey(relationship: string): string | null {
  return ["spouse", "child", "parent", "self", "subscriber"].includes(relationship)
    ? `familyPermissions.relationships.${relationship}`
    : null;
}

export function ComposeScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const compose = useCompose();
  const bodyInputRef = useRef<HTMLTextAreaElement>(null);

  // Claims topic, plain compose: point at the claim form (ADR-161).
  const showClaimSubmissionLink = compose.topic === "claims" && !compose.requestContext;

  const topicOptions: SelectOption[] = TOPICS.map((topic) => ({
    value: topic.key,
    label: t(topic.labelKey),
  }));

  const regardingOptions: SelectOption[] = compose.regardingOptions.map((option) => {
    const key = relationshipLabelKey(option.relationship);
    return {
      value: option.memberId,
      label: fullName(option),
      secondary: key ? t(key) : option.relationship,
    };
  });

  return (
    <KeyboardAvoidingScreen>
      <ScreenScrollView bottomExtra={16} contentContainerStyle={{ paddingTop: 16 }}>
        {compose.requestContext && (
          <Card className="mb-4" accessibilityRole="region" accessibilityLabel={t(compose.requestContext.titleKey)}>
            <SectionTitle className="mb-2">{t(compose.requestContext.titleKey)}</SectionTitle>
            {compose.requestContext.rows.map((row) => (
              <KeyValueRow key={row.labelKey} label={t(row.labelKey)} value={row.valueKey ? t(row.valueKey) : (row.value ?? "")} />
            ))}
          </Card>
        )}

        {compose.isTopicLocked ? (
          <div className="mb-4">
            <span className="text-sm font-medium text-brand-primary mb-1.5">{t("messaging.compose.topic")}</span>
            <Badge label={t(topicLabelKey(compose.topic as MessageTopic))} tone="info" testID="compose-locked-topic" />
          </div>
        ) : (
          <SelectField
            label={t("messaging.compose.topic")}
            value={compose.topic}
            options={topicOptions}
            onSelect={(value) => compose.setTopic(value as MessageTopic)}
            required
            error={compose.fieldErrors.topic ?? null}
            placeholder={t("messaging.compose.topicPlaceholder")}
          />
        )}

        {showClaimSubmissionLink && (
          <button
            type="button"
            onClick={() => navigate("/submit-claim")}
            style={{ marginBottom: 16, alignItems: "flex-start" }}
            aria-label={t("messaging.compose.claimSubmissionLink")}
            title={t("claims.submitClaimHint")}
          >
            <span className="text-sm text-brand-accent font-medium">{t("messaging.compose.claimSubmissionLink")}</span>
          </button>
        )}

        {compose.showRegardingPicker && (
          <SelectField
            label={t("messaging.compose.regarding")}
            value={compose.regardingMemberId ?? ""}
            options={regardingOptions}
            onSelect={(value) => compose.setRegardingMemberId(value || undefined)}
            helpText={t("messaging.compose.regardingHelp")}
            placeholder={t("messaging.compose.regardingPlaceholder")}
          />
        )}

        <FormFieldShell label={t("messaging.compose.subject")} required error={compose.fieldErrors.subject ?? null}>
          <input
            value={compose.subject}
            onChange={(e) => compose.setSubject(e.target.value)}
            maxLength={SUBJECT_MAX_LENGTH}
            enterKeyHint="next"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                bodyInputRef.current?.focus();
              }
            }}
            className="rounded-xl px-3 py-3 bg-brand-surface border text-base text-brand-primary"
            style={{ borderColor: compose.fieldErrors.subject ? colors.error : colors.border, outline: "none" }}
            aria-label={composeFieldAccessibilityLabel({
              label: t("messaging.compose.subject"),
              required: true,
              requiredText: t("forms.required"),
            })}
          />
        </FormFieldShell>

        <FormFieldShell label={t("messaging.compose.body")} required error={compose.fieldErrors.body ?? null}>
          <textarea
            ref={bodyInputRef}
            value={compose.body}
            onChange={(e) => compose.setBody(e.target.value)}
            rows={6}
            maxLength={BODY_MAX_LENGTH}
            className="rounded-xl px-3 py-3 bg-brand-surface border text-base text-brand-primary"
            style={{
              borderColor: compose.fieldErrors.body ? colors.error : colors.border,
              minHeight: 140,
              maxHeight: 160,
              resize: "none",
              outline: "none",
            }}
            aria-label={composeFieldAccessibilityLabel({
              label: t("messaging.compose.body"),
              required: true,
              requiredText: t("forms.required"),
            })}
          />
        </FormFieldShell>

        <AttachmentsSection compose={compose} />

        {compose.formError && (
          <span className="text-sm mb-3" style={{ color: colors.error }} role="alert">
            {compose.formError}
          </span>
        )}

        <Button
          label={t("messaging.compose.send")}
          onPress={() => void compose.send()}
          loading={compose.isSending}
          disabled={!compose.canSend}
          fullWidth
          className="mt-2"
          accessibilityHint={t("messaging.compose.sendHint")}
        />
      </ScreenScrollView>
    </KeyboardAvoidingScreen>
  );
}

const pickerButtonStyle = {
  flex: 1,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  paddingTop: 10,
  paddingBottom: 10,
  borderRadius: 12,
  border: `1px solid ${colors.border}`,
};

function AttachmentsSection({ compose }: { compose: ReturnType<typeof useCompose> }) {
  const { t } = useTranslation();
  const { attachments } = compose;

  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-brand-primary mb-1.5">{t("messaging.compose.attachments")}</span>
      <span className="text-xs text-gray-500 mb-2">{t("messaging.compose.attachmentsHelp", { max: MAX_ATTACHMENTS })}</span>

      {attachments.drafts.map((draft) => (
        <div key={draft.localId} className="flex-row items-center bg-brand-surface rounded-xl px-3 py-2.5 mb-2 border border-gray-100">
          <Icon name={draft.contentType === "application/pdf" ? "document-text-outline" : "image-outline"} size={20} color={colors.neutral[500]} />
          <div className="flex-1 ml-2" style={{ minWidth: 0 }}>
            <span className="text-sm text-brand-primary" style={oneLine}>
              {draft.fileName}
            </span>
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

      {attachments.canAddMore && (
        <div className="flex-row gap-2">
          <button
            type="button"
            onClick={() => void attachments.captureFromCamera()}
            disabled={attachments.isBusy}
            style={pickerButtonStyle}
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
            style={pickerButtonStyle}
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
            style={pickerButtonStyle}
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
