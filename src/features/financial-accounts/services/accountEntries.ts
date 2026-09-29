/**
 * Local stand-in for the app's `financial-accounts/services/accountEntries.ts`:
 * one row shape for both of an account's sources (card transactions and the
 * adjudicated activity feed), plus the merge, the per-account narrowing and
 * the search/status filter.
 */
import type { AccountActivityItem, AccountTransaction } from "../types";
import { vendorCodeToAccountType, type SpendingAccountType } from "./accountList";

export type EntryStatusTone = "approved" | "pending" | "denied" | "neutral";

export interface AccountEntry {
  key: string;
  /** The source row's id — the transaction id a receipt is attached to. */
  sourceId: string;
  source: "transaction" | "activity";
  title: string;
  subtitle: string | null;
  date: string;
  amount: number;
  isDeposit: boolean;
  status: { labelKey: string | null; rawLabel: string; tone: EntryStatusTone; icon: string | null } | null;
  typeChip: { labelKey: string; icon: string } | null;
  receiptAction: { kind: "attach" } | { kind: "view"; fileKey: number } | null;
  hasDetail: boolean;
  adjudication: {
    isDenied: boolean;
    denialReason: string | null;
    denialComment: string | null;
    billedAmount: number | null;
    allowedAmount: number | null;
    coveredAmount: number | null;
    accountsPaidAmount: number | null;
    deductibleAmount: number | null;
    checkNumber: string | null;
    reimbursementDate: string | null;
    balanceDue: number | null;
  } | null;
  settlementDate: string | null;
  claimant: string | null;
  accountType: SpendingAccountType | null;
  accountTypeCode: string | null;
}

const STATUS_BY_WORD: Record<string, { labelKey: string; tone: EntryStatusTone; icon: string }> = {
  approved: { labelKey: "financialAccounts.transactions.approved", tone: "approved", icon: "checkmark-circle" },
  paid: { labelKey: "spendingClaims.status.paid", tone: "approved", icon: "checkmark-circle" },
  pending: { labelKey: "financialAccounts.transactions.pending", tone: "pending", icon: "time" },
  processing: { labelKey: "financialAccounts.transactions.processing", tone: "pending", icon: "time" },
  denied: { labelKey: "financialAccounts.transactions.denied", tone: "denied", icon: "close-circle" },
};

function toStatus(raw: string | null): AccountEntry["status"] {
  if (!raw || raw.trim() === "") return null;
  const known = STATUS_BY_WORD[raw.trim().toLowerCase()];
  if (known) return { labelKey: known.labelKey, rawLabel: raw, tone: known.tone, icon: known.icon };
  return { labelKey: null, rawLabel: raw, tone: "neutral", icon: null };
}

const TYPE_CHIP: Record<AccountActivityItem["type"], { labelKey: string; icon: string }> = {
  claim: { labelKey: "financialAccounts.activity.type.claim", icon: "document-text-outline" },
  manualClaim: { labelKey: "financialAccounts.activity.type.manualClaim", icon: "create-outline" },
  deposit: { labelKey: "financialAccounts.activity.type.deposit", icon: "arrow-down-circle-outline" },
  cardTransaction: { labelKey: "financialAccounts.activity.type.cardTransaction", icon: "card-outline" },
  other: { labelKey: "financialAccounts.activity.type.other", icon: "ellipsis-horizontal" },
};

export function transactionToEntry(tx: AccountTransaction, type: SpendingAccountType, index: number): AccountEntry {
  const firstReceipt = tx.receipts[0];
  const receiptAction: AccountEntry["receiptAction"] = firstReceipt
    ? { kind: "view", fileKey: firstReceipt.fileKey }
    : tx.canUploadReceipt && tx.status !== "Denied"
      ? { kind: "attach" }
      : null;
  return {
    key: `tx-${tx.id}-${index}`,
    sourceId: tx.id,
    source: "transaction",
    title: tx.merchantName ?? tx.description,
    subtitle: tx.merchantName ? tx.description : null,
    date: tx.date,
    amount: Math.abs(tx.amount),
    isDeposit: tx.amount > 0,
    status: toStatus(tx.status),
    typeChip: null,
    receiptAction,
    hasDetail: Boolean(tx.settlementDate || tx.claimant),
    adjudication: null,
    settlementDate: tx.settlementDate,
    claimant: tx.claimant,
    accountType: type,
    accountTypeCode: null,
  };
}

