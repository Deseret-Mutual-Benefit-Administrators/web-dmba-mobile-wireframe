import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Caption } from "@/src/shared/components/Typography";
import { colors } from "@/src/shared/theme/colors";
import type { FamilyMember } from "../types";

/**
 * Inline family-member picker. Tapping the selector toggles an expandable list
 * below the trigger. "Family" is always the first option; the subscriber's row
 * uses their real name, not "Self".
 */

interface FamilyMemberDropdownProps {
  familyMembers: FamilyMember[];
  /** "family" sentinel = aggregate view; undefined = subscriber-only; specific id = that member */
  selectedMemberId: string | undefined;
  onSelect: (memberId: string | undefined) => void;
  /** Subscriber's display name. */
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
      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex-row items-center justify-between p-3 rounded-lg border border-gray-200 bg-brand-surface"
        aria-label={selected.primary}
        aria-expanded={isOpen}
      >
        <div className="flex-1">
          <span className="text-sm font-medium text-brand-primary">{selected.primary}</span>
          {selected.secondary && <Caption className="mt-0.5">{selected.secondary}</Caption>}
        </div>
        <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.neutral[500]} />
      </button>

      {/* Option list — shown inline below the trigger */}
      {isOpen && (
        <div className="mt-1 rounded-lg border border-gray-200 bg-brand-surface overflow-hidden shadow-sm">
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
                className={`px-4 py-3 flex-row items-center justify-between ${
                  index > 0 ? "border-t border-gray-100" : ""
                } ${isSelected ? "bg-brand-accent/10" : ""}`}
                role="menuitem"
                aria-label={`${option.primary}${option.secondary ? `, ${option.secondary}` : ""}`}
                aria-selected={isSelected}
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
