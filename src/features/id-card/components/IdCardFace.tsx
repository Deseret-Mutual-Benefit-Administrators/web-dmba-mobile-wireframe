/**
 * Wireframe-only. The app shows a server-rendered PNG of the member's card;
 * this draws an HTML card of the same proportions (credit-card ratio, fitted
 * into the h-52 frame with `contain`) from the card's fictitious metadata.
 * Every value on it comes from `placeholder.ts` or is generic filler.
 */
import type { CSSProperties } from "react";
import type { CachedIdCard } from "../types";

const INK = "#1f2937";
const BAND = "#7fa08e";
const PANEL = "#e5e7eb";
const ALERT = "#c0392b";

const face: CSSProperties = {
  height: 208,
  aspectRatio: "1.59 / 1",
  alignSelf: "center",
  border: `1.5px solid ${INK}`,
  borderRadius: 10,
  background: "#ffffff",
  overflow: "hidden",
  color: INK,
  fontFamily: "'Arial Narrow', Arial, sans-serif",
  fontSize: 7.5,
  lineHeight: 1.3,
};

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <span>{label}</span>
      {value ? <span style={{ fontWeight: 700 }}>{value}</span> : null}
    </div>
  );
}

function Front({ card }: { card: CachedIdCard }) {
  return (
    <div style={face}>
      <div style={{ flexDirection: "row", height: 30 }}>
        <div style={{ width: "36%", flexDirection: "row", alignItems: "center", paddingLeft: 12 }}>
          <img src="/images/dmba-logo.png" alt="" style={{ height: 14 }} />
        </div>
        <div
          style={{
            flex: 1,
            background: BAND,
            clipPath: "polygon(6% 0, 100% 0, 100% 100%, 0 100%)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 10, letterSpacing: 0.3 }}>
            {card.planDisplayName.toUpperCase()} ID CARD
          </span>
        </div>
      </div>
      <div style={{ flexDirection: "row", flex: 1 }}>
        <div style={{ width: "58%", padding: "6px 8px 6px 12px", justifyContent: "space-between" }}>
          <div style={{ gap: 1 }}>
            <Row label="Participant Name" value={card.cardholderName} />
            <Row label="Member ID" value={card.policyId} />
            <Row label="Group" value={card.groupNumber} />
            <Row label="Network" value={card.network ?? "—"} />
            <Row label="Issuer" value="DMBA" />
          </div>
          <div style={{ borderTop: `1px solid ${BAND}`, paddingTop: 3 }}>
            <span style={{ color: ALERT, fontWeight: 700, fontSize: 6.5 }}>
              PRESENT THIS CARD AT EACH VISIT
            </span>
            <Row label="RxBin" value="000000" />
            <Row label="RxPCN" value="SAMPLE" />
          </div>
          <div style={{ borderTop: `1px solid ${BAND}`, paddingTop: 3 }}>
            <Row label="Card issue date:" value={card.cardIssueDate} />
          </div>
        </div>
        <div style={{ flex: 1, background: PANEL, padding: "6px 8px", gap: 2 }}>
          <span style={{ fontWeight: 700 }}>Plan Summary</span>
          <span>Primary Care ........ see plan</span>
          <span>Specialist ............ see plan</span>
          <span>Urgent Care ......... see plan</span>
          <span>Emergency ........... see plan</span>
          <span style={{ fontWeight: 700, marginTop: 6 }}>PROVIDER NETWORK</span>
          <span style={{ fontStyle: "italic" }}>Sample Network</span>
          <span>Sample Pharmacy Network</span>
        </div>
      </div>
    </div>
  );
}

function Back() {
  return (
    <div style={{ ...face, padding: "10px 12px" }}>
      <div style={{ flexDirection: "row", flex: 1, gap: 12 }}>
        <div style={{ width: "40%", gap: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 8.5 }}>PARTICIPANT</span>
          <span>• Benefit questions: 801-578-5600 or 800-777-3622</span>
          <span>• Prescription questions: 800-000-0000</span>
          <span style={{ fontWeight: 700, fontSize: 8.5, marginTop: 6 }}>DEDUCTIBLES</span>
          <span>• In-network: see plan</span>
          <span>• Out-of-network: see plan</span>
          <span style={{ fontWeight: 700, fontSize: 8.5, marginTop: 6 }}>OUT-OF-POCKET MAXIMUMS</span>
          <span>• In-network: see plan</span>
          <span>• Out-of-network: see plan</span>
        </div>
        <div style={{ flex: 1, gap: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 8.5 }}>PROVIDERS</span>
          <span style={{ color: ALERT, fontWeight: 700 }}>Network area</span>
          <span>• Before providing inpatient care or to verify eligibility, call 800-000-0000.</span>
          <span>• Send all medical claims to</span>
          <span style={{ paddingLeft: 6 }}>Sample Claims Office</span>
          <span style={{ paddingLeft: 6 }}>100 Sample Street, Anytown 00000</span>
          <span style={{ color: ALERT, fontWeight: 700, marginTop: 4 }}>All other areas</span>
          <span>• Call 800-000-0000 before inpatient care.</span>
          <span>• Send all medical claims to the address above.</span>
        </div>
      </div>
      <div style={{ flexDirection: "row", justifyContent: "space-between", borderTop: `1px solid ${BAND}`, paddingTop: 3 }}>
        <span style={{ color: ALERT, fontWeight: 700 }}>THIS CARD DOES NOT GUARANTEE BENEFITS OR COVERAGE.</span>
      </div>
    </div>
  );
}

export function IdCardFace({ card, showBack }: { card: CachedIdCard; showBack: boolean }) {
  return showBack ? <Back /> : <Front card={card} />;
}
