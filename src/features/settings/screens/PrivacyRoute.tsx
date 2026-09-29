import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivacySecurityScreen } from "../components/PrivacySecurityScreen";

export function PrivacyRoute() {
  const navigate = useNavigate();
  // Stand-in for usePrivacySecurity: Face ID available and on, sign-in verification off.
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  return (
    <PrivacySecurityScreen
      biometricEnabled={biometricEnabled}
      biometricAvailable={true}
      biometricType="Face ID"
      onToggleBiometric={() => setBiometricEnabled((prev) => !prev)}
      onChangePassword={() => navigate("/settings/change-password")}
      signInVerificationOn={false}
      onSignInVerification={() => navigate("/settings/sign-in-verification")}
      onBack={() => navigate(-1)}
    />
  );
}
