/**
 * Card-charge substantiation (FA-4, Phase 7): pick the charge, photograph the
 * receipt, done. No form, and no money moves.
 *
 * Web: Back is portalled into the sheet header (see SheetBackButton).
 */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { Card } from "@/src/shared/components/Card";
import { useSubstantiateCardCharge } from "../hooks/useSubstantiateCardCharge";
import { previousSubstantiationStep } from "../services/cardSubstantiation";
import { ReceiptCapture } from "../components/ReceiptCapture";
import { ReceiptRequirementsCard } from "../components/ReceiptRequirementsCard";
import { UnsubstantiatedChargeList } from "../components/UnsubstantiatedChargeList";
import { VendorCopyBlock } from "../components/VendorCopyBlock";
import { formatCurrency, formatTransactionDate } from "@/src/features/financial-accounts/services/accountTransforms";
import { oneLine } from "@/src/features/financial-accounts/components/textStyles";
import { SheetBackButton } from "./SheetBackButton";

const HOME_INDICATOR = 34;

export interface SubstantiateCardChargeScreenProps {
  /** A charge id to start on, from the "Send a receipt" action on a transaction row. */
  preselectedTransactionId?: string | null;
}

export function SubstantiateCardChargeScreen({ preselectedTransactionId }: SubstantiateCardChargeScreenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const flow = useSubstantiateCardCharge({ preselectedTransactionId });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [flow.step]);

  if (flow.isLoading) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
        </div>
      </div>
    );
  }

  if (flow.loadError || !flow.receiptConfig) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <div className="flex-1 items-center justify-center px-8">
          <span className="text-sm text-center text-brand-primary mb-4" role="alert" aria-label={t("spendingClaims.substantiate.loadError")}>
            {t("spendingClaims.substantiate.loadError")}
          </span>
          <Button label={t("common.retry")} onPress={() => void flow.refetch()} />
        </div>
      </div>
    );
  }

  const { receiptConfig, selectedCharge } = flow;

  return (
    <div ref={rootRef} className="flex-1 bg-brand-background h-full" style={{ minHeight: 0 }}>
      <SheetBackButton anchorRef={rootRef} visible={previousSubstantiationStep(flow.step) !== null} onPress={flow.goBack} />

      <KeyboardAvoidingScreen className="flex-1">
        <div ref={scrollRef} className="flex-1 scrollbar-none" style={{ minHeight: 0, overflowY: "auto" }}>
          <div style={{ paddingBottom: 24 }}>
            {flow.step === "pick" && (
              <UnsubstantiatedChargeList
                charges={flow.candidates}
                selectedTransactionId={flow.selectedTransactionId}
                onSelect={flow.select}
                canLoadMore={flow.canLoadMore}
                isLoadingMore={flow.isLoadingMore}
                onLoadMore={flow.loadMore}
                disabled={flow.isUploading}
              />
            )}

            {flow.step === "capture" && (
              <>
                {selectedCharge && (
                  <Card className="mx-4 mt-3">
                    <span className="text-xs text-gray-500 mb-0.5">{t("spendingClaims.substantiate.capture.documenting")}</span>
                    <span className="text-sm font-semibold text-brand-primary" style={oneLine}>
                      {selectedCharge.merchantName ?? selectedCharge.description}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(Math.abs(selectedCharge.amount))} · {formatTransactionDate(selectedCharge.date)}
                    </span>
                  </Card>
                )}

                <ReceiptRequirementsCard />

                <ReceiptCapture
                  acceptedContentTypes={receiptConfig.acceptedContentTypes}
                  maxBytes={receiptConfig.maxBytes}
                  attachLabel={receiptConfig.attachLabel}
                  onPagesChange={flow.setReceipts}
                />

                <div className="px-4 mt-2">
                  <VendorCopyBlock content={receiptConfig.receiptInstructionText} />
                </div>

                {flow.isOffline && (
                  <div className="mx-4 mt-3 bg-amber-50 rounded-xl px-3 py-3" role="alert">
                    <span className="text-xs text-amber-900">{t("spendingClaims.substantiate.capture.offlineBlock")}</span>
                  </div>
                )}
              </>
            )}

            {flow.step === "done" && (
              <div className="px-4 pt-6 items-center">
                <span aria-hidden="true" style={{ display: "flex" }}>
                  <Icon name="checkmark-circle" size={56} color={colors.success} />
                </span>
                <h2 className="text-lg font-semibold text-brand-primary mt-3 text-center">{t("spendingClaims.substantiate.done.title")}</h2>
                <span className="text-sm text-gray-600 mt-1.5 text-center">{t("spendingClaims.substantiate.done.subtitle")}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className="px-4 pt-3 flex-row items-center"
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.brand.surface,
            paddingBottom: HOME_INDICATOR + 12,
          }}
        >
          {flow.step === "done" ? (
            <Button label={t("common.done")} onPress={() => navigate(-1)} fullWidth />
          ) : (
            <Button
              label={flow.isUploading ? t("spendingClaims.substantiate.sending") : flow.primaryActionLabel}
              onPress={() => void flow.goNext()}
              disabled={!flow.canAdvance}
              loading={flow.isUploading}
              fullWidth
            />
          )}
        </div>
      </KeyboardAvoidingScreen>
    </div>
  );
}
