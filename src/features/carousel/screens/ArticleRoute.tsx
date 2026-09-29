import { useParams } from "react-router-dom";
import { ArticleReaderScreen } from "./ArticleReaderScreen";

/**
 * Route: /article/:slug — thin route file; delegates to ArticleReaderScreen.
 */
export function ArticleRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <ArticleReaderScreen slug={slug ?? ""} />;
}
