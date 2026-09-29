/**
 * The spending-account claim flow (FA-4): fork → what you'll need → category →
 * claimant → details → receipt → review → submitted. The fork comes first; the
 * card path leaves for `/substantiate` (replace, not push).
 *
 * Web: Back is portalled into the sheet header (see SheetBackButton); the
 * discard guard (swipe-down / Android back) has no web equivalent.
 */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { SelectField } from "@/src/shared/components/SelectField";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { colors } from "@/src/shared/theme/colors";
import { useMoneyState, useBenefitCards } from "@/src/features/financial-accounts/api/accountsQueries";
import { useSubmitClaimFlow } from "../hooks/useSubmitClaimFlow";
import { canSubstantiateCardCharge, previousStep } from "../services/claimFlowSteps";
import { ClaimDetailsForm } from "../components/ClaimDetailsForm";
import { ClaimPathFork } from "../components/ClaimPathFork";
import { ClaimReview } from "../components/ClaimReview";
import { ClaimStepProgress } from "../components/ClaimStepProgress";
import { CategoryPicker } from "../components/CategoryPicker";
import { ReceiptCapture } from "../components/ReceiptCapture";
import { ReceiptRequirementsCard } from "../components/ReceiptRequirementsCard";
import { VendorCopyBlock } from "../components/VendorCopyBlock";
import { WhatYouNeedChecklist } from "../components/WhatYouNeedChecklist";
import { formatClaimantName } from "../services/spendingClaimTransforms";
import { SheetBackButton } from "./SheetBackButton";

const HOME_INDICATOR = 34;

export function SubmitClaimScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const flow = useSubmitClaimFlow();
  const state = useMoneyState();

  const cardsQuery = useBenefitCards();
  const hasActiveCard =
    state !== "noCard" && canSubstantiateCardCharge((cardsQuery.data ?? []).map((card) => ({ cardEligible: card.status === "Active" })));

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

  if (flow.loadError || !flow.template || !flow.schema) {
    return (
      <div className="flex-1 bg-brand-background h-full">
        <div className="flex-1 items-center justify-center px-8">
          <span className="text-sm text-center text-brand-primary mb-4" role="alert" aria-label={t("spendingClaims.loadError")}>
            {t("spendingClaims.loadError")}
          </span>
          <Button label={t("common.retry")} onPress={() => flow.refetchTemplate()} />
        </div>
      </div>
    );
  }

  const { template, schema } = flow;

  const isCardPath = flow.path === "cardCharge";

  const claimantOptions = schema.claimants.map((claimant) => ({
    value: String(claimant.cardholderKey),
    label: formatClaimantName(claimant),
    secondary: claimant.isEmployee ? t("spendingClaims.claimant.self") : t("spendingClaims.claimant.dependent"),
  }));

  return (
    <div ref={rootRef} className="flex-1 bg-brand-background h-full" style={{ minHeight: 0 }}>
      <SheetBackButton anchorRef={rootRef} visible={previousStep(flow.step) !== null} onPress={flow.goBack} />
      <ClaimStepProgress step={flow.step} />

      <KeyboardAvoidingScreen className="flex-1">
        <div ref={scrollRef} className="flex-1 scrollbar-none" style={{ minHeight: 0, overflowY: "auto" }}>
          <div style={{ paddingBottom: 24 }}>
            {flow.step === "fork" && <ClaimPathFork selected={flow.path} onSelect={flow.choosePath} cardEligible={hasActiveCard} />}

            {flow.step === "whatYouNeed" && (
              <>
                <WhatYouNeedChecklist categoryCode={flow.values.serviceCategoryCode || null} />
                <div className="px-4 mt-4">
                  <VendorCopyBlock content={template.formInstructions} />
                </div>
              </>
            )}

            {flow.step === "category" && (
              <CategoryPicker
                categories={schema.categories}
                selected={flow.values.serviceCategoryCode}
                onSelect={(code) => flow.setValue("serviceCategoryCode", code)}
              />
            )}

            {flow.step === "claimant" && (
              <div className="px-4 pt-2">
                <span className="text-lg font-semibold text-brand-primary mb-1">{t("spendingClaims.claimant.question")}</span>
                <span className="text-sm text-gray-600 mb-4">{t("spendingClaims.claimant.subtitle")}</span>
                <SelectField
                  label={t("spendingClaims.fields.claimant")}
                  value={flow.values.claimantKey}
                  options={claimantOptions}
                  onSelect={(value) => flow.setValue("claimantKey", value)}
                  required
                  disabled={flow.isSubmitting}
                />
              </div>
            )}

            {flow.step === "details" && (
              <ClaimDetailsForm
                schema={schema}
                template={template}
                values={flow.values}
                onChange={flow.setValue}
                validation={flow.validation}
                serverErrors={flow.serverErrors}
                disabled={flow.isSubmitting}
              />
            )}

            {flow.step === "receipt" && (
              <>
                <ReceiptRequirementsCard />
                <div className="mt-2">
                  <ReceiptCapture
                    acceptedContentTypes={schema.receipt.acceptedContentTypes}
                    maxBytes={schema.receipt.maxBytes}
                    attachLabel={schema.receipt.attachLabel}
                    onPagesChange={flow.setReceipts}
                    retainPagesOnUnmount
                  />
                </div>
                <div className="px-4 mt-2">
                  <VendorCopyBlock content={template.receiptInstructionText} />
                </div>
              </>
            )}

            {flow.step === "review" && (
              <ClaimReview
                template={template}
                schema={schema}
                values={flow.values}
                receipts={flow.receipts}
                certified={flow.certified}
                onCertifiedChange={flow.setCertified}
                serverErrors={flow.serverErrors}
                disabled={flow.isSubmitting}
                isOffline={flow.isOffline}
              />
            )}

            {flow.step === "submitted" && (
              <div className="px-4 pt-6 items-center">
                <span aria-hidden="true" style={{ display: "flex" }}>
                  <Icon name="checkmark-circle" size={56} color={colors.success} />
                </span>
                <h2 className="text-lg font-semibold text-brand-primary mt-3 text-center">{t("spendingClaims.submitted.title")}</h2>
                <span className="text-sm text-gray-600 mt-1.5 text-center">{t("spendingClaims.submitted.subtitle")}</span>
                <div className="w-full mt-5">
                  <VendorCopyBlock content={template.confirmationText} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions — clears the home indicator. */}
        <div
          className="px-4 pt-3 flex-row items-center"
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.brand.surface,
            paddingBottom: HOME_INDICATOR + 12,
          }}
        >
          {flow.step === "submitted" ? (
            <Button label={t("common.done")} onPress={() => navigate(-1)} fullWidth />
          ) : (
            <Button
              label={flow.isSubmitting ? t("spendingClaims.submitting") : flow.primaryActionLabel}
              onPress={() => {
                if (flow.step === "review") {
                  void flow.submit();
                  return;
                }
                // The card path is a different vendor operation — it leaves this flow.
                if (flow.step === "fork" && isCardPath) {
                  navigate("/substantiate", { replace: true });
                  return;
                }
                flow.goNext();
              }}
              disabled={!flow.canAdvance || flow.isSubmitting}
              loading={flow.isSubmitting}
              fullWidth
            />
          )}
        </div>
      </KeyboardAvoidingScreen>
    </div>
  );
}
