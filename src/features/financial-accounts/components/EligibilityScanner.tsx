import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { useMoneyState, useProductEligibility } from "../api/accountsQueries";
import { normalizeProductCode, deriveVerdictErrorKind, type VerdictErrorKind } from "../services/barcodeUtils";
import {
  getProductEligibilityColors,
  getProductEligibilityIcon,
  getProductEligibilityLabelKey,
} from "../services/accountTransforms";
import { colors } from "@/src/shared/theme/colors";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { KeyboardAvoidingScreen } from "@/src/shared/components/KeyboardAvoidingScreen";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import type { ProductEligibilityCategory } from "../types";

/** A fictitious UPC-A the viewfinder "reads" when tapped. */
const SAMPLE_SCANNED_CODE = "012345678903";

/**
 * OTC product eligibility scanner (FA-7) — camera barcode scan or manual UPC
 * entry against the product catalog. Manual entry is first-class.
 *
 * Web: no camera. The preview is a dark viewfinder with a scan frame; tapping it
 * stands in for a scan. `?state=denied` shows the permission-denied fallback,
 * `?state=checking` the in-flight state, `?state=unavailable` the vendor error.
 * The verdict follows the code's last digit (0–3 eligible, 4–5 dual, 6–7 not
 * eligible, 8–9 not found).
 */
