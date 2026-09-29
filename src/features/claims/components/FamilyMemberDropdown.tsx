/**
 * Local port of `src/features/dashboard/components/FamilyMemberDropdown.tsx`.
 * The dashboard folder belongs to another slice of this wireframe, so the claims
 * and prior-auth lists use this copy; classes and behaviour are identical.
 */
import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import type { FamilyMember } from "../placeholder";
import { colors } from "@/src/shared/theme/colors";
import { Caption } from "@/src/shared/components/Typography";

interface FamilyMemberDropdownProps {
  familyMembers: FamilyMember[];
  /** "family" sentinel = aggregate view; undefined = subscriber-only; specific id = that member */
  selectedMemberId: string | undefined;
  onSelect: (memberId: string | undefined) => void;
  /** Subscriber's display name. Required for consistent labeling. */
  selfName: string;
}

interface Option {
  id: string | undefined;
  primary: string;
  secondary?: string;
}

export function FamilyMemberDropdown({ familyMembers, selectedMemberId, onSelect, selfName }: FamilyMemberDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const options: Option[] = [
    { id: "family", primary: t("dashboard.family"), secondary: t("dashboard.allMembers") },
    { id: undefined, primary: selfName, secondary: t("dashboard.selfRelationship") },
  ];

  for (const member of familyMembers) {
    options.push({
      id: member.memberId,
      primary: `${member.firstName} ${member.lastName}`,
      secondary: member.relationship,
    });
  }

  const selected = options.find((o) => o.id === selectedMemberId) ?? options[0];

  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex-row items-center justify-between p-3 rounded-lg border border-gray-200 bg-brand-surface text-left"
        aria-label={selected.primary}
        aria-expanded={isOpen}
      >
        <div className="flex-1">
          <span className="text-sm font-medium text-brand-primary">{selected.primary}</span>
          {selected.secondary && <Caption className="mt-0.5">{selected.secondary}</Caption>}
        </div>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.neutral[500]} />
      </button>

      {isOpen && (
        <div className="mt-1 rounded-lg border border-gray-200 bg-brand-surface overflow-hidden shadow-sm" role="menu">
          {options.map((option, index) => {
            const isSelected = option.id === selectedMemberId;
            return (
              <button
                type="button"
                key={option.id ?? "self"}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 flex-row items-center justify-between text-left ${
                  index > 0 ? "border-t border-gray-100" : ""
                } ${isSelected ? "bg-brand-accent/10" : ""}`}
                role="menuitem"
                aria-label={`${option.primary}${option.secondary ? `, ${option.secondary}` : ""}`}
                aria-current={isSelected}
              >
                <div className="flex-1">
                  <span className={`text-sm ${isSelected ? "font-semibold text-brand-accent" : "text-brand-primary"}`}>
                    {option.primary}
                  </span>
                  {option.secondary && <Caption>{option.secondary}</Caption>}
                </div>
                {isSelected && <Icon name="checkmark" size={18} color={colors.brand.accent} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
