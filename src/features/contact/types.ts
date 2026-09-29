export interface PhoneEntry {
  labelKey: string;
  number: string;
  displayNumber: string;
  /** Optional note key for lines like Hawaii timezone or TTY */
  noteKey?: string;
}

export interface BusinessHours {
  /** i18n key for the day label (e.g. "contact.daysMWF") */
  daysKey: string;
  /** i18n key for the hours string (e.g. "contact.hours8to5") */
  hoursKey: string;
}
