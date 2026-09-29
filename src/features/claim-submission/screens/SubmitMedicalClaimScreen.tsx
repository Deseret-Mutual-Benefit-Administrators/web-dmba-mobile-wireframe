/**
 * The "Submit a claim" (medical) flow — a step machine over one form. A
 * successful submit replace-navigates to the new message thread.
 *
 * Web: the app puts Back in the native header's left slot (only once there is a
 * step to go back to). The shared ModalSheet header has no left slot, so the
 * button is portalled into the sheet at the header's position. The discard
 * guard (swipe-down / Android back) has no web equivalent and is not ported.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Button } from "@/src/shared/components/Button";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { colors } from "@/src/shared/theme/colors";
import { useSubmitMedicalClaimFlow } from "../hooks/useSubmitMedicalClaimFlow";
import { firstErrorForField } from "../services/claimSubmissionValidation";
import { AttachmentsStep } from "../components/AttachmentsStep";
import { ClaimDetailsStep } from "../components/ClaimDetailsStep";
import { ClaimSubmissionStepProgress } from "../components/ClaimSubmissionStepProgress";
import { PatientStep } from "../components/PatientStep";
import { ReviewStep } from "../components/ReviewStep";

const HOME_INDICATOR = 34;
/** ModalSheet: 6px grabber padding + 5px grabber above its 50px header. */
const SHEET_HEADER_TOP = 11;
const SHEET_HEADER_HEIGHT = 50;

export function SubmitMedicalClaimScreen() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sheet, setSheet] = useState<HTMLElement | null>(null);
  const flow = useSubmitMedicalClaimFlow();

  useEffect(() => {
    setSheet(rootRef.current?.closest<HTMLElement>('[role="dialog"]') ?? null);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [flow.step]);

  const patientError = firstErrorForField(flow.validationIssues, "patient");
  const billAttachmentError = firstErrorForField(flow.validationIssues, "billAttachment");

  return (
    <div ref={rootRef} className="flex-1 bg-brand-background h-full min-h-0">
      {sheet && flow.canGoBack
        ? createPortal(
            <button
              type="button"
              onClick={flow.goBack}
              className="absolute left-4 justify-center active:opacity-70"
              style={{ top: SHEET_HEADER_TOP, height: SHEET_HEADER_HEIGHT, zIndex: 2 }}
              aria-label={t("common.back")}
            >
              <Icon name="chevron-back" size={26} color={colors.brand.accent} />
            </button>,
            sheet
          )
        : null}

      <ClaimSubmissionStepProgress step={flow.step} />

      <KeyboardAvoidingScreen className="flex-1 min-h-0">
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
          <div style={{ paddingTop: 12, paddingBottom: 24 }}>
            {flow.step === "patient" && (
              <PatientStep
                value={flow.values.patientMemberId}
                options={flow.patientOptions}
                onSelect={(memberId) => flow.setValue("patientMemberId", memberId)}
                error={patientError ? t(patientError.messageKey) : null}
                disabled={flow.isSubmitting}
              />
            )}

            {flow.step === "details" && (
              <ClaimDetailsStep
                values={flow.values}
                onChange={flow.setValue}
                issues={flow.validationIssues}
                disabled={flow.isSubmitting}
              />
            )}

            {flow.step === "attachments" && (
              <AttachmentsStep
                billAttachments={flow.billAttachments}
                proofAttachments={flow.proofAttachments}
                maxCombined={flow.maxAttachmentsCombined}
                billError={billAttachmentError ? t(billAttachmentError.messageKey) : null}
              />
            )}

            {flow.step === "review" && (
              <ReviewStep
                values={flow.values}
                patient={flow.selectedPatient}
                billAttachmentCount={flow.billAttachments.uploadedAttachmentIds.length}
                proofAttachmentCount={flow.proofAttachments.uploadedAttachmentIds.length}
                formError={flow.formError}
              />
            )}
          </div>
        </div>

        {/* Footer action bar — clears the home indicator. */}
        <div
          className="px-4 pt-3 flex-row items-center"
          style={{
            borderTopWidth: 1,
            borderTopStyle: "solid",
            borderTopColor: colors.border,
            backgroundColor: colors.brand.surface,
            paddingBottom: HOME_INDICATOR + 12,
          }}
        >
          <Button
            label={
              flow.isSubmitting
                ? t("claimSubmission.submitting")
                : flow.step === "review"
                  ? t("claimSubmission.submit")
                  : t("claimSubmission.continue")
            }
            onPress={() => {
              if (flow.step === "review") {
                void flow.submit();
                return;
              }
              flow.goNext();
            }}
            loading={flow.isSubmitting}
            disabled={!flow.canAdvance}
            fullWidth
          />
        </div>
      </KeyboardAvoidingScreen>
    </div>
  );
}
