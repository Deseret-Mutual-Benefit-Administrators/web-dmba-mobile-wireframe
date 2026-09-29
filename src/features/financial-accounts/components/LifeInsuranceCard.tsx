import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { KeyValueRow } from "@/src/shared/components/KeyValueRow";
import { colors } from "@/src/shared/theme/colors";
import { FinancialCardShell } from "./FinancialCardShell";
import { useLifeInsurance } from "./cardData";
import { formatCurrency } from "./cardServices";
import type { LifeInsuranceMember } from "./cardTypes";

/**
 * Dashboard card for Life Insurance benefits. Expanded view includes a family
 * member picker and, for the selected member, Group Term Life, Supplemental
 * GTL, and 24-Hour AD&D coverage amounts.
 */
interface LifeInsuranceCardProps {
  /** Set when the account is a contract holder's, read on behalf (ADR-156). */
  onBehalfOfName?: string;
}

export function LifeInsuranceCard({ onBehalfOfName }: LifeInsuranceCardProps = {}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useLifeInsurance({ enabled: isExpanded });

  const members: LifeInsuranceMember[] = data?.members ?? [];
  const selected: LifeInsuranceMember | undefined = members[selectedIndex];

  function coverageValue(amount: number): string {
    return amount > 0 ? formatCurrency(amount) : t("financialAccounts.life.notApplicable");
  }

  return (
    <FinancialCardShell
      icon="heart-outline"
      title={t("financialAccounts.life.title")}
      accessibilityLabel={isExpanded ? t("financialAccounts.life.collapse") : t("financialAccounts.life.expand")}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded((prev) => !prev)}
      isLoading={isExpanded && isLoading}
      isError={isError}
      onRetry={() => refetch()}
      caption={onBehalfOfName ? t("financialAccounts.viewingOnBehalf", { name: onBehalfOfName }) : undefined}
    >
      {data && members.length > 0 && selected && (
        <div>
          {/* Member picker — only shown if there are multiple members */}
          {members.length > 1 && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setIsPickerOpen((prev) => !prev)}
                className="flex-row items-center justify-between p-3 rounded-lg border border-gray-200 bg-brand-surface"
                aria-label={t("financialAccounts.life.selectMemberPicker", { name: selected.name })}
                aria-expanded={isPickerOpen}
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-brand-primary">{selected.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.relationship}</p>
                </div>
                <Icon name={isPickerOpen ? "chevron-up" : "chevron-down"} size={16} color={colors.neutral[500]} />
              </button>

              {isPickerOpen && (
                <div className="mt-1 rounded-lg border border-gray-200 bg-brand-surface overflow-hidden shadow-sm">
                  {members.map((member, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        type="button"
                        key={`${member.name}-${index}`}
                        onClick={() => {
                          setSelectedIndex(index);
                          setIsPickerOpen(false);
                        }}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          index > 0 ? "border-t border-gray-100" : ""
                        } ${isSelected ? "bg-brand-accent/10" : ""}`}
                        role="menuitem"
                        aria-label={`${member.name}, ${member.relationship}`}
                        aria-selected={isSelected}
                      >
                        <div className="flex-1">
                          <span className={`text-sm ${isSelected ? "font-semibold text-brand-accent" : "text-brand-primary"}`}>
                            {member.name}
                          </span>
                          <p className="text-xs text-gray-500">{member.relationship}</p>
                        </div>
                        {isSelected && <Icon name="checkmark" size={18} color={colors.financial.gradientStart} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.life.groupTermLife")} value={coverageValue(selected.groupTermLife)} emphasize />
          </div>

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.life.supplementalGtl")} value={coverageValue(selected.supplementalGtl)} emphasize />
          </div>

          <div className="bg-gray-50 rounded-xl px-4 mb-2">
            <KeyValueRow label={t("financialAccounts.life.adnd")} value={coverageValue(selected.adndCoverage)} emphasize />
          </div>
        </div>
      )}
    </FinancialCardShell>
  );
}
