/**
 * Static sample data for the AI Benefits Advisor wireframe, shaped by
 * `types.ts`. Every answer is illustrative: it says where to look and never
 * states a plan figure (deductible, coinsurance, copay, visit limit). Citation
 * titles are marked as sample topics.
 */
import type { ChatTurn, Citation, ConversationDetail, ConversationSummary } from "./types";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const cite = (topicKey: string, title: string, category = "medical"): Citation => ({
  sectionId: `${topicKey}-section`,
  topicKey,
  title,
  planId: null,
  category,
});

const member = (id: string, content: string, at: string): ChatTurn => ({
  id,
  role: "member",
  content,
  createdAtUtc: at,
  citations: [],
  outcome: "answered",
  handoffOffered: false,
});

const assistant = (id: string, content: string, at: string, citations: Citation[], extra: Partial<ChatTurn> = {}): ChatTurn => ({
  id,
  role: "assistant",
  content,
  createdAtUtc: at,
  citations,
  outcome: "answered",
  handoffOffered: false,
  ...extra,
});

export const CONVERSATIONS: ConversationDetail[] = [
  {
    id: "conv-physical-therapy",
    title: "Physical therapy coverage",
    status: "active",
    createdAtUtc: minutesAgo(20),
    lastMessageAtUtc: minutesAgo(12),
    isArchived: false,
    turns: [
      member("turn-1", "What does my plan cover for physical therapy?", minutesAgo(20)),
      assistant(
        "turn-2",
        "Physical therapy is described in your plan's **rehabilitation services** section. That section explains:\n\n- whether you need a referral or prior authorization first\n- how visits count toward your deductible and out-of-pocket maximum\n- whether any limits apply on your plan\n\nOpen the sources below to read the details for your plan.",
        minutesAgo(19),
        [
          cite("physical-therapy", "Physical therapy (sample topic)"),
          cite("physical-therapy", "Physical therapy (sample topic)"),
          cite("prior-authorization", "Prior authorization (sample topic)"),
        ]
      ),
      member("turn-3", "Is a specific clinic near me in network?", minutesAgo(13)),
      assistant(
        "turn-4",
        "I can't check whether a particular provider is in network. You can search providers in **Find Care**, or send this question to Member Services.",
        minutesAgo(12),
        [],
        { outcome: "refused", handoffOffered: true }
      ),
    ],
  },
  {
    id: "conv-hsa-expense",
    title: "Paying an expense from my HSA",
    status: "active",
    createdAtUtc: minutesAgo(60 * 24 * 2),
    lastMessageAtUtc: minutesAgo(60 * 24 * 2),
    isArchived: false,
    turns: [
      member("turn-10", "How do I use my HSA to pay for an expense?", minutesAgo(60 * 24 * 2)),
      assistant(
        "turn-11",
        "Your spending account guide explains which expenses qualify and the ways to pay or get reimbursed. Open the source below for the steps.",
        minutesAgo(60 * 24 * 2),
        [cite("hsa-basics", "Health savings account basics (sample topic)", "spendingAccount")]
      ),
    ],
  },
  {
    id: "conv-specialist",
    title: "Finding an in-network specialist",
    status: "handedOff",
    createdAtUtc: minutesAgo(60 * 24 * 4),
    lastMessageAtUtc: minutesAgo(60 * 24 * 4),
    isArchived: false,
    turns: [
      member("turn-20", "Can you confirm a specialist is in network?", minutesAgo(60 * 24 * 4)),
      assistant(
        "turn-21",
        "I can't confirm a specific provider's network status. Member Services can check that for you.",
        minutesAgo(60 * 24 * 4),
        [],
        { outcome: "refused", handoffOffered: true }
      ),
    ],
  },
  {
    id: "conv-vision",
    title: "Vision benefits question",
    status: "active",
    createdAtUtc: minutesAgo(60 * 24 * 21),
    lastMessageAtUtc: minutesAgo(60 * 24 * 21),
    isArchived: true,
    turns: [
      member("turn-30", "Where can I read about vision benefits?", minutesAgo(60 * 24 * 21)),
      assistant(
        "turn-31",
        "Vision benefits are covered in the source below.",
        minutesAgo(60 * 24 * 21),
        [cite("vision", "Vision care (sample topic)")]
      ),
    ],
  },
];

export const CONVERSATION_SUMMARIES: ConversationSummary[] = CONVERSATIONS.map(({ turns: _t, ...summary }) => summary);

/** The resumable conversation (under 30 minutes old) the Benefits FAB would reopen. */
export const RESUMABLE_CONVERSATION_ID = "conv-physical-therapy";

/** The route sample (`/chat/sample-conversation`) and any unknown id open the first conversation. */
export function findConversation(id: string): ConversationDetail {
  return CONVERSATIONS.find((c) => c.id === id) ?? CONVERSATIONS[0];
}

/** Reply the wireframe appends after a member sends a message. */
export function sampleReply(id: string): ChatTurn {
  return assistant(
    id,
    "This is a wireframe, so there is no live answer. The advisor's reply would appear here, with the benefits topics it used shown as source chips below.",
    new Date().toISOString(),
    [cite("sample-topic", "Sample benefits topic")]
  );
}

/** The handoff thread the wireframe opens after "Send this to Member Services". */
export const HANDOFF_THREAD_ID = "thread-handoff";
