import { useLocation } from "react-router-dom";
import { ScreenHeader } from "@/src/shared/components/ScreenHeader";
import { ScreenScrollView } from "@/src/shared/components/ScreenScrollView";
import { Caption, SectionTitle } from "@/src/shared/components/Typography";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface PlaceholderProps {
  title: string;
  /** Route pattern, shown for orientation. */
  path: string;
  /** Tab screens and sheets already have a header; pushed and bare screens get a ScreenHeader. */
  withHeader?: boolean;
}

/** Stand-in for a route whose screen has not been translated yet. */
export function Placeholder({ title, path, withHeader = true }: PlaceholderProps) {
  const location = useLocation();
  return (
    <div className="flex-1 min-h-0">
      {withHeader ? <ScreenHeader title={title} /> : null}
      <ScreenScrollView>
        <div className="items-center py-16 px-6">
          <div className="mb-4">
            <Icon name="code-slash-outline" size={48} color={colors.neutral[400]} />
          </div>
          {!withHeader ? <SectionTitle className="text-center mb-1">{title}</SectionTitle> : null}
          <span className="text-sm text-gray-600 text-center">Screen not yet translated</span>
          <Caption className="text-center mt-2">{path === location.pathname ? path : `${path} → ${location.pathname}`}</Caption>
        </div>
      </ScreenScrollView>
    </div>
  );
}
