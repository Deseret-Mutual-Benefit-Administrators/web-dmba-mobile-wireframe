/**
 * The app puts Back in a modal's native header left slot, and only once there
 * is a step to go back to. The shared ModalSheet header has no left slot, so —
 * as `claim-submission/` does — the button is portalled into the sheet at the
 * header's position.
 */
import { useEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";

/** ModalSheet: 6px grabber padding + 5px grabber above its 50px header. */
const SHEET_HEADER_TOP = 11;
const SHEET_HEADER_HEIGHT = 50;

export function SheetBackButton({ anchorRef, visible, onPress }: { anchorRef: RefObject<HTMLElement | null>; visible: boolean; onPress: () => void }) {
  const { t } = useTranslation();
  const [sheet, setSheet] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSheet(anchorRef.current?.closest<HTMLElement>('[role="dialog"]') ?? null);
  }, [anchorRef]);

  if (!sheet || !visible) return null;

  return createPortal(
    <button
      type="button"
      onClick={onPress}
      className="absolute left-4 justify-center active:opacity-70"
      style={{ top: SHEET_HEADER_TOP, height: SHEET_HEADER_HEIGHT, zIndex: 2 }}
      aria-label={t("common.back")}
    >
      <Icon name="chevron-back" size={26} color={colors.brand.accent} />
    </button>,
    sheet
  );
}
