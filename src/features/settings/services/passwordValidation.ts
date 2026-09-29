/** Local stand-in for the app's passwordValidation service (not in the extract). Same rule keys as en.json. */
export interface PasswordRuleResult {
  key: string;
  labelKey: string;
  passed: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  rules: PasswordRuleResult[];
}

export function validatePassword(
  password: string,
  context: { username: string; firstName: string; lastName: string }
): PasswordValidationResult {
  const lower = password.toLowerCase();
  const excludes = (part: string) => part.length === 0 || !lower.includes(part.toLowerCase());
  const rules: PasswordRuleResult[] = [
    { key: "minLength", labelKey: "settings.changePassword.rules.minLength", passed: password.length >= 12 },
    { key: "lowercase", labelKey: "settings.changePassword.rules.lowercase", passed: /[a-z]/.test(password) },
    { key: "uppercase", labelKey: "settings.changePassword.rules.uppercase", passed: /[A-Z]/.test(password) },
    { key: "number", labelKey: "settings.changePassword.rules.number", passed: /\d/.test(password) },
    { key: "symbol", labelKey: "settings.changePassword.rules.symbol", passed: /[^A-Za-z0-9]/.test(password) },
    { key: "noUsername", labelKey: "settings.changePassword.rules.noUsername", passed: excludes(context.username) },
    { key: "noFirstName", labelKey: "settings.changePassword.rules.noFirstName", passed: excludes(context.firstName) },
    { key: "noLastName", labelKey: "settings.changePassword.rules.noLastName", passed: excludes(context.lastName) },
  ];
  return { isValid: rules.every((r) => r.passed), rules };
}
