import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/src/shared/i18n";
import { Icon } from "@/src/shared/icons";
import { Card } from "@/src/shared/components/Card";
import { colors } from "@/src/shared/theme/colors";
import { formatCurrency, formatTransactionDate } from "../services/accountTransforms";
import type { AccountEntry, EntryStatusTone } from "../services/accountEntries";
import { oneLine } from "./textStyles";

/** Pill colours per tone — same pill as the transaction-status colours elsewhere. */
const STATUS_TONE_STYLE: Record<EntryStatusTone, { bg: string; text: string; icon: string }> = {
  approved: { bg: "bg-green-100", text: "text-green-800", icon: colors.tone.success.icon },
  pending: { bg: "bg-amber-100", text: "text-amber-800", icon: colors.tone.warning.icon },
  denied: { bg: "bg-red-100", text: "text-red-800", icon: colors.tone.error.icon },
  neutral: { bg: "bg-gray-100", text: "text-gray-700", icon: colors.neutral[600] },
};

interface AccountEntryRowProps {
  entry: AccountEntry;
  /** The account chip — "FSA 2024". Null where the header already names the account. */
  accountLabel: string | null;
  /** Suppresses the "attach receipt" write action on an on-behalf read (ADR-156). */
  isOnBehalf?: boolean;
}

