import { useEffect, useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { colors } from "@/src/shared/theme/colors";
import { Card } from "@/src/shared/components/Card";
import { SectionTitle } from "@/src/shared/components/Typography";
import { Spinner } from "@/src/shared/components/Spinner";
import { Button } from "@/src/shared/components/Button";
import { useChecklist } from "../placeholder";
import { financialPlanningChecklist } from "../data/checklist";

/**
 * Generic checklist with mark-done. The app keeps completion server-side
 * (full-replace PUT); the wireframe holds it in local state.
 */
export function ChecklistSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useChecklist();
  const [completedItemKeys, setCompletedItemKeys] = useState<string[]>([]);
  const initial = data?.completedItemKeys.join(",");
  useEffect(() => {
    if (initial !== undefined) setCompletedItemKeys(initial ? initial.split(",") : []);
  }, [initial]);
  const isSaving = false;

  const handleToggle = (itemKey: string) => {
    const isChecked = completedItemKeys.includes(itemKey);
    setCompletedItemKeys(
      isChecked ? completedItemKeys.filter((key) => key !== itemKey) : [...completedItemKeys, itemKey]
    );
  };

  return (
    <Card className="mb-3">
      <SectionTitle className="mb-3">{t("careNavigation.checklist.title")}</SectionTitle>
      {isLoading ? (
        <Spinner size="small" tone="accent" />
      ) : isError ? (
        <div className="items-center py-2">
          <span className="text-error text-sm text-center mb-3">{t("careNavigation.checklist.loadError")}</span>
          <Button variant="secondary" size="sm" label={t("careNavigation.checklist.retry")} onPress={() => refetch()} />
        </div>
      ) : (
        financialPlanningChecklist.map((item) => {
          const checked = completedItemKeys.includes(item.key);
          return (
            <button
              type="button"
              key={item.key}
              onClick={() => handleToggle(item.key)}
              disabled={isSaving}
              className={`flex-row items-start py-2 ${isSaving ? "opacity-50" : ""}`}
              role="checkbox"
              aria-checked={checked}
              aria-label={t(item.labelKey)}
            >
              <Icon
                name={checked ? "checkbox" : "square-outline"}
                size={20}
                color={checked ? colors.success : colors.brand.secondary}
              />
              <div className="flex-1 ml-2.5">
                <span className={`text-sm ${checked ? "text-gray-500 line-through" : "text-brand-primary"}`}>
                  {t(item.labelKey)}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">{t(item.descriptionKey)}</span>
              </div>
            </button>
          );
        })
      )}
    </Card>
  );
}