export function activityToEntry(item: AccountActivityItem, index: number): AccountEntry {
  const status = toStatus(item.displayStatus);
  const firstReceipt = item.receipts?.[0];
  return {
    key: `act-${item.id}-${index}`,
    sourceId: item.id,
    source: "activity",
    title: item.customDescription || item.description || "",
    subtitle: item.customDescription && item.description ? item.description : null,
    date: item.date,
    amount: Math.abs(item.amount),
    isDeposit: item.amount > 0,
    status,
    typeChip: TYPE_CHIP[item.type],
    receiptAction: firstReceipt ? { kind: "view", fileKey: firstReceipt.fileKey } : null,
    hasDetail: true,
    adjudication: {
      isDenied: status?.tone === "denied",
      denialReason: item.denialReason,
      denialComment: item.denialComment,
      billedAmount: item.billedAmount,
      allowedAmount: item.allowedAmount,
      coveredAmount: item.coveredAmount,
      accountsPaidAmount: item.accountsPaidAmount,
      deductibleAmount: item.deductibleAmount,
      checkNumber: item.checkNumber,
      reimbursementDate: item.reimbursementDate,
      balanceDue: item.balanceDue,
    },
    settlementDate: item.settlementDate,
    claimant: item.claimant,
    accountType: vendorCodeToAccountType(item.accountTypeCode),
    accountTypeCode: item.accountTypeCode && item.accountTypeCode.trim() !== "" ? item.accountTypeCode : null,
  };
}

/**
 * Narrow to one account. A row with no code at all (a member claim the vendor
 * has not adjudicated onto an account yet) rides along on every account's feed;
 * a row whose code maps to nothing appears only on the unfiltered surface.
 */
export function entriesForAccountFeed(entries: AccountEntry[], type: SpendingAccountType | null): AccountEntry[] {
  if (type === null) return entries;
  return entries.filter((entry) => entry.accountType === type || entry.accountTypeCode === null);
}

export function unresolvedAccountCodes(entries: AccountEntry[]): string[] {
  const codes = new Set<string>();
  for (const entry of entries) {
    if (entry.accountTypeCode !== null && entry.accountType === null) codes.add(entry.accountTypeCode);
  }
  return [...codes].sort();
}

interface Stream {
  entries: AccountEntry[];
  hasMore: boolean;
}

/** Newest first. The wireframe's sources are single pages, so nothing is withheld. */
export function mergeAccountEntries(
  transactions: Stream,
  activity: Stream
): { entries: AccountEntry[]; hasMore: boolean; fetchMoreFrom: "transaction" | "activity" | null } {
  const entries = [...transactions.entries, ...activity.entries].sort((a, b) => b.date.localeCompare(a.date));
  const fetchMoreFrom = transactions.hasMore ? "transaction" : activity.hasMore ? "activity" : null;
  return { entries, hasMore: fetchMoreFrom !== null, fetchMoreFrom };
}

export function filterEntries(
  entries: AccountEntry[],
  filter: { search: string; tone: EntryStatusTone | null }
): AccountEntry[] {
  const needle = filter.search.trim().toLowerCase();
  return entries.filter((entry) => {
    if (filter.tone !== null && entry.status?.tone !== filter.tone) return false;
    if (needle === "") return true;
    return [entry.title, entry.subtitle ?? "", entry.claimant ?? ""].some((text) => text.toLowerCase().includes(needle));
  });
}
