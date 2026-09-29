/**
 * AI Benefits Advisor chat types.
 *
 * Matches the member API's `Models/ChatModels.cs` — JSON is the camelCase of
 * those C# records (see `docs/dev-complete-plan-2026-09.md` plan §1.5/§1.7).
 * `id` (not `conversationId`/`turnId`) on every record, matching the same
 * convention `messaging/types.ts` uses. Every turn — member or assistant —
 * comes back in the same flat shape; `citations`/`outcome`/`handoffOffered`
 * are always present but are only ever populated for an assistant turn.
 *
 * This is a plan-stage contract written ahead of the API landing. If the
 * live `ChatModels.cs` shape differs once Lane C ships, this file (and every
 * hook built on it) is the one place to reconcile.
 */

/** Wire keys — mirrors `chat.Conversations.Status` (`Active`/`HandedOff`). */
export type ConversationStatus = "active" | "handedOff";

/** Wire keys — mirrors `chat.Turns.Role` (`member`/`assistant`). */
export type ChatTurnRole = "member" | "assistant";

/**
 * Wire keys — mirrors `chat.Turns.Outcome`
 * (`Answered`/`Refused`/`Regenerated`/`HandoffOffered`/`Error`). Meaningful
 * on an assistant turn; a member turn carries `"answered"` as an inert
 * default rather than a nullable field, since the server always populates
 * every turn the same way (plan §1.7 step 6).
 */
export type ChatTurnOutcome = "answered" | "refused" | "regenerated" | "handoffOffered" | "error";

/**
 * One citation on an assistant turn — resolved server-side from
 * `chat.KnowledgeSections` (plan §1.3). `sectionId` is the stable id that
 * keeps resolving after a later publish; `planId` is null for a section with
 * no per-plan facts (`whatItIs`/`needToKnow`/`limitations`).
 */
export interface Citation {
  sectionId: string;
  topicKey: string;
  title: string;
  planId: string | null;
  /**
   * The owning topic's category wire key (`medical`, `dental`, `pharmacy`,
   * `spendingAccount`, `general`) — picks the Coverage sub-tab a citation
   * lands on (ADR-174 §3, `subTabForCategory`).
   */
  category: string;
}

/** `GET /chat/conversations/{id}` — one turn in a conversation's history. */
export interface ChatTurn {
  id: string;
  role: ChatTurnRole;
  content: string;
  createdAtUtc: string;
  citations: Citation[];
  outcome: ChatTurnOutcome;
  handoffOffered: boolean;
}

/** `GET /chat/conversations` row. */
export interface ConversationSummary {
  id: string;
  title: string;
  status: ConversationStatus;
  lastMessageAtUtc: string;
  createdAtUtc: string;
  isArchived: boolean;
}

/**
 * `GET /chat/conversations?archived=` query params (ADR-185) — mirrors
 * `MessagingInboxFilters`'s `archived` field. `undefined` omits the param
 * entirely, which the server treats as `false`.
 */
export interface ChatListFilters {
  archived?: boolean;
}

/** `GET /chat/conversations/{id}` / `POST /chat/conversations` — a superset of {@link ConversationSummary}. */
export interface ConversationDetail extends ConversationSummary {
  turns: ChatTurn[];
}

/**
 * Mirrors the messaging feature's own copy of the shared `PaginatedResponse<T>`
 * shape (`messaging/types.ts`) — omitted here per that file's doc comment:
 * chat has no vendor-backed read in its path, so an `Unavailable` field would
 * always be null.
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

/** `POST /chat/conversations` request body. */
export interface CreateConversationRequest {
  message: string;
  language: "en" | "es";
}

/** `POST /chat/conversations/{id}/messages` request body. */
export interface SendMessageRequest {
  message: string;
}

/** `POST /chat/conversations/{id}/messages` response. */
export interface SendMessageResponse {
  turn: ChatTurn;
  conversation: ConversationSummary;
}

/** `POST /chat/conversations/{id}/handoff` request body. */
export interface HandoffRequest {
  note?: string;
}

/** `POST /chat/conversations/{id}/handoff` response. */
export interface HandoffResponse {
  threadId: string;
}

/** `GET /chat/suggested-questions` response — a static, per-category list in September. */
export interface SuggestedQuestionsResponse {
  questions: string[];
}
