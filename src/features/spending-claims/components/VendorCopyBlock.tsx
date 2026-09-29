/**
 * A block of the spending-account administrator's own copy — rendered as
 * supplied, never translated; the note explaining why it is in English is ours.
 */
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { splitVendorParagraphs } from "../services/spendingClaimTransforms";
import { colors } from "@/src/shared/theme/colors";

interface VendorCopyBlockProps {
  content: string | null;
  showLanguageNote?: boolean;
  titleKey?: string | null;
}

export function VendorCopyBlock({ content, showLanguageNote = true, titleKey = null }: VendorCopyBlockProps) {
  const { t } = useTranslation();
  const paragraphs = splitVendorParagraphs(content);

  if (paragraphs.length === 0) return null;

  return (
    <div className="mb-4">
      {titleKey && <span className="text-sm font-semibold text-brand-primary mb-1.5">{t(titleKey)}</span>}

      {showLanguageNote && (
        <div className="flex-row items-start rounded-lg px-3 py-2 mb-2 bg-info-tint">
          <span aria-hidden="true" style={{ marginTop: 1, display: "flex" }}>
            <Icon name="information-circle-outline" size={16} color={colors.brand.accent} />
          </span>
          <span className="text-xs text-brand-primary ml-2 flex-1">{t("spendingClaims.vendorCopyNote")}</span>
        </div>
      )}

      <div className="rounded-xl border p-3" style={{ borderColor: colors.border }}>
        {paragraphs.map((paragraph, index) => (
          <span key={index} className="text-sm text-brand-primary leading-5" style={index > 0 ? { marginTop: 10 } : undefined}>
            {paragraph}
          </span>
        ))}
      </div>
    </div>
  );
}
