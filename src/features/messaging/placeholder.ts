/**
 * Static, fictitious sample data for the messaging wireframe, shaped by
 * `types.ts`. Timestamps are relative to page load so the inbox's relative
 * times read naturally. No real people, ids, emails or phone numbers.
 */
import type { MessageAttachment, MessageThreadDetail, MessageThreadSummary, RegardingOption } from "./types";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const MEMBER_NAME = "Jordan Avery";
const TAYLOR = "Taylor — DMBA Member Services";
const MORGAN = "Morgan — DMBA Member Services";
const SYSTEM = "DMBA Member Services";

const eobPdf: MessageAttachment = {
  id: "att-eob",
  fileName: "explanation-of-benefits.pdf",
  contentType: "application/pdf",
  sizeBytes: 188_416,
  scanStatus: "clean",
};
const billPhoto: MessageAttachment = {
  id: "att-bill-photo",
  fileName: "bill-photo.jpg",
  contentType: "image/jpeg",
  sizeBytes: 1_468_006,
  scanStatus: "clean",
};
const itemizedPending: MessageAttachment = {
  id: "att-itemized",
  fileName: "itemized-bill.pdf",
  contentType: "application/pdf",
  sizeBytes: 96_256,
  scanStatus: "pending",
};
const receiptPhoto: MessageAttachment = {
  id: "att-receipt-photo",
  fileName: "receipt-photo.jpg",
  contentType: "image/jpeg",
  sizeBytes: 842_752,
  scanStatus: "clean",
};
const scanPending: MessageAttachment = {
  id: "att-scan-pending",
  fileName: "letter-page-2.pdf",
  contentType: "application/pdf",
  sizeBytes: 211_968,
  scanStatus: "pending",
};
const scanBlocked: MessageAttachment = {
  id: "att-scan-blocked",
  fileName: "letter-page-1.pdf",
  contentType: "application/pdf",
  sizeBytes: 305_152,
  scanStatus: "malicious",
};

function thread(detail: Omit<MessageThreadDetail, "messageCount" | "lastMessagePreview" | "lastMessageAtUtc" | "createdAtUtc">): MessageThreadDetail {
  const visible = detail.messages.filter((m) => m.senderKind !== "system");
  const last = detail.messages[detail.messages.length - 1];
  return {
    ...detail,
    createdAtUtc: detail.messages[0]?.createdAtUtc ?? minutesAgo(0),
    lastMessageAtUtc: last?.createdAtUtc ?? minutesAgo(0),
    lastMessagePreview: visible[visible.length - 1]?.body ?? null,
    messageCount: detail.messages.length,
  };
}

