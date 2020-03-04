import { UserError } from "@saleor/types";

export function getFieldError<T extends UserError>(
  errors: T[],
  field: string
): T {
  return errors.find(err => err.field === field);
}

export function getErrors(errors: UserError[]): string[] {
  return errors
    .filter(err => ["", null].includes(err.field))
    .map(err => err.message);
}

export { default as getProductErrorMessage } from "./product";
