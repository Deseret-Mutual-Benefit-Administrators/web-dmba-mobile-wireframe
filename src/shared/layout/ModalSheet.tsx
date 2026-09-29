import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";

interface ModalSheetProps {
  /** Native header title the app shows on a `modal` route. */
  title?: string;
  /**
   * `modal` — an iOS page sheet: top edge 10px under the status bar, rounded top
   * corners, native header with a Close button.
   * `formSheet` — the AI advisor sheet: starts lower (large detent) and the
   * screen draws its own grabber, header and close control, so nothing is added here.
   */
  presentation?: "modal" | "formSheet";
  /** Defaults to history back. */
  onClose?: () => void;
  children: ReactNode;
}

/**
 * Full-frame overlay inside the phone for routes the app presents as a sheet.
 * The dimmed layer stands in for the screen underneath (this wireframe does not
 * keep the previous route mounted behind a sheet).
 */
export function ModalSheet({ title, presentation = "modal", onClose, children }: ModalSheetProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const close = onClose ?? (() => navigate(-1));
  const top = presentation === "formSheet" ? 64 : 10;

  return (
    <div className="absolute inset-0 bg-black/40" style={{ zIndex: 50 }}>
      <div
        className="absolute left-0 right-0 bottom-0 bg-brand-background overflow-hidden"
        style={{ top, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {presentation === "modal" && (
          <div className="items-center pt-1.5" aria-hidden="true">
            <div className="bg-gray-300 rounded-full" style={{ width: 36, height: 5 }} />
          </div>
        )}
        {presentation === "modal" && (
          <div className="flex-row items-center justify-center px-4 bg-brand-surface border-b border-gray-200" style={{ height: 50 }}>
            <span className="text-[17px] font-semibold text-brand-primary">{title}</span>
            <button type="button" onClick={close} className="absolute right-4 top-0 bottom-0 justify-center active:opacity-70" aria-label={t("common.close")}>
              <span className="text-[17px] text-brand-accent">{t("common.close")}</span>
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">{children}</div>
      </div>
    </div>
  );
}
