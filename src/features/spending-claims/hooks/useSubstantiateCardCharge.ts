/**
 * Placeholder stand-in for the app's `spending-claims/hooks/useSubstantiateCardCharge.ts`:
 * pick the charge, photograph the receipt, done.
 *
 * `?state=loading|error|empty|offline` reaches the other states. A
 * `transactionId` that matches a candidate starts on the capture step.
 */
import { useCallback, useState } from "react";
import { useMoneyState } from "@/src/features/financial-accounts/api/accountsQueries";
import { t } from "@/src/shared/i18n";
import { schema, substantiationCandidates, template } from "../placeholder";
import type { SubstantiationStep } from "../services/cardSubstantiation";
import type { CapturedReceipt } from "../types";

export function useSubstantiateCardCharge({ preselectedTransactionId }: { preselectedTransactionId?: string | null }) {
  const state = useMoneyState();
  const candidates = state === "empty" ? [] : substantiationCandidates;
  const preselected = candidates.find((charge) => charge.id === preselectedTransactionId) ?? null;

  const [step, setStep] = useState<SubstantiationStep>(preselected ? "capture" : "pick");
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(preselected?.id ?? null);
  const [receipts, setReceipts] = useState<CapturedReceipt[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const isOffline = state === "offline";
  const selectedCharge = candidates.find((charge) => charge.id === selectedTransactionId) ?? null;

  const canAdvance =
    !isUploading && (step === "pick" ? selectedCharge !== null : step === "capture" ? receipts.length > 0 && !isOffline : true);

  const goNext = useCallback(async () => {
    if (step === "pick") {
      setStep("capture");
      return;
    }
    if (step === "capture") {
      setIsUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsUploading(false);
      setStep("done");
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step === "capture") setStep("pick");
  }, [step]);

  return {
    isLoading: state === "loading",
    loadError: state === "error",
    refetch: async () => {},
    receiptConfig:
      state === "loading" || state === "error"
        ? null
        : {
            acceptedContentTypes: schema.receipt.acceptedContentTypes,
            maxBytes: schema.receipt.maxBytes,
            attachLabel: schema.receipt.attachLabel,
            receiptInstructionText: template.receiptInstructionText,
          },
    step,
    candidates,
    selectedTransactionId,
    selectedCharge,
    select: setSelectedTransactionId,
    canLoadMore: candidates.length > 0,
    isLoadingMore: false,
    loadMore: () => {},
    receipts,
    setReceipts,
    isUploading,
    isOffline,
    canAdvance,
    goNext,
    goBack,
    primaryActionLabel: step === "capture" ? t("spendingClaims.substantiate.send") : t("spendingClaims.continue"),
  };
}
