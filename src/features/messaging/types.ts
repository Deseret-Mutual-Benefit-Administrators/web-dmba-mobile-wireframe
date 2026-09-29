/**
 * Secure messaging feature types.
 *
 * Matches the member API's `MessagingModels.cs` — JSON is the camelCase of
 * those C# records. `id` (not `threadId`/`messageId`) on both the thread and
 * message records, `regardingMemberId` present on both thread summary and
 * detail, and the detail response is a **superset** of the summary
 * (`hasUnread`, `messageCount`, `lastMessagePreview`, `regardingMemberId` all
 * carry through, plus `contextJson` and `messages`) — confirmed directly with
 * the team lead against the controller agent's concurrent edits to that file,
 * after an earlier pass here had briefly diverged from it. See
 * `docs/dev-complete-plan-2026-09.md` §5 Block 2 item #3.
 */

/** Wire keys, matching `MessageTopics.TryParse` on the API. */
export type MessageTopic =
  | "claims"
  | "benefitsCoverage"
  | "idCard"
  | "spendingAccounts"
  | "retirement"
  | "priorAuthorization"
  | "other";

/**
 * The API's own thread status. **Nothing in the app branches on it** (ADR-206):
 * the member-facing states are Open and Archived — those two and nothing else
 * since ADR-208 removed member delete — and staff "Closed" is
 * a staff-queue flag the member never sees — a staff-closed thread stays in the
 * member's Open list and replying to it works exactly as it does on any other
 * open thread (the API reopens it). The type stays because the field is still
 * on the wire and `MessagingInboxFilters.status` can still narrow a request;
 * the inbox deliberately never sets it.
 */
export type MessageThreadStatus = "open" | "closed";

/**
 * `general` covers the plain compose flow; `claimSubmission`/`denialQuestion`
 * back #5/#6 (thin layers on this store). `chatHandoff` (2026-09, plan
 * §1.5/§1.7 step 8) is filed server-side only — `POST
 * /chat/conversations/{id}/handoff` creates it directly via
 * `IMessagingRepository.CreateThreadAsync`, never through the mobile compose
 * flow (`MessageValidator` rejects `kind=chatHandoff` from public compose).
 */
export type MessageThreadKind = "general" | "claimSubmission" | "denialQuestion" | "chatHandoff";

/**
 * `system` (ADR-197) is the automatic acknowledgement the member API writes as
 * the second message of every new thread. It has no actor: no member id, no
 * staff UPN, it never marks the thread unread and never assigns it. The API
 * stores an **English** body so the row stays readable in the database and the
 * admin console; the app ignores that body and renders from i18n keyed on the
 * thread's kind, so a Spanish member reads Spanish. See `systemMessage.ts`.
 */
export type MessageSenderKind = "member" | "staff" | "system";

/**
 * The malware-scan verdict on one attachment (ADR-202). `pending` is the
 * state every row starts in and the state a row stays in when no verdict
 * exists yet; only `clean` is servable. An unknown value must never be read
 * as clean — the mapping in `services/attachmentGate.ts` treats anything it
 * doesn't recognise as the safe branch.
 */
export type AttachmentScanStatus = "pending" | "clean" | "malicious";

/** One attachment's metadata — never the bytes. Fetch those via `useAttachmentContent`. */
export interface MessageAttachment {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  /** ADR-202 — required on the wire in thread detail, inbox previews and the staged-upload 201. */
  scanStatus: AttachmentScanStatus;
}

/** One message within a thread's detail view. Never an internal note; the API filters those out. */
export interface Message {
  id: string;
  senderKind: MessageSenderKind;
  senderDisplayName: string;
  body: string;
  createdAtUtc: string;
  attachments: MessageAttachment[];
}

