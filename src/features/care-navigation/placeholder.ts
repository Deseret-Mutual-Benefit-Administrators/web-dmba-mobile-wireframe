/**
 * Stand-ins for `careNavQueries` (checklist + financial content cards) and
 * `useOpenExternalLink`. `?state=loading|error` drives the checklist and cards;
 * `?state=empty` hides the cards (the app renders nothing when there are none).
 */
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { useToast } from "@/src/shared/components/Toast";

function useStateParam() {
  const [params] = useSearchParams();
  return params.get("state");
}

export function useChecklist() {
  const state = useStateParam();
  return {
    data: state === "loading" || state === "error" ? undefined : { completedItemKeys: ["full401kMatch"] },
    isLoading: state === "loading",
    isError: state === "error",
    refetch: () => undefined,
  };
}


export interface FinancialContentCard {
  id: string;
  slug: string;
  title: string;
  readMinutes: number;
  category: { displayName: string; colorToken: string };
  hero: { url: string; altText: string } | null;
}

export function useFinancialContent() {
  const state = useStateParam();
  const cards: FinancialContentCard[] = [
    {
      id: "fc-1",
      slug: "sample-article",
      title: "Sample financial planning article title",
      readMinutes: 4,
      category: { displayName: "Sample category", colorToken: "blue" },
      hero: null,
    },
    {
      id: "fc-2",
      slug: "sample-article",
      title: "Another sample article that runs to a second line of text",
      readMinutes: 6,
      category: { displayName: "Sample topic", colorToken: "green" },
      hero: null,
    },
  ];
  return {
    data: state === "empty" ? [] : state === "loading" || state === "error" ? undefined : cards,
    isLoading: state === "loading",
    isError: state === "error",
  };
}

/** The app opens an in-app browser; the wireframe says so in a toast instead. */
export function useOpenExternalLink() {
  const { t } = useTranslation();
  const toast = useToast();
  return {
    open: (_url: string) => toast.show(t("common.hints.opensBrowser")),
    isOpening: false,
  };
}

/** Stand-in for carousel's `categoryPillClasses`. */
export function categoryPillClasses(colorToken: string): { bg: string; text: string } {
  switch (colorToken) {
    case "green":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "amber":
      return { bg: "bg-amber-100", text: "text-amber-800" };
    default:
      return { bg: "bg-blue-100", text: "text-blue-800" };
  }
}

/** Stand-in for carousel's `safeReadMinutes`. */
export function safeReadMinutes(minutes: number | null | undefined): number {
  return typeof minutes === "number" && minutes > 0 ? Math.round(minutes) : 1;
}
