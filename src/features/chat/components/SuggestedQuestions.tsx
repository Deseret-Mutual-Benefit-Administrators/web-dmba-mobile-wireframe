import { useTranslation } from "@/src/shared/i18n";
import { Label } from "@/src/shared/components/Typography";
import { resolveSuggestedQuestions } from "../services/suggestedQuestions";

interface SuggestedQuestionsProps {
  serverQuestions: string[] | undefined;
  onSelect: (question: string) => void;
  disabled: boolean;
}

/** The starter-prompt list shown only before the first turn. */
export function SuggestedQuestions({ serverQuestions, onSelect, disabled }: SuggestedQuestionsProps) {
  const { t } = useTranslation();
  const resolved = resolveSuggestedQuestions(serverQuestions);
  const questions = resolved.source === "server" ? resolved.questions : resolved.questionKeys.map((key) => t(key));

  return (
    <div className="mb-3">
      <Label className="mb-2">{t("chat.suggested.title")}</Label>
      <div className="gap-2">
        {questions.map((question) => (
          <button
            type="button"
            key={question}
            onClick={() => onSelect(question)}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1, textAlign: "left" }}
            className="rounded-xl border border-gray-200 bg-brand-surface px-3.5 py-2.5"
            aria-label={question}
            title={t("chat.suggested.hint")}
          >
            <span className="text-sm text-brand-primary">{question}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
