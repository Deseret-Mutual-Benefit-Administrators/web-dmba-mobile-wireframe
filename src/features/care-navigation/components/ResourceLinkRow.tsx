import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { CollapsibleSection } from "@/src/shared/components/CollapsibleSection";
import { useOpenExternalLink } from "../placeholder";
import type { ResourceLink } from "../types";

interface ResourceLinkRowProps {
  resource: ResourceLink;
}

/** Expandable resource row — description + an external "Open" CTA button. */
export function ResourceLinkRow({ resource }: ResourceLinkRowProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { open, isOpening } = useOpenExternalLink();

  return (
    <CollapsibleSection
      icon="link-outline"
      title={t(resource.labelKey)}
      subtitle={t(resource.descriptionKey)}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
    >
      <button
        type="button"
        onClick={() => open(resource.url)}
        disabled={isOpening}
        className={`flex-row items-center justify-center bg-brand-accent rounded-xl py-2.5 active:opacity-80 ${
          isOpening ? "opacity-50" : ""
        }`}
        aria-label={t("careNavigation.resources.openLabel", { title: t(resource.labelKey) })}
        title={t("common.hints.opensBrowser")}
      >
        <span className="text-white font-semibold mr-1.5">{t("careNavigation.resources.open")}</span>
        <Icon name="open-outline" size={16} color={colors.brand.surface} />
      </button>
    </CollapsibleSection>
  );
}
