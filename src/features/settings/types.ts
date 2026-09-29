export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export interface NotificationPreferences {
  eobNotifications: boolean;
  wellnessReminders: boolean;
  productInfo: boolean;
  benefitsUpdates: boolean;
  claimsStatusChanges: boolean;
  policyChanges: boolean;
  paymentReminders: boolean;
  preventiveCareReminders: boolean;
  prescriptionRefillReminders: boolean;
  promotionalCommunications: boolean;
}

export type NotificationPreferenceKey = keyof NotificationPreferences;

export interface NotificationCategory {
  key: NotificationPreferenceKey;
  labelKey: string;
  descriptionKey: string;
}
