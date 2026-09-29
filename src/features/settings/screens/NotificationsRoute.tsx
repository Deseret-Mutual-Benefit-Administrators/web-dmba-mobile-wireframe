import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationPreferencesScreen } from "../components/NotificationPreferencesScreen";
import { placeholderNotificationPreferences } from "../placeholder";
import type { NotificationPreferenceKey } from "../types";
import { useScreenState } from "../useScreenState";

export function NotificationsRoute() {
  const navigate = useNavigate();
  const isLoading = useScreenState() === "loading";
  const [preferences, setPreferences] = useState(placeholderNotificationPreferences);
  const togglePreference = (key: NotificationPreferenceKey) =>
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <NotificationPreferencesScreen
      preferences={preferences}
      isLoading={isLoading}
      onToggle={togglePreference}
      onBack={() => navigate(-1)}
    />
  );
}
