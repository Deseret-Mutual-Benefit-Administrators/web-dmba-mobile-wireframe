/** Local stand-in for the app's `spending-claims/services/claimFormSchema.ts`. */
import type { ClaimFormField, ClaimFormFieldId, ClaimFormSchema } from "../types";

export function findClaimFormField(schema: ClaimFormSchema, id: ClaimFormFieldId): ClaimFormField | undefined {
  return schema.fields.find((field) => field.id === id && field.flags.visible);
}
