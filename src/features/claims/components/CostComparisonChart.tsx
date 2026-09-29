import { useState } from "react";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import type { MonthlyCostBar } from "../placeholder";
import { colors } from "@/src/shared/theme/colors";
import { Caption } from "@/src/shared/components/Typography";
import { formatClaimAmount, sumYearTotals } from "../services/claimsTransforms";

/**
 * Cost comparison chart — collapsible section with a custom bar chart.
 * Shows Total Billed vs Your Responsibility per month, with a toggle
 * to switch between This Year and Last Year. The two annual totals live
 * inside this card and follow the selected year.
 *
 * Web port: each month's bar pair is an inline <svg> with the app's geometry
 * (two 12px bars, 2px gap, 4px rounded tops, 100px max height, 2px minimum).
 */

interface CostComparisonChartProps {
  thisYear: MonthlyCostBar[];
  lastYear: MonthlyCostBar[];
  currentYear: number;
  lastYearNum: number;
}

const BAR_MAX_HEIGHT = 100;
const BAR_WIDTH = 12; // w-3
const BAR_GAP = 2; // gap-0.5
const BAR_RADIUS = 4; // rounded-t
const BILLED_COLOR = colors.chart.billed; // slate — Total Billed
const RESPONSIBILITY_COLOR = colors.chart.responsibility; // dark blue — Your Responsibility

/** Format axis values: $1,200 → "1.2k", $500 → "500" */
function formatAxis(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return Math.round(value).toLocaleString();
}

/** A bar with rounded top corners only, sitting on the chart's baseline. */
function topRoundedBar(x: number, height: number): string {
  const r = Math.min(BAR_RADIUS, height, BAR_WIDTH / 2);
  const y = BAR_MAX_HEIGHT - height;
  const right = x + BAR_WIDTH;
  return [
    `M${x},${BAR_MAX_HEIGHT}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${right - r},${y}`,
    `Q${right},${y} ${right},${y + r}`,
    `L${right},${BAR_MAX_HEIGHT}`,
    "Z",
  ].join(" ");
}

