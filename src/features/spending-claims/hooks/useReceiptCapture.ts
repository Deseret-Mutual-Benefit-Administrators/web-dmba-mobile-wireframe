/**
 * Placeholder stand-in for the app's `spending-claims/hooks/useReceiptCapture.ts`.
 * No camera and no files: "taking" or "choosing" a photo adds a page record with
 * a fixed size. `?state=cameraDenied` puts the camera permission in the denied
 * state (the choose-from-photos path still works).
 */
import { useCallback, useRef, useState } from "react";
import { useMoneyState } from "@/src/features/financial-accounts/api/accountsQueries";
import type { CapturedReceipt } from "../types";

const MAX_PAGES = 5;

export type ReceiptCaptureError = "captureFailed" | "unsupportedFormat" | "tooLarge" | "storageFailed" | "tooManyPages";

interface Options {
  acceptedContentTypes: string[];
  maxBytes: number;
  deleteOnUnmount: boolean;
}

export function useReceiptCapture({ acceptedContentTypes }: Options) {
  const state = useMoneyState();
  const [pages, setPages] = useState<CapturedReceipt[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<ReceiptCaptureError | null>(null);
  const counter = useRef(0);
  const cameraRef = useRef<HTMLDivElement>(null);

  const permission = { granted: state !== "cameraDenied", canAskAgain: false };
  const canAttach = acceptedContentTypes.length > 0;
  const canAddPage = pages.length < MAX_PAGES;

  const addPage = useCallback(async (byteLength: number) => {
    setIsBusy(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 250));
    counter.current += 1;
    const page: CapturedReceipt = {
      id: `page-${counter.current}`,
      encryptedPath: "",
      contentType: "image/jpeg",
      byteLength,
    };
    setPages((prev) => [...prev, page]);
    setIsBusy(false);
    return page;
  }, []);

  const captureFromCamera = useCallback(() => addPage(870_400), [addPage]);
  const addFromLibrary = useCallback(() => addPage(1_310_720), [addPage]);

  const removePage = useCallback(async (id: string) => {
    setPages((prev) => prev.filter((page) => page.id !== id));
  }, []);

  return {
    pages,
    isBusy,
    error,
    permission,
    cameraRef,
    canAttach,
    canAddPage,
    maxPages: MAX_PAGES,
    captureFromCamera,
    addFromLibrary,
    removePage,
  };
}