export function EligibilityScanner() {
  const { t } = useTranslation();
  const state = useMoneyState();
  const permission = { granted: state !== "denied", canAskAgain: false };
  const [manualInput, setManualInput] = useState("");
  const [manualInputInvalid, setManualInputInvalid] = useState(false);
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const verdictQuery = useProductEligibility(activeCode ?? "", { enabled: Boolean(activeCode) });

  const errorKind: VerdictErrorKind | null = useMemo(() => {
    if (!verdictQuery.isError) return null;
    return deriveVerdictErrorKind(verdictQuery.error);
  }, [verdictQuery.isError, verdictQuery.error]);

  const submitCode = useCallback((normalized: string) => {
    setActiveCode(normalized);
  }, []);

  const handleBarcodeScanned = useCallback(() => {
    const normalized = normalizeProductCode(SAMPLE_SCANNED_CODE);
    if (!normalized) return;
    submitCode(normalized);
  }, [submitCode]);

  const handleManualCheck = useCallback(() => {
    const normalized = normalizeProductCode(manualInput);
    if (!normalized) {
      setManualInputInvalid(true);
      return;
    }
    setManualInputInvalid(false);
    submitCode(normalized);
  }, [manualInput, submitCode]);

  const handleScanAgain = useCallback(() => {
    setActiveCode(null);
    setManualInput("");
    setManualInputInvalid(false);
  }, []);

  const showCamera = Boolean(permission?.granted) && !activeCode;
  const showPermissionExplanation = Boolean(permission) && !permission?.granted && !activeCode;
  const isChecking = Boolean(activeCode) && verdictQuery.isFetching;
  const showVerdictOrError = Boolean(activeCode) && !verdictQuery.isFetching;

  return (
    <KeyboardAvoidingScreen>
      <ScreenScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <div className="flex-1">
          {showCamera && (
            <div style={{ height: 320 }} className="bg-black">
              {/* Stand-in for the live camera preview. */}
              <button
                type="button"
                onClick={handleBarcodeScanned}
                className="items-center justify-center"
                style={{ flex: 1, background: "radial-gradient(ellipse at center, #2b2f36 0%, #0b0c0e 75%)" }}
                aria-label={t("financialAccounts.scanner.scanPrompt")}
              >
                <div
                  aria-hidden="true"
                  className="items-center justify-center"
                  style={{ width: 240, height: 130, borderWidth: 2, borderColor: "rgba(255,255,255,0.85)", borderRadius: 14 }}
                >
                  <div style={{ width: 200, height: 2, backgroundColor: colors.error, opacity: 0.8 }} />
                </div>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
                <span className="text-white text-center text-sm">{t("financialAccounts.scanner.scanPrompt")}</span>
              </div>
            </div>
          )}

          {showPermissionExplanation && (
            <div className="items-center justify-center px-6 py-8">
              <span aria-hidden="true" style={{ display: "flex" }}>
                <Icon name="camera-outline" size={44} color={colors.neutral[500]} />
              </span>
              <span className="text-brand-primary text-base font-semibold mt-3 text-center">
                {t("financialAccounts.scanner.permissionTitle")}
              </span>
              <span className="text-gray-500 text-sm mt-1 text-center">{t("financialAccounts.scanner.permissionBody")}</span>
              <Button label={t("financialAccounts.scanner.openSettings")} onPress={() => {}} className="mt-4" />
            </div>
          )}

          {isChecking && (
            <div className="items-center justify-center py-10">
              <Spinner size="large" tone="accent" />
              <span className="text-gray-500 mt-3">{t("financialAccounts.scanner.checking")}</span>
            </div>
          )}

          {showVerdictOrError && verdictQuery.data && (
            <VerdictPanel category={verdictQuery.data.category} detail={verdictQuery.data.detail} />
          )}

          {showVerdictOrError && errorKind && (
            <div className="mx-4 mt-4 bg-red-50 rounded-2xl px-4 py-4" role="alert">
              <span className="text-red-800 text-sm font-medium">
                {t(
                  errorKind === "invalid"
                    ? "financialAccounts.scanner.invalidCode"
                    : errorKind === "unavailable"
                      ? "financialAccounts.scanner.unavailable"
                      : "financialAccounts.scanner.loadError"
                )}
              </span>
            </div>
          )}

          {Boolean(activeCode) && !isChecking && (
            <Button
              label={t("financialAccounts.scanner.scanAgain")}
              onPress={handleScanAgain}
              fullWidth
              className="mx-4 mt-4 mb-2"
              // Web: `w-full` plus `mx-4` overflows the parent; stretch fills it minus the margins.
              style={{ width: "auto" }}
            />
          )}

          {/* Manual entry — always available, first-class (no camera on simulator) */}
          <div className="mx-4 mt-4 mb-6 bg-brand-surface rounded-2xl px-4 py-4 shadow-sm">
            <span className="text-sm font-semibold text-brand-primary mb-2">{t("financialAccounts.scanner.manualEntryLabel")}</span>
            <div className="flex-row items-center gap-2">
              <input
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value.replace(/[^\d]/g, ""));
                  setManualInputInvalid(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleManualCheck();
                }}
                placeholder={t("financialAccounts.scanner.manualEntryPlaceholder")}
                inputMode="numeric"
                maxLength={14}
                className="flex-1 bg-gray-100 rounded-xl px-3 py-3 text-base text-brand-primary"
                aria-label={t("financialAccounts.scanner.manualEntryLabel")}
              />
              <Button label={t("financialAccounts.scanner.checkButton")} onPress={handleManualCheck} disabled={verdictQuery.isFetching} />
            </div>
            {manualInputInvalid && (
              <span className="text-error text-xs mt-2" role="alert">
                {t("financialAccounts.scanner.invalidCode")}
              </span>
            )}
          </div>
        </div>
      </ScreenScrollView>
    </KeyboardAvoidingScreen>
  );
}

interface VerdictPanelProps {
  category: ProductEligibilityCategory;
  detail: string;
}

function VerdictPanel({ category, detail }: VerdictPanelProps) {
  const { t } = useTranslation();
  const colorsScheme = getProductEligibilityColors(category);
  const icon = getProductEligibilityIcon(category);

  return (
    <div className={`mx-4 mt-4 rounded-2xl px-4 py-5 ${colorsScheme.bg}`} role="text" aria-label={t(getProductEligibilityLabelKey(category))}>
      <div className="flex-row items-center mb-2">
        <span aria-hidden="true" style={{ marginRight: 10, display: "flex" }}>
          <Icon name={icon} size={28} color={colorsScheme.icon} />
        </span>
        <span className={`text-base font-bold flex-1 ${colorsScheme.text}`}>{t(getProductEligibilityLabelKey(category))}</span>
      </div>
      <span className="text-xs text-gray-500 mb-1">{t("financialAccounts.scanner.verdictDetailLabel")}</span>
      <span className="text-sm text-gray-600">{detail}</span>
    </div>
  );
}
