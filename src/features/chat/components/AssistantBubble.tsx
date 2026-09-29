import { useTranslation } from "@/src/shared/i18n";
import { Button } from "@/src/shared/components/Button";
import { Caption } from "@/src/shared/components/Typography";
import { oneLine } from "@/src/features/messaging/services/format";
import { chatBubbleClasses, citationChipClasses } from "../services/chatBubbleClasses";
import { toCitationChips } from "../services/citations";
import { MiniMarkdown } from "./MiniMarkdown";
import type { Citation, ChatTurnOutcome } from "../types";

interface AssistantBubbleProps {
  content: string;
  citations: Citation[];
  outcome: ChatTurnOutcome;
  handoffOffered: boolean;
  onHandoff: () => void;
  isSendingHandoff: boolean;
  /** Citation chip tapped with its Coverage-page href — the host decides how to open it. */
  onOpenCitation: (href: string) => void;
}

/**
 * The assistant's reply bubble — left-aligned, surface fill, Markdown body,
 * a citation-chip row, and a "Send this to Member Services" CTA when the turn
 * offered one.
 */
export function AssistantBubble({
  content,
  citations,
  outcome,
  handoffOffered,
  onHandoff,
  isSendingHandoff,
  onOpenCitation,
}: AssistantBubbleProps) {
  const { t } = useTranslation();
  const classes = chatBubbleClasses("assistant");
  const chips = toCitationChips(citations);

  return (
    <div className={classes.wrapper}>
      <div className={classes.bubble}>
        <MiniMarkdown>{content}</MiniMarkdown>

        {chips.length > 0 && (
          <div className={citationChipClasses.row}>
            {chips.map((chip) => (
              <button
                type="button"
                key={chip.sectionId}
                onClick={() => onOpenCitation(chip.href)}
                className={citationChipClasses.chip}
                role="link"
                aria-label={t("chat.citations.source", { title: chip.title })}
                style={{ maxWidth: "100%" }}
              >
                <span className={citationChipClasses.label} style={oneLine}>
                  {chip.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {outcome === "refused" && <Caption className="mt-2">{t("chat.refusal")}</Caption>}

        {handoffOffered && (
          <Button
            variant="ghost"
            size="sm"
            label={t("chat.talkToPerson")}
            onPress={onHandoff}
            loading={isSendingHandoff}
            className="mt-2 self-start"
            accessibilityHint={t("common.hints.opensNewMessage")}
          />
        )}
      </div>
    </div>
  );
}
