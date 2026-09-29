/**
 * Web stand-in for `useCompose`. Reads `?subject=` (and `?topic=`) the way the
 * app's prefilled-compose deep links do (ADR-196). `?state=attachments` seeds
 * attachment chips (uploaded / uploading / failed); `?state=invalid` shows the
 * inline field errors a failed send would.
 */
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { t } from "@/src/shared/i18n";
import { REGARDING_OPTIONS } from "../placeholder";
import { TOPICS } from "../services/topics";
import type { MessageTopic } from "../types";
import { sampleDrafts, useMessageAttachments } from "./useMessageAttachments";
import { useScreenState } from "./useScreenState";
import type { RequestContextDescription } from "../services/requestContext";

type FieldErrors = Partial<Record<"topic" | "subject" | "body", string>>;

export function useCompose() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const state = useScreenState(["attachments", "invalid"] as const);
  const topicParam = params.get("topic");
  const initialTopic = TOPICS.some((x) => x.key === topicParam) ? (topicParam as MessageTopic) : "";

  const [topic, setTopic] = useState<MessageTopic | "">(initialTopic);
  const [subject, setSubject] = useState(params.get("subject") ?? "");
  const [body, setBody] = useState("");
  const [regardingMemberId, setRegardingMemberId] = useState<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(() =>
    state === "invalid"
      ? {
          topic: t("messaging.errors.topicInvalid"),
          subject: t("messaging.errors.subjectRequired"),
          body: t("messaging.errors.bodyRequired"),
        }
      : {}
  );
  const attachments = useMessageAttachments(state === "attachments" ? sampleDrafts() : []);

  const validate = (): FieldErrors => ({
    ...(topic === "" ? { topic: t("messaging.errors.topicInvalid") } : {}),
    ...(subject.trim() === "" ? { subject: t("messaging.errors.subjectRequired") } : {}),
    ...(body.trim() === "" ? { body: t("messaging.errors.bodyRequired") } : {}),
  });

  const send = async () => {
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    navigate("/messages", { replace: true });
  };

  return {
    topic,
    setTopic,
    subject,
    setSubject,
    body,
    setBody,
    regardingMemberId,
    setRegardingMemberId,
    regardingOptions: REGARDING_OPTIONS,
    showRegardingPicker: REGARDING_OPTIONS.length > 0,
    isTopicLocked: false,
    requestContext: null as RequestContextDescription | null,
    fieldErrors,
    formError: null as string | null,
    attachments,
    canSend: !attachments.drafts.some((d) => d.status === "uploading"),
    isSending: false,
    send,
    shouldGuardDiscard: subject !== "" || body !== "" || attachments.drafts.length > 0,
    discardAttachments: attachments.clear,
  };
}
