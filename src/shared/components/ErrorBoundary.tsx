import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/** Catches unhandled render errors and shows a recovery screen instead of a blank page. */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex-1 bg-brand-background items-center justify-center px-8">
        <img src="/images/dmba-logo.png" alt="" style={{ width: 120, height: 49, objectFit: "contain" }} />
        <div className="mt-8 items-center">
          <div className="w-16 h-16 rounded-full bg-error/10 items-center justify-center mb-4" aria-hidden="true">
            <Icon name="warning-outline" size={32} color={colors.error} />
          </div>
          <span className="text-xl font-semibold text-brand-primary text-center mb-2" role="alert">
            {i18n.t("error.title")}
          </span>
          <span className="text-sm text-brand-secondary text-center mb-6">{i18n.t("error.message")}</span>
          {import.meta.env.DEV && this.state.error && (
            <div className="bg-gray-100 rounded-lg p-3 mb-6 w-full">
              <span className="text-xs text-error font-mono">{this.state.error.message}</span>
            </div>
          )}
          <button
            type="button"
            onClick={this.handleReset}
            className="bg-brand-accent rounded-xl px-8 py-3 active:opacity-80"
            aria-label={i18n.t("error.tryAgain")}
          >
            <span className="text-white font-semibold text-base">{i18n.t("error.tryAgain")}</span>
          </button>
        </div>
      </div>
    );
  }
}
