import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { Spinner } from "@/src/shared/components/Spinner";
import { EmptyState } from "@/src/shared/components/EmptyState";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Badge } from "@/src/shared/components/Badge";
import { Card } from "@/src/shared/components/Card";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { SectionTitle } from "@/src/shared/components/Typography";
import { useToast } from "@/src/shared/components/Toast";
import { colors } from "@/src/shared/theme/colors";
import { formatReceiptSize, formatTransactionDate, oneLine } from "../services/format";
import { attachmentChipPresentation } from "../services/attachmentGate";
import { topicLabelKey } from "../services/topics";
import { systemMessageTextKey } from "../services/systemMessage";
import { useThread } from "../hooks/useThread";
import { BODY_MAX_LENGTH, MAX_ATTACHMENTS } from "../services/rules";
import { describeRequestContext, parseContextJson } from "../services/requestContext";
import { ActionSheetAlert } from "./ActionSheetAlert";
import type { Message, MessageAttachment, MessageThreadDetail, MessageThreadKind } from "../types";

/** `useSafeAreaInsets().bottom` inside the phone frame; there is no keyboard on the web. */
const INSETS_BOTTOM = 34;

export function ThreadScreen() {
  const { threadId = "" } = useParams<{ threadId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const insets = { bottom: INSETS_BOTTOM };
  const keyboardVisible = false;
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);

  const { thread, isLoading, isError, refetch, replyBody, setReplyBody, replyError, attachments, canReply, isSendingReply, sendReply } =
    useThread(threadId);

  const [downloadingId] = useState<string | null>(null);

  // Bottom-anchor the message list when a new message arrives.
  const messageCount = thread?.messages.length ?? 0;
  useEffect(() => {
    const el = scrollViewRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messageCount]);

  const openAttachment = (attachment: MessageAttachment) => {
    if (!attachmentChipPresentation(attachment).pressable) return;
    if (attachment.contentType.startsWith("image/")) {
      navigate(`/messages/${threadId}/attachment/${attachment.id}`);
      return;
    }
    // The app downloads and opens the share sheet for a PDF. The wireframe
    // opens the viewer's acknowledged-PDF state instead.
    toast.show(t("common.hints.opensShareSheet"));
    navigate(`/messages/${threadId}/attachment/${attachment.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={t("messaging.thread.title")} />
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </div>
      </div>
    );
  }

  if (isError || !thread) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={t("messaging.thread.title")} />
        <div className="flex-1 items-center justify-center px-8">
          <InlineErrorState message={t("messaging.thread.loadError")} onRetry={() => void refetch()} />
        </div>
      </div>
    );
  }

  return (
    <KeyboardAvoidingScreen style={{ height: "100%" }}>
      <ScreenHeader
        title={thread.subject || t("messaging.inbox.noSubject")}
        rightElement={<Badge label={t(topicLabelKey(thread.topic))} tone="info" />}
      />

      <ScreenScrollView ref={scrollViewRef} bottomExtra={8} contentContainerStyle={{ paddingTop: 16 }}>
        <ThreadRequestContextCard thread={thread} />
        {thread.messages.length === 0 ? (
          <EmptyState title={t("messaging.thread.empty")} />
        ) : (
          thread.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              threadKind={thread.kind}
              onOpenAttachment={openAttachment}
              downloadingAttachmentId={downloadingId}
            />
          ))
        )}
      </ScreenScrollView>

      {thread.isArchived && (
        <div className="px-4 py-2 bg-info-tint border-t border-gray-100">
          <span className="text-xs text-brand-secondary text-center">{t("messaging.thread.archivedBanner")}</span>
        </div>
      )}

      <div
        className="px-4 pt-2 border-t border-gray-100 bg-brand-surface"
        style={{ paddingBottom: keyboardVisible ? 8 : insets.bottom + 8 }}
      >
        {attachments.drafts.length > 0 && (
          <div className="flex-row flex-wrap gap-2 mb-2">
            {attachments.drafts.map((draft) => (
              <div key={draft.localId} className="flex-row items-center bg-brand-background rounded-full px-3 py-1.5">
                <span className="text-xs text-brand-primary mr-1" style={oneLine}>
                  {draft.fileName}
                </span>
                {draft.status === "uploading" && <Spinner size="small" />}
                {draft.status === "error" && (
                  <button
                    type="button"
                    onClick={() => void attachments.retryUpload(draft.localId)}
                    style={{ padding: 4 }}
                    aria-label={t("messaging.compose.retryUpload")}
                  >
                    <Icon name="refresh" size={14} color={colors.brand.accent} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void attachments.removeAttachment(draft.localId)}
                  style={{ padding: 4 }}
                  aria-label={t("messaging.compose.removeAttachment", { fileName: draft.fileName })}
                >
                  <Icon name="close-circle" size={16} color={colors.neutral[500]} />
                </button>
              </div>
            ))}
          </div>
        )}

        {attachments.error && (
          <span className="text-xs mb-1" style={{ color: colors.error }} role="alert">
            {t(`messaging.errors.attachment.${attachments.error}`)}
          </span>
        )}

        {replyError && (
          <span className="text-xs mb-1" style={{ color: colors.error }} role="alert">
            {replyError}
          </span>
        )}

        <div className="flex-row items-end gap-2">
          <button
            type="button"
            onClick={() => setAttachMenuOpen(true)}
            disabled={!attachments.canAddMore || attachments.isBusy}
            style={{ padding: 8 }}
            aria-label={t("messaging.thread.attach")}
            title={t("messaging.thread.attachHint")}
          >
            <Icon name="attach" size={22} color={attachments.canAddMore ? colors.brand.accent : colors.neutral[300]} />
          </button>

          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder={t("messaging.thread.replyPlaceholder")}
            maxLength={BODY_MAX_LENGTH}
            rows={1}
            className="flex-1 rounded-2xl px-3 py-2.5 bg-brand-background text-base text-brand-primary"
            style={{ maxHeight: 120, resize: "none", outline: "none" }}
            aria-label={t("messaging.thread.replyPlaceholder")}
          />

          <button
            type="button"
            onClick={() => void sendReply()}
            disabled={!canReply}
            style={{ padding: 8, opacity: canReply ? 1 : 0.4 }}
            aria-label={t("messaging.thread.send")}
            title={t("messaging.thread.sendHint")}
          >
            {isSendingReply ? <Spinner size="small" /> : <Icon name="send" size={22} color={colors.brand.accent} />}
          </button>
        </div>

        {attachments.drafts.length >= MAX_ATTACHMENTS && (
          <span className="text-xs text-gray-500 mt-1">{t("messaging.compose.attachmentsHelp", { max: MAX_ATTACHMENTS })}</span>
        )}
      </div>

      {attachMenuOpen && (
        <ActionSheetAlert
          title={t("messaging.thread.attach")}
          onDismiss={() => setAttachMenuOpen(false)}
          buttons={[
            { text: t("messaging.compose.takePhoto"), onPress: () => void attachments.captureFromCamera() },
            { text: t("messaging.compose.chooseFromLibrary"), onPress: () => void attachments.addFromLibrary() },
            { text: t("messaging.compose.attachPdf"), onPress: () => void attachments.addDocument() },
            { text: t("common.cancel"), style: "cancel" },
          ]}
        />
      )}
    </KeyboardAvoidingScreen>
  );
}

/** The "About this request" card for a typed thread (claim submission, denial question, advisor handoff). */
function ThreadRequestContextCard({ thread }: { thread: MessageThreadDetail }) {
  const { t } = useTranslation();

  if (thread.kind === "general") return null;
  const context = parseContextJson(thread.contextJson);
  const description = describeRequestContext(thread.kind, context);
  if (!description) return null;

  return (
    <Card className="mb-3" accessibilityRole="region" accessibilityLabel={t(description.titleKey)}>
      <SectionTitle className="mb-2">{t(description.titleKey)}</SectionTitle>
      {description.rows.map((row) => (
        <KeyValueRow key={row.labelKey} label={t(row.labelKey)} value={row.valueKey ? t(row.valueKey) : (row.value ?? "")} />
      ))}
    </Card>
  );
}

interface MessageBubbleProps {
  message: Message;
  threadKind: MessageThreadKind;
  onOpenAttachment: (attachment: MessageAttachment) => void;
  downloadingAttachmentId: string | null;
}

/** The automatic acknowledgement (ADR-197): centred, muted, rendered from i18n by thread kind. */
function SystemMessageNote({ message, threadKind }: { message: Message; threadKind: MessageThreadKind }) {
  const { t } = useTranslation();
  const text = t(systemMessageTextKey(threadKind));

  return (
    <div className="mb-3 px-4 items-center">
      <span className="text-xs text-gray-500 mb-1 text-center">{t("messaging.thread.systemLabel")}</span>
      <span className="text-sm text-gray-600 text-center">{text}</span>
      <span className="text-xs text-gray-500 mt-1 text-center">{formatTransactionDate(message.createdAtUtc)}</span>
    </div>
  );
}

function MessageBubble({ message, threadKind, onOpenAttachment, downloadingAttachmentId }: MessageBubbleProps) {
  if (message.senderKind === "system") {
    return <SystemMessageNote message={message} threadKind={threadKind} />;
  }

  const isMember = message.senderKind === "member";

  return (
    <div className={`mb-3 ${isMember ? "items-end" : "items-start"}`}>
      <span className="text-xs text-gray-500 mb-1 mx-1">
        {message.senderDisplayName} · {formatTransactionDate(message.createdAtUtc)}
      </span>
      <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] ${isMember ? "bg-brand-accent" : "bg-brand-surface border border-gray-100"}`}>
        <span className={`text-sm ${isMember ? "text-white" : "text-brand-primary"}`}>{message.body}</span>
      </div>

      {message.attachments.length > 0 && (
        <div className="flex-row flex-wrap gap-2 mt-1.5 max-w-[85%]">
          {message.attachments.map((attachment) => (
            <AttachmentChip
              key={attachment.id}
              attachment={attachment}
              onOpen={onOpenAttachment}
              isDownloading={downloadingAttachmentId === attachment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** One attachment on a message; the scan verdict decides whether it can be pressed (ADR-202). */
function AttachmentChip({
  attachment,
  onOpen,
  isDownloading,
}: {
  attachment: MessageAttachment;
  onOpen: (attachment: MessageAttachment) => void;
  isDownloading: boolean;
}) {
  const { t } = useTranslation();
  const presentation = attachmentChipPresentation(attachment);
  const isImage = attachment.contentType.startsWith("image/");
  const size = formatReceiptSize(attachment.sizeBytes);
  const statusLabel = presentation.labelKey ? t(presentation.labelKey) : null;

  const chipStyle = {
    alignItems: "flex-start" as const,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: statusLabel ? 16 : 999,
    border: `1px solid ${colors.border}`,
  };

  const iconName =
    presentation.scanStatus === "malicious"
      ? "alert-circle-outline"
      : presentation.scanStatus === "pending"
        ? "time-outline"
        : isImage
          ? "image-outline"
          : "document-text-outline";

  const nameClasses = [
    "text-xs ml-1.5",
    presentation.pressable ? "text-brand-accent" : "text-gray-500",
    presentation.strikethrough ? "line-through" : "",
  ].join(" ");

  const body = (
    <>
      <div className="flex-row items-center">
        {isDownloading ? (
          <Spinner size="small" />
        ) : (
          <Icon name={iconName} size={16} color={presentation.pressable ? colors.brand.accent : colors.neutral[500]} />
        )}
        <span className={nameClasses} style={oneLine}>
          {attachment.fileName}
        </span>
        {statusLabel === null && (
          <span className="text-xs text-gray-500 ml-1.5">{t(`spendingClaims.receipt.size.${size.unit}`, { value: size.value })}</span>
        )}
      </div>
      {statusLabel !== null && presentation.tone !== null && (
        <div className="mt-1">
          <Badge label={statusLabel} tone={presentation.tone} />
        </div>
      )}
    </>
  );

  if (presentation.scanStatus === "malicious") {
    return (
      <div style={chipStyle} role="note" aria-label={`${attachment.fileName}. ${statusLabel}`}>
        {body}
      </div>
    );
  }

  const openLabel = isImage
    ? t("messaging.thread.viewAttachment", { fileName: attachment.fileName })
    : t("messaging.thread.shareAttachment", { fileName: attachment.fileName });

  return (
    <button
      type="button"
      onClick={() => onOpen(attachment)}
      disabled={isDownloading || presentation.disabled}
      style={chipStyle}
      aria-disabled={presentation.disabled}
      aria-label={statusLabel ? `${attachment.fileName}. ${statusLabel}` : openLabel}
      title={presentation.pressable && !isImage ? t("common.hints.opensShareSheet") : undefined}
    >
      {body}
    </button>
  );
}