export function CostComparisonChart({ thisYear, lastYear, currentYear, lastYearNum }: CostComparisonChartProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState<"thisYear" | "lastYear">("thisYear");

  const data = selectedYear === "thisYear" ? thisYear : lastYear;
  const selectedYearNum = selectedYear === "thisYear" ? currentYear : lastYearNum;
  const totals = sumYearTotals(data);

  const maxValue = data.reduce((max, item) => Math.max(max, item.totalBilled, item.yourResponsibility), 0);

  const getBarHeight = (value: number): number => {
    if (maxValue === 0) return 0;
    return Math.max((value / maxValue) * BAR_MAX_HEIGHT, 2);
  };

  const pairWidth = BAR_WIDTH * 2 + BAR_GAP;

  return (
    <div className="bg-brand-surface rounded-xl shadow-sm overflow-hidden">
      {/* Dark header — collapsible toggle */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="bg-slate-700 flex-row items-center justify-between px-4 py-3 active:bg-slate-600 text-left"
        aria-label={expanded ? t("claims.costChart.collapseLabel") : t("claims.costChart.expandLabel")}
        aria-expanded={expanded}
      >
        <div className="flex-row items-center">
          <Icon name="bar-chart" size={18} color={colors.brand.surface} />
          <div className="ml-2">
            <span className="text-white text-sm font-semibold">{t("claims.costChart.title")}</span>
            <span className="text-white text-xs">{t("claims.costChart.subtitle")}</span>
          </div>
        </div>
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={18} color={colors.brand.surface} />
      </button>

      {expanded && (
        <div className="px-4 pt-3 pb-4">
          {/* Year toggle buttons */}
          <div className="flex-row justify-center gap-2 mb-4" role="tablist">
            <button
              type="button"
              onClick={() => setSelectedYear("thisYear")}
              className={`px-4 py-2 rounded-lg ${
                selectedYear === "thisYear" ? "bg-slate-600" : "bg-brand-surface border border-gray-200"
              }`}
              role="tab"
              aria-label={t("claims.costChart.thisYear")}
              aria-selected={selectedYear === "thisYear"}
            >
              <span className={`text-sm font-medium ${selectedYear === "thisYear" ? "text-white" : "text-gray-600"}`}>
                {t("claims.costChart.thisYear")} ({currentYear})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedYear("lastYear")}
              className={`px-4 py-2 rounded-lg ${
                selectedYear === "lastYear" ? "bg-slate-600" : "bg-brand-surface border border-gray-200"
              }`}
              role="tab"
              aria-label={t("claims.costChart.lastYear")}
              aria-selected={selectedYear === "lastYear"}
            >
              <span className={`text-sm font-medium ${selectedYear === "lastYear" ? "text-white" : "text-gray-600"}`}>
                {t("claims.costChart.lastYear")} ({lastYearNum})
              </span>
            </button>
          </div>

          {/* Annual totals for the selected year — one group for screen readers */}
          <div
            className="flex-row gap-3 mb-4"
            role="group"
            aria-label={t("claims.costChart.totalsLabel", {
              year: selectedYearNum,
              totalBilled: formatClaimAmount(totals.totalBilled),
              yourResponsibility: formatClaimAmount(totals.yourResponsibility),
            })}
          >
            <div className="flex-1 bg-blue-50 rounded-xl p-3">
              <Caption>{t("claims.totalBilled")}</Caption>
              <span className="text-[10px] text-gray-500">{selectedYearNum}</span>
              <span className="text-lg font-bold text-brand-primary mt-1">{formatClaimAmount(totals.totalBilled)}</span>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-3">
              <Caption>{t("claims.yourResponsibility")}</Caption>
              <span className="text-[10px] text-gray-500">{selectedYearNum}</span>
              <span className="text-lg font-bold text-brand-primary mt-1">
                {formatClaimAmount(totals.yourResponsibility)}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-row justify-center gap-4 mb-3">
            <div className="flex-row items-center">
              <div className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: BILLED_COLOR }} />
              <span className="text-xs text-gray-600">{t("claims.totalBilled")}</span>
            </div>
            <div className="flex-row items-center">
              <div className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: RESPONSIBILITY_COLOR }} />
              <span className="text-xs text-gray-600">{t("claims.yourResponsibility")}</span>
            </div>
          </div>

          {/* Bar chart with Y-axis */}
          <div className="flex-row">
            {/* Y-axis labels */}
            <div className="justify-between items-end pr-2" style={{ height: BAR_MAX_HEIGHT }}>
              <span className="text-[9px] text-gray-500">${formatAxis(maxValue)}</span>
              <span className="text-[9px] text-gray-500">${formatAxis(maxValue * 0.5)}</span>
              <span className="text-[9px] text-gray-500">$0</span>
            </div>

            {/* Bars area */}
            <div className="flex-1">
              {/* Gridlines */}
              <div className="absolute w-full" style={{ height: BAR_MAX_HEIGHT }}>
                <div className="absolute top-0 w-full border-b border-gray-100" />
                <div className="absolute w-full border-b border-gray-100" style={{ top: BAR_MAX_HEIGHT * 0.5 }} />
                <div className="absolute bottom-0 w-full border-b border-gray-100" />
              </div>

              <div className="flex-row items-end justify-between">
                {data.map((item) => (
                  <div key={item.month} className="items-center flex-1">
                    <svg
                      width={pairWidth}
                      height={BAR_MAX_HEIGHT}
                      viewBox={`0 0 ${pairWidth} ${BAR_MAX_HEIGHT}`}
                      aria-hidden="true"
                    >
                      {getBarHeight(item.totalBilled) > 0 && (
                        <path d={topRoundedBar(0, getBarHeight(item.totalBilled))} fill={BILLED_COLOR} />
                      )}
                      {getBarHeight(item.yourResponsibility) > 0 && (
                        <path
                          d={topRoundedBar(BAR_WIDTH + BAR_GAP, getBarHeight(item.yourResponsibility))}
                          fill={RESPONSIBILITY_COLOR}
                        />
                      )}
                    </svg>
                    <span className="text-[10px] text-brand-secondary mt-1.5">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span className="text-[10px] text-gray-500 text-center mt-3">{t("claims.processedFootnote")}</span>
        </div>
      )}
    </div>
  );
}
