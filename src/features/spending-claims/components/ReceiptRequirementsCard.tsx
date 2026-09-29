/**
 * What an acceptable receipt has to show — displayed before the camera opens.
 * The annotated example is decorative; the same four requirements follow as text.
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

const REQUIREMENT_KEYS = [
  "spendingClaims.receiptRequirements.provider",
  "spendingClaims.receiptRequirements.date",
  "spendingClaims.receiptRequirements.description",
  "spendingClaims.receiptRequirements.amount",
];

export function ReceiptRequirementsCard() {
  const { t } = useTranslation();

  return (
    <div className="px-4 pt-2">
      <span className="text-lg font-semibold text-brand-primary mb-1">{t("spendingClaims.receiptRequirements.title")}</span>
      <span className="text-sm text-gray-600 mb-4">{t("spendingClaims.receiptRequirements.subtitle")}</span>

      <div
        className="rounded-xl border p-4 mb-4"
        style={{ borderColor: colors.border, backgroundColor: colors.neutral[50] }}
        aria-hidden="true"
      >
        <div className="items-center pb-2 mb-2" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <span className="text-sm font-semibold" style={{ color: colors.brand.primary }}>
            {t("spendingClaims.receiptRequirements.example.providerName")}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">{t("spendingClaims.receiptRequirements.example.providerCallout")}</span>
        </div>

        <div className="flex-row justify-between mb-1.5">
          <span className="text-xs text-gray-600">{t("spendingClaims.receiptRequirements.example.dateLabel")}</span>
          <span className="text-xs" style={{ color: colors.brand.primary }}>
            {t("spendingClaims.receiptRequirements.example.dateValue")}
          </span>
        </div>

        <div className="flex-row justify-between mb-1.5">
          <span className="text-xs text-gray-600">{t("spendingClaims.receiptRequirements.example.descriptionLabel")}</span>
          <span className="text-xs" style={{ color: colors.brand.primary }}>
            {t("spendingClaims.receiptRequirements.example.descriptionValue")}
          </span>
        </div>

        <div className="flex-row justify-between pt-1.5 mt-1" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
          <span className="text-xs font-semibold" style={{ color: colors.brand.primary }}>
            {t("spendingClaims.receiptRequirements.example.amountLabel")}
          </span>
          <span className="text-xs font-semibold" style={{ color: colors.brand.primary }}>
            {t("spendingClaims.receiptRequirements.example.amountValue")}
          </span>
        </div>
      </div>

      <div className="rounded-xl border p-4" style={{ borderColor: colors.border, backgroundColor: colors.brand.surface }}>
        <span className="text-sm font-semibold text-brand-primary mb-2.5">{t("spendingClaims.receiptRequirements.mustShow")}</span>
        {REQUIREMENT_KEYS.map((key) => (
          <div key={key} className="flex-row items-start mb-2">
            <span aria-hidden="true" style={{ marginTop: 2, display: "flex" }}>
              <Icon name="checkmark-circle-outline" size={16} color={colors.brand.accent} />
            </span>
            <span className="text-sm text-brand-primary ml-2.5 flex-1">{t(key)}</span>
          </div>
        ))}
      </div>

      <div
        className="flex-row items-start rounded-xl px-3 py-2.5 mt-3 bg-error-tint"
        role="alert"
        aria-label={t("spendingClaims.receiptRequirements.notAcceptable")}
      >
        <span aria-hidden="true" style={{ marginTop: 1, display: "flex" }}>
          <Icon name="close-circle-outline" size={16} color={colors.error} />
        </span>
        <span className="text-xs ml-2 flex-1" style={{ color: colors.tone.error.icon }}>
          {t("spendingClaims.receiptRequirements.notAcceptable")}
        </span>
      </div>
    </div>
  );
}
