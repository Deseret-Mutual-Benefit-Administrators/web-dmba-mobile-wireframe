import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface ScreenHeaderProps {
  title: string;
  /** Defaults to history back. */
  onBack?: () => void;
  /** Optional right-side element (e.g., status badge). */
  rightElement?: ReactNode;
}

/**
 * Shared header for pushed (non-tab) screens. The app pads `insets.top + 8`;
 * PhoneFrame draws the status bar, so the 8 remains.
 */
export function ScreenHeader({ title, onBack, rightElement }: ScreenHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-brand-surface border-b border-gray-200" style={{ paddingTop: 8 }}>
      <div className="flex-row items-center px-4 pb-4">
        <button type="button" onClick={onBack ?? (() => navigate(-1))} className="mr-3 p-1 active:opacity-80" aria-label={t("common.back")}>
          <Icon name="chevron-back" size={24} color={colors.brand.accent} />
        </button>
        <h1 className="text-lg font-semibold text-brand-primary flex-1">{title}</h1>
        {rightElement}
      </div>
    </div>
  );
}