export const THREADS: MessageThreadDetail[] = [
  thread({
    id: "thread-bill",
    topic: "claims",
    subject: "Question about a recent bill",
    kind: "general",
    status: "open",
    regardingMemberId: "member-riley",
    regardingDisplayName: "Riley Avery",
    hasUnread: true,
    hasStaffReply: true,
    isArchived: false,
    assignedToDisplayName: TAYLOR,
    contextJson: null,
    messages: [
      {
        id: "m-1",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "Hi, I received a bill for Riley's visit last month and I'm not sure it matches what my plan processed. I've attached a photo of the bill.",
        createdAtUtc: minutesAgo(60 * 26),
        attachments: [billPhoto],
      },
      {
        id: "m-2",
        senderKind: "system",
        senderDisplayName: SYSTEM,
        body: "Thanks — we received your message.",
        createdAtUtc: minutesAgo(60 * 26 - 1),
        attachments: [],
      },
      {
        id: "m-3",
        senderKind: "staff",
        senderDisplayName: TAYLOR,
        body: "Thanks for reaching out, Jordan. I've attached the explanation of benefits for that visit. It shows how the claim was processed and what the provider may bill you for. Let me know if anything on it doesn't line up with the bill.",
        createdAtUtc: minutesAgo(25),
        attachments: [eobPdf],
      },
    ],
  }),
  thread({
    id: "thread-claim",
    topic: "claims",
    subject: "Claim for an office visit",
    kind: "claimSubmission",
    status: "open",
    regardingMemberId: null,
    regardingDisplayName: null,
    hasUnread: false,
    hasStaffReply: false,
    isArchived: false,
    assignedToDisplayName: null,
    contextJson: JSON.stringify({
      patientName: MEMBER_NAME,
      providerName: "Sample Family Clinic",
      serviceDate: "Sep 12, 2026",
      amountBilled: "$120.00",
      serviceDescription: "Office visit",
      alreadyPaid: true,
    }),
    messages: [
      {
        id: "m-10",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "Submitting a claim for an office visit. The itemized bill and my receipt are attached.",
        createdAtUtc: minutesAgo(60 * 5),
        attachments: [itemizedPending, receiptPhoto],
      },
      {
        id: "m-11",
        senderKind: "system",
        senderDisplayName: SYSTEM,
        body: "Thanks — we've received your claim.",
        createdAtUtc: minutesAgo(60 * 5 - 1),
        attachments: [],
      },
    ],
  }),
  thread({
    id: "thread-scan",
    topic: "benefitsCoverage",
    subject: "Documents for my coverage question",
    kind: "general",
    status: "open",
    regardingMemberId: null,
    regardingDisplayName: null,
    hasUnread: false,
    hasStaffReply: true,
    isArchived: false,
    assignedToDisplayName: MORGAN,
    contextJson: null,
    messages: [
      {
        id: "m-20",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "Here are both pages of the letter I mentioned on the phone.",
        createdAtUtc: minutesAgo(60 * 24 * 3),
        attachments: [scanBlocked, scanPending],
      },
      {
        id: "m-21",
        senderKind: "system",
        senderDisplayName: SYSTEM,
        body: "Thanks — we received your message.",
        createdAtUtc: minutesAgo(60 * 24 * 3 - 1),
        attachments: [],
      },
      {
        id: "m-22",
        senderKind: "staff",
        senderDisplayName: MORGAN,
        body: "Thanks, Jordan. One of the files didn't pass our security check, so we couldn't open it. Could you send that page again as a photo?",
        createdAtUtc: minutesAgo(60 * 24 * 2),
        attachments: [],
      },
    ],
  }),
  thread({
    id: "thread-handoff",
    topic: "benefitsCoverage",
    subject: "Question from the AI Benefits Advisor",
    kind: "chatHandoff",
    status: "open",
    regardingMemberId: null,
    regardingDisplayName: null,
    hasUnread: false,
    hasStaffReply: false,
    isArchived: false,
    assignedToDisplayName: null,
    contextJson: JSON.stringify({ turnCount: 4, citedTopics: ["Physical therapy (sample topic)"] }),
    messages: [
      {
        id: "m-30",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "I'd like someone to confirm whether a particular clinic is in network for physical therapy.",
        createdAtUtc: minutesAgo(60 * 24 * 4),
        attachments: [],
      },
      {
        id: "m-31",
        senderKind: "system",
        senderDisplayName: SYSTEM,
        body: "Thanks — we received your message.",
        createdAtUtc: minutesAgo(60 * 24 * 4 - 1),
        attachments: [],
      },
    ],
  }),
  thread({
    id: "thread-idcard",
    topic: "idCard",
    subject: "Replacement ID card",
    kind: "general",
    status: "closed",
    regardingMemberId: null,
    regardingDisplayName: null,
    hasUnread: false,
    hasStaffReply: true,
    isArchived: false,
    assignedToDisplayName: TAYLOR,
    contextJson: null,
    messages: [
      {
        id: "m-40",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "Could you mail me a replacement card? Mine was damaged.",
        createdAtUtc: minutesAgo(60 * 24 * 12),
        attachments: [],
      },
      {
        id: "m-41",
        senderKind: "system",
        senderDisplayName: SYSTEM,
        body: "Thanks — we received your message.",
        createdAtUtc: minutesAgo(60 * 24 * 12 - 1),
        attachments: [],
      },
      {
        id: "m-42",
        senderKind: "staff",
        senderDisplayName: TAYLOR,
        body: "A replacement card is on its way to the mailing address we have on file. You can also use the digital card in the app in the meantime.",
        createdAtUtc: minutesAgo(60 * 24 * 11),
        attachments: [],
      },
    ],
  }),
  thread({
    id: "thread-archived-address",
    topic: "other",
    subject: "Updating my mailing address",
    kind: "general",
    status: "closed",
    regardingMemberId: null,
    regardingDisplayName: null,
    hasUnread: false,
    hasStaffReply: true,
    isArchived: true,
    assignedToDisplayName: MORGAN,
    contextJson: null,
    messages: [
      {
        id: "m-50",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "How do I update my mailing address?",
        createdAtUtc: minutesAgo(60 * 24 * 30),
        attachments: [],
      },
      {
        id: "m-51",
        senderKind: "system",
        senderDisplayName: SYSTEM,
        body: "Thanks — we received your message.",
        createdAtUtc: minutesAgo(60 * 24 * 30 - 1),
        attachments: [],
      },
      {
        id: "m-52",
        senderKind: "staff",
        senderDisplayName: MORGAN,
        body: "Your address is updated through your employer's HR office. Once they update it, it flows to us automatically.",
        createdAtUtc: minutesAgo(60 * 24 * 29),
        attachments: [],
      },
    ],
  }),
  thread({
    id: "thread-archived-retirement",
    topic: "retirement",
    subject: "Retirement account statement",
    kind: "general",
    status: "closed",
    regardingMemberId: null,
    regardingDisplayName: null,
    hasUnread: false,
    hasStaffReply: true,
    isArchived: true,
    assignedToDisplayName: TAYLOR,
    contextJson: null,
    messages: [
      {
        id: "m-60",
        senderKind: "member",
        senderDisplayName: MEMBER_NAME,
        body: "Where can I find my latest retirement statement?",
        createdAtUtc: minutesAgo(60 * 24 * 45),
        attachments: [],
      },
      {
        id: "m-61",
        senderKind: "staff",
        senderDisplayName: TAYLOR,
        body: "Statements are available from the retirement account link on your dashboard.",
        createdAtUtc: minutesAgo(60 * 24 * 44),
        attachments: [],
      },
    ],
  }),
];

/** Summary rows for the inbox (the detail is a superset). */
export const THREAD_SUMMARIES: MessageThreadSummary[] = THREADS.map(({ contextJson: _c, messages: _m, ...summary }) => summary);

/** The route sample (`/messages/sample-thread`) and any unknown id open the first thread. */
export function findThread(threadId: string | undefined): MessageThreadDetail {
  return THREADS.find((t) => t.id === threadId) ?? THREADS[0];
}

/** Every attachment across the sample threads, for the viewer route. */
export function findAttachment(attachmentId: string | undefined): MessageAttachment {
  const all = THREADS.flatMap((t) => t.messages.flatMap((m) => m.attachments));
  return all.find((a) => a.id === attachmentId) ?? billPhoto;
}

export const REGARDING_OPTIONS: RegardingOption[] = [
  { memberId: "member-riley", firstName: "Riley", lastName: "Avery", relationship: "spouse" },
  { memberId: "member-casey", firstName: "Casey", lastName: "Avery", relationship: "child" },
];
