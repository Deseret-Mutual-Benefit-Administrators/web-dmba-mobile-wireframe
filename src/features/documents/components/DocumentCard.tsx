import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import type { DocumentMetadata, DocumentCategory } from "../types";
import { colors } from "@/src/shared/theme/colors";
import { Badge } from "@/src/shared/components/Badge";
import type { BadgeTone } from "@/src/shared/components/Badge";

/**
 * Card representing a single member document.
 * In the app a tap downloads the document and opens the system share sheet;
 * the wireframe shows the busy state for a moment instead.
 */

interface DocumentCardProps {
  document: DocumentMetadata;
}

function getCategoryLabel(category: DocumentCategory, t: (key: string) => string): string {
  switch (category) {
    case "PlanDocument":
      return t("benefits.documents.planDocuments");
    case "TaxForm":
      return t("benefits.documents.taxForms");
    case "Legal":
      return t("benefits.documents.legal");
    default:
      return category;
  }
}

function getCategoryBadgeTone(category: DocumentCategory): BadgeTone {
  switch (category) {
    case "PlanDocument":
      return "info";
    case "TaxForm":
      return "success";
    case "Legal":
      return "warning";
    default:
      return "neutral";
  }
}

export function DocumentCard({ document }: DocumentCardProps) {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const isPdf = document.contentType === "application/pdf";
  const iconName = isPdf ? "document-outline" : "globe-outline";

  const formattedDate = new Date(document.createdDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  function handlePress() {
    if (isDownloading) return;
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1200);
  }

  const badgeTone = getCategoryBadgeTone(document.category);

  return (
    <button
      type="button"
      onClick={handlePress}
      disabled={isDownloading}
      className="bg-brand-surface rounded-2xl p-4 mb-3 shadow-sm active:opacity-80 text-left"
      aria-label={`${document.title}, ${getCategoryLabel(document.category, t)}, ${formattedDate}. ${t("documents.download")}`}
      aria-description={t("common.hints.opensShareSheet")}
      aria-busy={isDownloading}
    >
      <div className="flex-row items-start gap-3">
        {/* Document type icon */}
        <div className="w-10 h-10 rounded-xl bg-brand-background items-center justify-center mt-0.5">
          <Icon name={iconName} size={22} color={colors.brand.accent} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <span className="text-brand-primary font-semibold text-base line-clamp-2">{document.title}</span>

          {/* Category badge + date row */}
          <div className="flex-row items-center gap-2 mt-1.5 flex-wrap">
            <Badge label={getCategoryLabel(document.category, t)} tone={badgeTone} />
            <span className="text-xs text-brand-secondary">{formattedDate}</span>
          </div>

          {/* PHI warning */}
          {document.containsPhi && (
            <div className="flex-row items-center gap-1 mt-1.5">
              <Icon name="shield-outline" size={12} color={colors.error} />
              <span className="text-xs text-error">{t("benefits.documents.phiWarning")}</span>
            </div>
          )}
        </div>

        {/* Action indicator */}
        <div className="mt-1">
          {isDownloading ? (
            <Icon name="hourglass-outline" size={18} color={colors.neutral[500]} />
          ) : (
            <Icon name="arrow-down-circle-outline" size={20} color={colors.brand.accent} />
          )}
        </div>
      </div>
    </button>
  );
}
