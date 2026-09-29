/**
 * Local stand-ins for the app's `hooks/useFamilyPermissions` (query + optimistic
 * toggle), backed by placeholder data. Wireframe params:
 * `?view=dependent|individual`, `?state=loading|empty|error`.
 */
import { useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";
import {
  placeholderDependentResponse,
  placeholderHolderResponse,
  placeholderIndividualResponse,
} from "./placeholder";
import type { FamilyPermissionGrant, FamilyPermissionSection, FamilyPermissionsViewerRole } from "./types";

// A tiny module store so each DependentCard's toggle updates the shared list.
let holderMembers: FamilyPermissionGrant[] = placeholderHolderResponse.members;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFamilyPermissions() {
  const [params] = useSearchParams();
  const view = params.get("view");
  const state = params.get("state");
  const members = useSyncExternalStore(subscribe, () => holderMembers);

  const response =
    view === "dependent"
      ? placeholderDependentResponse
      : view === "individual"
      ? placeholderIndividualResponse
      : { ...placeholderHolderResponse, members: state === "empty" ? [] : members };

  const isLoading = state === "loading";
  const isError = state === "error";
  const role: FamilyPermissionsViewerRole | null = isLoading || isError ? null : response.viewerRole;

  return {
    role,
    members: response.members,
    hipaaAuthorizedViewers: response.hipaaAuthorizedViewers,
    availableSections: response.availableSections,
    isLoading,
    isError,
    refetch: () => undefined,
  };
}

export function useFamilyPermissionToggle(memberId: string) {
  return {
    toggle: (section: FamilyPermissionSection, _opts?: { onError?: () => void }) => {
      holderMembers = holderMembers.map((m) =>
        m.memberId !== memberId
          ? m
          : {
              ...m,
              isDefault: false,
              grantedSections: m.grantedSections.includes(section)
                ? m.grantedSections.filter((s) => s !== section)
                : [...m.grantedSections, section],
            }
      );
      listeners.forEach((l) => l());
    },
  };
}
