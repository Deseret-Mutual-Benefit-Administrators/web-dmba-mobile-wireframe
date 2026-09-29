import { useNavigate } from "react-router-dom";
import { HelpSupportScreen } from "../components/HelpSupportScreen";

export function HelpRoute() {
  const navigate = useNavigate();

  return <HelpSupportScreen onBack={() => navigate(-1)} />;
}
