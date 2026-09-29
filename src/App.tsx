import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/src/shared/components/ErrorBoundary";
import { OfflineBanner } from "@/src/shared/components/OfflineBanner";
import { ToastHost } from "@/src/shared/components/Toast";
import { PhoneFrame } from "@/src/shared/layout/PhoneFrame";
import { AppRoutes } from "./routes";

/** PhoneFrame → routes. Login and verify are "bare" routes: no header, no tab bar. */
export default function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <ErrorBoundary>
          <OfflineBanner />
          <AppRoutes />
          <ToastHost />
        </ErrorBoundary>
      </PhoneFrame>
    </BrowserRouter>
  );
}