/** One row, whichever source it came from — transaction or adjudicated activity. */
export function AccountEntryRow({ entry, accountLabel, isOnBehalf = false }: AccountEntryRowProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const title = entry.title || t("financialAccounts.activity.noDescription");
  const statusLabel = entry.status
    ? entry.status.labelKey
      ? t(entry.status.labelKey)
      : entry.status.rawLabel
    : null;

  const rowLabel = t("financialAccounts.transactions.transactionRow", {
    merchant: title,
    amount: formatCurrency(entry.amount),
    status: statusLabel ?? "",
    date: formatTransactionDate(entry.date),
  });

  const rowContent = (
    <>
      <div className="flex-row items-start justify-between">
        {/* Left: title / subtitle / date / chips */}
        <div className="flex-1 mr-3">
          <span className="text-sm font-semibold text-brand-primary" style={oneLine}>
            {title}
          </span>
          {entry.subtitle !== null && (
            <span className="text-xs text-gray-500 mt-0.5" style={oneLine}>
              {entry.subtitle}
            </span>
          )}
          <span className="text-xs text-gray-500 mt-0.5">{formatTransactionDate(entry.date)}</span>

          {(entry.typeChip !== null || accountLabel !== null) && (
            <div className="flex-row items-center mt-1.5 flex-wrap">
              {entry.typeChip !== null && (
                <div
                  className="flex-row items-center bg-gray-100 rounded-full px-2 py-0.5 mr-1.5 mb-1"
                  role="text"
                  aria-label={t(entry.typeChip.labelKey)}
                >
                  <span aria-hidden="true" style={{ marginRight: 3, display: "flex" }}>
                    <Icon name={entry.typeChip.icon} size={11} color={colors.neutral[500]} />
                  </span>
                  <span className="text-xs font-medium text-gray-600">{t(entry.typeChip.labelKey)}</span>
                </div>
              )}
              {accountLabel !== null && (
                <div className="bg-blue-50 rounded-full px-2 py-0.5 mb-1" role="text" aria-label={accountLabel}>
                  <span className="text-xs font-medium text-blue-700">{accountLabel}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: amount + status pill */}
        <div className="items-end">
          <span className={`text-sm font-bold mb-1 ${entry.isDeposit ? "text-green-600" : "text-brand-primary"}`}>
            {entry.isDeposit ? "+" : ""}
            {formatCurrency(entry.amount)}
          </span>
          {entry.status !== null && statusLabel !== null && (
            <div
              className={`flex-row items-center px-2 py-0.5 rounded-full ${STATUS_TONE_STYLE[entry.status.tone].bg}`}
              role="text"
              aria-label={statusLabel}
            >
              {entry.status.icon !== null && (
                <span aria-hidden="true" style={{ marginRight: 3, display: "flex" }}>
                  <Icon name={entry.status.icon} size={11} color={STATUS_TONE_STYLE[entry.status.tone].icon} />
                </span>
              )}
              <span className={`text-xs font-medium ${STATUS_TONE_STYLE[entry.status.tone].text}`}>{statusLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Receipt action — visible without expanding (FA-4). "Attach" is self-only (ADR-156). */}
      {entry.receiptAction !== null && !(isOnBehalf && entry.receiptAction.kind === "attach") && (
        <ReceiptAction entry={entry} action={entry.receiptAction} />
      )}

      {entry.hasDetail && expanded && <EntryDetail entry={entry} />}
    </>
  );

  if (!entry.hasDetail) {
    return (
      <Card className="mx-4 mb-2" accessibilityRole="text" accessibilityLabel={rowLabel}>
        {rowContent}
      </Card>
    );
  }

  return (
    // A div with role="button" rather than a <button>: the row contains the
    // receipt action, and a button inside a button is invalid HTML.
    <div
      onClick={() => setExpanded((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setExpanded((prev) => !prev);
      }}
      tabIndex={0}
      className="mx-4 mb-2 bg-brand-surface rounded-2xl px-4 py-3 shadow-sm"
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={rowLabel}
      title={expanded ? t("financialAccounts.transactions.hideDetails") : t("financialAccounts.transactions.showDetails")}
      aria-expanded={expanded}
    >
      {rowContent}
      <div className="items-center mt-1" aria-hidden="true">
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={14} color={colors.neutral[500]} />
      </div>
    </div>
  );
}

/** "Send a receipt" / "View receipt" on a row (FA-4, Phase 7). */
function ReceiptAction({
  entry,
  action,
}: {
  entry: AccountEntry;
  action: NonNullable<AccountEntry["receiptAction"]>;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isAttach = action.kind === "attach";
  const label = isAttach
    ? t("financialAccounts.transactions.attachReceipt")
    : t("financialAccounts.transactions.viewReceipt");

  return (
    <div className="mt-2 pt-2 border-t border-gray-100 flex-row">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (isAttach) {
            navigate(`/substantiate?transactionId=${encodeURIComponent(entry.sourceId)}`);
            return;
          }
          navigate(`/receipt/${action.fileKey}`);
        }}
        className="active:opacity-70"
        style={{ flexDirection: "row", alignItems: "center", paddingTop: 6, paddingBottom: 6, paddingRight: 12 }}
        aria-label={label}
        title={
          isAttach
            ? t("financialAccounts.transactions.attachReceiptHint")
            : t("financialAccounts.transactions.viewReceiptHint")
        }
      >
        <span aria-hidden="true" style={{ marginRight: 6, display: "flex" }}>
          <Icon name={isAttach ? "camera-outline" : "document-attach-outline"} size={16} color={colors.financial.gradientStart} />
        </span>
        <span style={{ color: colors.financial.gradientStart, fontSize: 13, fontWeight: "600" }}>{label}</span>
      </button>
    </div>
  );
}

/** The expanded section: adjudication detail, then the fields both sources carry. */
function EntryDetail({ entry }: { entry: AccountEntry }) {
  const { t } = useTranslation();
  const adjudication = entry.adjudication;

  return (
    <div className="mt-2 pt-2 border-t border-gray-100">
      {adjudication !== null && (
        <>
          {adjudication.isDenied && (adjudication.denialReason || adjudication.denialComment) && (
            <div className="bg-red-50 rounded-xl px-3 py-2 mb-2">
              {adjudication.denialReason && (
                <span className="text-xs font-semibold text-red-800">
                  {t("financialAccounts.activity.denialReason")}: {adjudication.denialReason}
                </span>
              )}
              {adjudication.denialComment && (
                <span className="text-xs text-red-700 mt-0.5">
                  {t("financialAccounts.activity.denialComment")}: {adjudication.denialComment}
                </span>
              )}
            </div>
          )}

          {adjudication.billedAmount != null && (
            <DetailLine label={t("financialAccounts.activity.billedAmount")} value={formatCurrency(adjudication.billedAmount)} />
          )}
          {adjudication.allowedAmount != null && (
            <DetailLine label={t("financialAccounts.activity.allowedAmount")} value={formatCurrency(adjudication.allowedAmount)} />
          )}
          {adjudication.coveredAmount != null && (
            <DetailLine label={t("financialAccounts.activity.coveredAmount")} value={formatCurrency(adjudication.coveredAmount)} />
          )}
          {adjudication.accountsPaidAmount != null && (
            <DetailLine label={t("financialAccounts.activity.paidAmount")} value={formatCurrency(adjudication.accountsPaidAmount)} />
          )}
          {adjudication.deductibleAmount != null && (
            <DetailLine label={t("financialAccounts.activity.deductibleAmount")} value={formatCurrency(adjudication.deductibleAmount)} />
          )}
          {adjudication.checkNumber && (
            <DetailLine
              label={t("financialAccounts.activity.reimbursedVia")}
              value={t("financialAccounts.activity.checkNumber", { number: adjudication.checkNumber })}
            />
          )}
          {adjudication.reimbursementDate && (
            <DetailLine
              label={t("financialAccounts.activity.reimbursedOn")}
              value={formatTransactionDate(adjudication.reimbursementDate)}
            />
          )}
          {adjudication.balanceDue != null && adjudication.balanceDue > 0 && (
            <div className="flex-row justify-between py-1">
              <span className="text-xs font-semibold text-red-700">{t("financialAccounts.activity.balanceDue")}</span>
              <span className="text-xs text-red-700 font-bold">{formatCurrency(adjudication.balanceDue)}</span>
            </div>
          )}
        </>
      )}

      {entry.settlementDate && (
        <DetailLine label={t("financialAccounts.transactions.settledOn")} value={formatTransactionDate(entry.settlementDate)} />
      )}
      {entry.claimant && <DetailLine label={t("financialAccounts.transactions.claimant")} value={entry.claimant} />}
    </div>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-row justify-between py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs text-brand-primary font-medium">{value}</span>
    </div>
  );
}
