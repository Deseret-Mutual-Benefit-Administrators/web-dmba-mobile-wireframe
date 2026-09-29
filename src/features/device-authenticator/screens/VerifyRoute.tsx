import { VerifyChallengeScreen } from "../components/VerifyChallengeScreen";

/** Sign-in approval (ADR-195 §7). No route param, deliberately. */
export function VerifyRoute() {
  return <VerifyChallengeScreen />;
}
