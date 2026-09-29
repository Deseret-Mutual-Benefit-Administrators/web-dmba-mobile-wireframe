/**
 * Pure swipe-row action logic behind `SwipeableRow.tsx` (ADR-185, reworked by
 * ADR-206 and again by ADR-208) — no React, no `react-native`, no
 * `react-i18next`, and no import of the component itself, for the same reason
 * as `swipeableRowClasses.ts`: Jest runs with `testEnvironment: "node"` and
 * cannot transform `react-native`, so tests import this module directly and
 * never the component.
 *
 * This module decides *which* action a row offers on *which edge*, and what
 * each one's icon, tone and i18n keys are. The row component (`ThreadRow` for
 * the Messages inbox, `ConversationRow` for the AI Advisor conversation list)
 * is the only place that calls `t()` and builds the actual `SwipeRowAction`
 * objects the primitive renders.
 *
 * One module, two surfaces on purpose: the swipe language is meant to be
 * identical on both lists, and two copies of this rule drifted apart once
 * already. Only the i18n keys differ per surface, and they are kept as
 * separate key maps below because the hint strings are genuinely different
 * ("back to your inbox" vs. "back to your conversation list").
 *
 * **There is no delete action** (ADR-208). A member has exactly two places a
 * thread or conversation can be — Open and Archived — so archive is the only
 * thing either list removes a row with, and the member API no longer exposes a
 * delete endpoint for either.
 */

/** The four swipe-row actions either list ever shows. */
export type SwipeRowActionKind = "archive" | "unarchive" | "markUnread" | "markRead";

/** The subset the AI Advisor conversation list uses — it has no read state. */
export type ChatSwipeRowActionKind = Extract<SwipeRowActionKind, "archive" | "unarchive">;

export interface SwipeRowActions {
  /**
   * Revealed by swiping right. Optional: a row with nothing to toggle on this
   * edge offers no right swipe at all.
   */
  leading?: SwipeRowActionKind;
  /** Revealed by swiping left. Always present — every row can be archived or unarchived. */
  trailing: SwipeRowActionKind;
}

/** The AI Advisor list's narrower shape: an archive toggle on swipe left and nothing else. */
export interface ChatSwipeRowActions {
  trailing: ChatSwipeRowActionKind;
}

/**
 * The actions one Messages-inbox row offers (ADR-208).
 *
 * Swipe left is the archive toggle, which flips between "archive" and
 * "unarchive" depending on where the row currently lives. Swipe right toggles
 * the member's own read state, and exists only on an Open row that a staff
 * member has actually replied to: marking a thread unread is how a member
 * flags a reply to come back to, so on a thread with no reply yet there is
 * nothing to come back to, and in the Archived list the only useful move is
 * putting the thread back. `hasStaffReply` comes from the API's thread summary
 * — never inferred from the message count, which counts the member's own
 * messages and the automatic system acknowledgement too.
 */
export function messagingRowActions(row: {
  isArchived: boolean;
  isUnread: boolean;
  hasStaffReply: boolean;
}): SwipeRowActions {
  const canToggleRead = !row.isArchived && row.hasStaffReply;
  return {
    trailing: row.isArchived ? "unarchive" : "archive",
    leading: canToggleRead ? (row.isUnread ? "markRead" : "markUnread") : undefined,
  };
}

/**
 * The actions one AI Advisor conversation row offers — the archive toggle on
 * swipe left and nothing on swipe right. A conversation has no read state of
 * its own (the member is the only one who ever adds to it), so the read toggle
 * would have nothing to act on.
 */
export function chatRowActions(row: { isArchived: boolean }): ChatSwipeRowActions {
  return {
    trailing: row.isArchived ? "unarchive" : "archive",
  };
}

/** `Ionicons` glyph name for one action kind. */
export const swipeRowActionIcons: Record<SwipeRowActionKind, string> = {
  archive: "archive-outline",
  unarchive: "arrow-undo-outline",
  markUnread: "mail-unread-outline",
  markRead: "mail-open-outline",
};

/**
 * Swipe-row visual tone for one action kind. Every action a member can reach
 * by swiping is reversible in one tap, so all four are neutral; the
 * destructive tone `SwipeableRow` still supports has no caller (ADR-208).
 */
export const swipeRowActionTones: Record<SwipeRowActionKind, "destructive" | "neutral"> = {
  archive: "neutral",
  unarchive: "neutral",
  markUnread: "neutral",
  markRead: "neutral",
};

/** The label (button text + accessibilityLabel) and hint keys for one action. */
export interface SwipeRowActionI18nKeys {
  label: string;
  hint: string;
}

/** Per-surface i18n keys, passed to the row component's action builder. */
export type SwipeRowActionKeyMap<K extends SwipeRowActionKind = SwipeRowActionKind> = Record<
  K,
  SwipeRowActionI18nKeys
>;

/** Messages inbox keys (`messaging.inbox.*` labels, `messaging.thread.*Hint` hints). */
export const messagingRowActionKeys: SwipeRowActionKeyMap = {
  archive: { label: "messaging.inbox.archive", hint: "messaging.thread.archiveHint" },
  unarchive: { label: "messaging.inbox.unarchive", hint: "messaging.thread.unarchiveHint" },
  markUnread: { label: "messaging.inbox.markUnread", hint: "messaging.thread.markUnreadHint" },
  markRead: { label: "messaging.inbox.markRead", hint: "messaging.thread.markReadHint" },
};

/** AI Advisor conversation-list keys — top-level `chat.*`, not a nested namespace. */
export const chatRowActionKeys: SwipeRowActionKeyMap<ChatSwipeRowActionKind> = {
  archive: { label: "chat.archive", hint: "chat.archiveHint" },
  unarchive: { label: "chat.unarchive", hint: "chat.unarchiveHint" },
};
