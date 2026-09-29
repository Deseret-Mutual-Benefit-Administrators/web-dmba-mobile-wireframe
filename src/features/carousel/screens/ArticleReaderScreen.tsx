import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { colors } from "@/src/shared/theme/colors";
import { categoryPillClasses, safeReadMinutes } from "../services/carouselTransforms";
import { MiniMarkdown } from "../services/miniMarkdown";
import { HeroPlaceholder } from "../components/HeroPlaceholder";
import { placeholderArticles } from "../placeholder";

interface ArticleReaderScreenProps {
  slug: string;
}

/** Phone frame width — the app reads `useWindowDimensions()`. */
const WINDOW_WIDTH = 393;

/**
 * Full-page article reader: header, hero, category pill + read time, title,
 * excerpt, Markdown body. `?state=loading|error` show those states; an unknown
 * slug or `?state=empty` shows the "not available" state (the app's 404).
 */
export function ArticleReaderScreen({ slug }: ArticleReaderScreenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const state = new URLSearchParams(useLocation().search).get("state");
  const isLoading = state === "loading";
  const isError = state === "error";
  const article = state === "empty" ? undefined : placeholderArticles.find((a) => a.slug === slug);
  const width = WINDOW_WIDTH;

  if (isLoading) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={t("carousel.readerTitle")} />
        <div className="flex-1 items-center justify-center">
          <Spinner size="large" />
          <p className="text-brand-secondary mt-3 text-sm">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={t("carousel.readerTitle")} />
        <div className="flex-1 items-center justify-center px-6">
          <Icon name="alert-circle-outline" size={48} color={colors.error} />
          <p className="text-error text-center mt-3 mb-4 text-base font-medium">{t("carousel.loadError")}</p>
          <Button label={t("common.back")} onPress={() => navigate(-1)} />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex-1 bg-brand-background">
        <ScreenHeader title={t("carousel.readerTitle")} />
        <div className="flex-1 items-center justify-center px-6">
          <Icon name="document-outline" size={48} color={colors.brand.secondary} />
          <p className="text-brand-secondary text-center mt-3 text-base">{t("carousel.notFound")}</p>
        </div>
      </div>
    );
  }

  const pill = categoryPillClasses(article.category.colorToken);
  const minutes = safeReadMinutes(article.readMinutes);
  const heroHeight = Math.round((width * 9) / 16);

  return (
    <div className="flex-1 bg-brand-background" style={{ minHeight: 0 }}>
      <ScreenHeader title={article.category.displayName} />

      <div className="flex-1 overflow-y-auto scrollbar-none" style={{ minHeight: 0, paddingBottom: 48 }}>
        {/* Hero */}
        <HeroPlaceholder title={article.title} width={width} height={heroHeight} />

        <div className="px-5 pt-5">
          {/* Category pill + read-time row */}
          <div className="flex-row items-center gap-3 mb-3">
            <div className={`px-3 py-1 rounded-full ${pill.bg}`}>
              <span className={`text-xs font-semibold ${pill.text}`}>{article.category.displayName}</span>
            </div>

            <div className="flex-row items-center">
              <Icon name="time-outline" size={13} color={colors.brand.secondary} />
              <span className="text-xs text-gray-500 ml-1" aria-label={t("carousel.readTimeLabel", { count: minutes })}>
                {t("carousel.readTime", { count: minutes })}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-brand-primary font-bold text-2xl leading-tight mb-3">{article.title}</h2>

          {/* Excerpt — lead paragraph */}
          <p className="text-base text-brand-secondary leading-relaxed mb-5 font-medium">{article.excerpt}</p>

          {/* Body Markdown */}
          <MiniMarkdown>{article.bodyMarkdown}</MiniMarkdown>
        </div>
      </div>
    </div>
  );
}
