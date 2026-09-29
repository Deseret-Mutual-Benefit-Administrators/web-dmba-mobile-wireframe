import { useState, type ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { InlineErrorState } from "@/src/shared/components/InlineErrorState";
import { Spinner } from "@/src/shared/components/Spinner";
import { colors, withAlpha } from "@/src/shared/theme/colors";
import { dashboardHeroGradient, gradientCss } from "@/src/shared/theme/gradients";
import { CollapsibleDeductibleCard } from "../components/CollapsibleDeductibleCard";
import { CollapsibleDentalCard } from "../components/CollapsibleDentalCard";
import { QuickActions } from "../components/QuickActions";
import { RecentClaims } from "../components/RecentClaims";
import { AlertBannerCarousel } from "../components/AlertBannerCarousel";
import { reconcileOrderWithDefaults } from "../services/reconcileCardOrder";
import { placeholderAccumulators, placeholderDashboard, placeholderDisplayPreferences, placeholderUser } from "../placeholder";
import { HsaCard } from "@/src/features/financial-accounts/components/HsaCard";
import { FsaCard } from "@/src/features/financial-accounts/components/FsaCard";
import { LpfsaCard } from "@/src/features/financial-accounts/components/LpfsaCard";
import { DepcCard } from "@/src/features/financial-accounts/components/DepcCard";
import { RetirementCard } from "@/src/features/financial-accounts/components/RetirementCard";
import { MrpCard } from "@/src/features/financial-accounts/components/MrpCard";
import { LifeInsuranceCard } from "@/src/features/financial-accounts/components/LifeInsuranceCard";
import { useFinancialSummary } from "@/src/features/financial-accounts/components/cardData";
import type { FinancialSummaryAccountKey } from "@/src/features/financial-accounts/components/cardTypes";
import { CarouselSection } from "@/src/features/carousel/components/CarouselSection";

/** Dashboard card ids backed by the accounts summary (ADR-139 visibility rule applies). */
const FINANCIAL_CARD_IDS = ["hsa", "fsa", "lpfsa", "depc", "retirement", "mrp", "life"];

/**
 * Dashboard screen — the Home tab. Gradient hero header with greeting, plan
 * and member ID, then the cards in the member's saved order.
 *
 * Placeholder states: `?state=loading|error|empty` (empty = no recent claims);
 * `?accounts=loading|error|summaryError` for the financial cards;
 * `?carousel=loading|empty` for the article strip.
 */
export function DashboardRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const state = new URLSearchParams(useLocation().search).get("state");
  const user = placeholderUser;
  const isLoading = state === "loading";
  const error = state === "error";
  const data = isLoading || error ? undefined : placeholderDashboard;
  const financialSummary = useFinancialSummary();

  // Two selections, deliberately: the medical and dental cards each own their picker.
  const [medicalMember, setMedicalMember] = useState<string | undefined>("family");
  const [dentalMember, setDentalMember] = useState<string | undefined>("family");
  const medicalAcc = { ...placeholderAccumulators, selectedMemberId: medicalMember, setSelectedMemberId: setMedicalMember };
  const dentalAcc = { ...placeholderAccumulators, selectedMemberId: dentalMember, setSelectedMemberId: setDentalMember };

  const cardOrder = reconcileOrderWithDefaults(placeholderDisplayPreferences.cardOrder);
  const hiddenCards = placeholderDisplayPreferences.hiddenCards;

  const isCardVisible = (cardId: string) => !hiddenCards.includes(cardId);

  const summaryUnavailable = financialSummary.data?.unavailable ?? [];
  const onBehalfName = financialSummary.data?.onBehalf ?? {};
  const summaryFailedOutright = financialSummary.isError && !financialSummary.data;
  const firstFinancialSlot = cardOrder.find((id) => FINANCIAL_CARD_IDS.includes(id) && isCardVisible(id));
  const renderFinancialCard = (cardId: string, field: FinancialSummaryAccountKey, card: ReactElement) => {
    if (summaryFailedOutright) {
      return cardId === firstFinancialSlot ? (
        <div key="financial-summary-error" className="bg-brand-surface rounded-2xl mb-3 shadow-sm">
          <InlineErrorState message={t("common.accountsUnavailable")} onRetry={() => financialSummary.refetch()} className="px-4 py-6" />
        </div>
      ) : null;
    }
    const show = financialSummary.isLoading || !!financialSummary.data?.[field] || summaryUnavailable.includes(field);
    return show ? card : null;
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.goodMorning");
    if (hour < 17) return t("dashboard.goodAfternoon");
    return t("dashboard.goodEvening");
  };

  const firstName = data?.firstName ?? user?.firstName ?? "Member";
  const lastName = data?.lastName ?? user?.lastName ?? "";
  const selfFullName = `${firstName} ${lastName}`.trim();

  const hasMedicalData =
    medicalAcc.deductibleInNetwork !== null ||
    medicalAcc.oopMaxInNetwork !== null ||
    medicalAcc.deductibleOutOfNetwork !== null ||
    medicalAcc.oopMaxOutOfNetwork !== null;

  const hasDentalData = dentalAcc.dentalDeductible !== null || dentalAcc.dentalAnnualMax !== null;

  if (isLoading && !data) {
    return (
      <div className="flex-1 bg-brand-background items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-secondary mt-3 text-sm">{t("common.loading")}</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex-1 bg-brand-background" style={{ justifyContent: "center", alignItems: "center", padding: 24 }}>
        <p className="text-error text-base font-medium mb-2">{t("common.error")}</p>
        <p className="text-brand-secondary text-sm text-center mb-4">{t("dashboard.loadError")}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-background">
      {/* ===== Gradient Hero Header ===== */}
      <div
        style={{
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 16,
          paddingBottom: 44,
          overflow: "hidden",
          background: gradientCss(dashboardHeroGradient, 135),
        }}
      >
        {/* Decorative blurred circles (matches Figma) */}
        <div className="absolute rounded-full" style={{ top: -80, right: -80, width: 220, height: 220, backgroundColor: withAlpha(colors.brand.surface, 0.08) }} />
        <div className="absolute rounded-full" style={{ bottom: -60, left: -60, width: 180, height: 180, backgroundColor: withAlpha(colors.brand.surface, 0.06) }} />
        <div className="absolute rounded-full" style={{ top: 60, right: 40, width: 100, height: 100, backgroundColor: withAlpha(colors.financial.gradientStart, 0.15) }} />

        {/* Greeting + Plan Name + Member ID */}
        <div className="relative z-10">
          {/* Gear icon — opens dashboard customization. */}
          <button
            type="button"
            onClick={() => navigate("/dashboard/customize")}
            style={{ position: "absolute", top: -8, right: -8, padding: 12, zIndex: 20 }}
            aria-label={t("dashboard.customize")}
          >
            <Icon name="settings-outline" size={22} color={colors.brand.surface} />
          </button>

          <h2 className="text-white text-2xl font-bold">
            {getGreeting()}, {firstName}
          </h2>

          {data?.planName && (
            <div className="flex-row items-center mt-2">
              <Icon name="shield-checkmark" size={15} color={withAlpha(colors.brand.surface, 0.75)} />
              <span className="text-white text-sm ml-1.5">{data.planName}</span>
            </div>
          )}

          {user?.memberId && (
            <p className="text-white text-xs mt-1">
              {t("dashboard.memberId")}: {user.memberId}
            </p>
          )}
        </div>
      </div>

      {/* ===== Content Cards — rendered in saved order; first card overlaps the hero ===== */}
      <div className="px-4" style={{ marginTop: -24 }}>
        {cardOrder.map((cardId) => {
          if (!isCardVisible(cardId)) return null;

          switch (cardId) {
            case "deductible":
              return data || hasMedicalData ? (
                <CollapsibleDeductibleCard
                  key="deductible"
                  planName={data?.planName ?? t("dashboard.benefits")}
                  deductibleInNetwork={medicalAcc.deductibleInNetwork}
                  oopMaxInNetwork={medicalAcc.oopMaxInNetwork}
                  oopMaxInNetworkIsUnlimited={medicalAcc.oopMaxInNetworkIsUnlimited}
                  deductibleOutOfNetwork={medicalAcc.deductibleOutOfNetwork}
                  oopMaxOutOfNetwork={medicalAcc.oopMaxOutOfNetwork}
                  oopMaxOutOfNetworkIsUnlimited={medicalAcc.oopMaxOutOfNetworkIsUnlimited}
                  familyDeductibleInNetwork={medicalAcc.familyDeductibleInNetwork}
                  familyOopMaxInNetwork={medicalAcc.familyOopMaxInNetwork}
                  familyOopMaxInNetworkIsUnlimited={medicalAcc.familyOopMaxInNetworkIsUnlimited}
                  familyMembers={medicalAcc.familyMembers}
                  familyBucketsAvailable={medicalAcc.familyBucketsAvailable}
                  selectedMemberId={medicalAcc.selectedMemberId}
                  onSelectMember={medicalAcc.setSelectedMemberId}
                  selfName={selfFullName}
                />
              ) : null;

            case "dental":
              return hasDentalData ? (
                <CollapsibleDentalCard
                  key="dental"
                  dentalAnnualMax={dentalAcc.dentalAnnualMax}
                  dentalDeductible={dentalAcc.dentalDeductible}
                  ortho={null}
                  familyMembers={dentalAcc.familyMembers}
                  selectedMemberId={dentalAcc.selectedMemberId}
                  onSelectMember={dentalAcc.setSelectedMemberId}
                  selfName={selfFullName}
                />
              ) : null;

            case "hsa":
              return renderFinancialCard("hsa", "hsa", <HsaCard key="hsa" onBehalfOfName={onBehalfName.spendingAccounts} />);

            case "fsa":
              return renderFinancialCard("fsa", "fsa", <FsaCard key="fsa" onBehalfOfName={onBehalfName.spendingAccounts} />);

            case "lpfsa":
              return renderFinancialCard("lpfsa", "lpfsa", <LpfsaCard key="lpfsa" onBehalfOfName={onBehalfName.spendingAccounts} />);

            case "depc":
              return renderFinancialCard("depc", "depc", <DepcCard key="depc" onBehalfOfName={onBehalfName.spendingAccounts} />);

            case "retirement":
              return renderFinancialCard("retirement", "retirement401k", <RetirementCard key="retirement" onBehalfOfName={onBehalfName.retirement401k} />);

            case "mrp":
              return renderFinancialCard("mrp", "masterRetirement", <MrpCard key="mrp" onBehalfOfName={onBehalfName.masterRetirement} />);

            case "life":
              return renderFinancialCard("life", "lifeInsurance", <LifeInsuranceCard key="life" onBehalfOfName={onBehalfName.lifeInsurance} />);

            case "nudges":
              // Renders nothing until the nudges feed supplies real items (ADR-157).
              return (
                <div key="nudges">
                  <AlertBannerCarousel />
                </div>
              );

            case "carousel":
              return (
                <div key="carousel">
                  <CarouselSection />
                </div>
              );

            case "claims":
              return (
                <div key="claims" className="mb-3">
                  <RecentClaims claims={state === "empty" ? [] : (data?.recentClaims ?? [])} />
                </div>
              );

            case "quickActions":
              return (
                <div key="quickActions" className="pb-8">
                  <QuickActions />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
