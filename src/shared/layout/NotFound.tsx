import { Link } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";

/** Port of `app/+not-found.tsx`. */
export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 min-h-0">
      <ScreenHeader title={t("notFound.title")} />
      <div className="flex-1 items-center justify-center bg-brand-background p-5">
        <span className="text-xl font-bold text-brand-primary">{t("notFound.message")}</span>
        <Link to="/" className="mt-4 py-4">
          <span className="text-brand-accent text-sm">{t("notFound.goHome")}</span>
        </Link>
      </div>
    </div>
  );
}