/** `GET /messages` row — `MessageThreadSummaryResponse`. */
export interface MessageThreadSummary {
  id: string;
  topic: MessageTopic;
  subject: string;
  kind: MessageThreadKind;
  status: MessageThreadStatus;
  regardingMemberId: string | null;
  regardingDisplayName: string | null;
  hasUnread: boolean;
  /**
   * Whether Member Services has replied on this thread yet. Server-side truth,
   * never inferred here: `messageCount` also counts the member's own messages
   * and the automatic system acknowledgement, so it cannot answer this. Drives
   * the inbox's swipe-right read toggle (ADR-208) — there is nothing to mark
   * unread on a thread nobody has answered.
   */
  hasStaffReply: boolean;
  isArchived: boolean;
  createdAtUtc: string;
  lastMessageAtUtc: string;
  /** Null only when a thread somehow has no non-internal message at all (should not occur). */
  lastMessagePreview: string | null;
  /** Count of non-internal messages only — an internal note never moves this. */
  messageCount: number;
  assignedToDisplayName: string | null;
}

/** `GET /messages/{threadId}` — `MessageThreadDetailResponse`. A superset of {@link MessageThreadSummary}. */
export interface MessageThreadDetail extends MessageThreadSummary {
  contextJson: string | null;
  /** Every non-internal message on the thread, oldest first. */
  messages: Message[];
}

/**
 * Mirrors the API's shared `PaginatedResponse<T>` (`ClaimResponses.cs`), which
 * also carries an `Unavailable` field (ADR-139, vendor-outage rows). Omitted
 * here on purpose, matching every other mobile feature's own paginated-list
 * type (e.g. `search/types.ts`): messaging has no vendor-backed read in its
 * path, so the field would always be null and every consumer would have to
 * carry dead code to account for it.
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

/** The Messages inbox's two segments (ADR-173) — the member's own messages vs. the AI Advisor's conversation history. */
export const MESSAGES_TABS = ["messages", "advisor"] as const;
export type MessagesTab = (typeof MESSAGES_TABS)[number];

export interface MessagingInboxFilters {
  status?: MessageThreadStatus;
  archived?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * The inbox's two filter chips (ADR-206). Open is everything the member hasn't
 * archived — including threads staff have closed, which the member has no
 * concept of. Archived is what they moved out of it themselves. Between them
 * they hold every thread the member has: archiving is the only thing that
 * moves one, and nothing removes it (ADR-208).
 */
export const INBOX_FILTERS = ["open", "archived"] as const;
export type InboxFilter = (typeof INBOX_FILTERS)[number];

export interface RegardingOption {
  memberId: string;
  firstName: string;
  lastName: string;
  relationship: string;
}

/** `POST /messages` request body. */
export interface CreateThreadRequest {
  topic: MessageTopic;
  subject: string;
  body: string;
  regardingMemberId?: string;
  attachmentIds?: string[];
  kind?: MessageThreadKind;
  contextJson?: string;
}

/** `POST /messages/{threadId}/replies` request body. */
export interface ReplyToThreadRequest {
  body: string;
  attachmentIds?: string[];
}

/**
 * `POST /messages/attachments` response — the staged attachment's metadata.
 * `scanStatus` is `pending` on every fresh upload (ADR-202 decision 2:
 * attaching is allowed while the verdict is pending), so nothing in compose
 * blocks on it.
 */
export interface UploadAttachmentResponse {
  id: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  scanStatus: AttachmentScanStatus;
}

/** `GET /messages/{threadId}/attachments/{id}` response — an image's bytes, for the viewer. */
export interface AttachmentContent {
  fileName: string;
  contentType: string;
  base64: string;
  contentLength: number;
}

/** `GET /messages/unread-count` response. */
export interface UnreadCountResponse {
  unreadCount: number;
}

/**
 * One in-progress attachment on the compose/reply form — `useMessageAttachments`'
 * client-only state, never sent verbatim. `uploadedId` is what actually goes on
 * the wire (`attachmentIds`) once the upload settles.
 */
export interface MessageAttachmentDraft {
  /** Stable local id — also the on-disk filename stem for the sealed staging blob. */
  localId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  /** Path to the sealed staging blob. Null once the upload has succeeded and it's been deleted. */
  encryptedPath: string | null;
  /** The server's attachment id, once `POST /messages/attachments` has succeeded. */
  uploadedId: string | null;
  /**
   * The scan verdict the staged-upload 201 came back with — `pending` on
   * every fresh upload (ADR-202). Null until that response lands. Recorded
   * only so the draft mirrors the server's row; compose shows nothing for it,
   * because attaching while the verdict is pending is the decision.
   */
  scanStatus: AttachmentScanStatus | null;
  status: "uploading" | "uploaded" | "error";
}
