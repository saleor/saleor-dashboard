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

export function getFormErrors<TField extends string, TError extends UserError>(
  fields: TField[],
  errors: TError[]
): Record<TField, TError> {
  return fields.reduce((errs, field) => {
    errs[field] = getFieldError(errors, field);
    return errs;
  }, ({} as unknown) as Record<TField, TError>);
}

export interface ChannelError {
  field: string | null;
  code: string;
  channels: string[] | [];
}

export function getFieldChannelError<T extends ChannelError>(
  errors: T[],
  field: string
): T[] {
  return errors.filter(err => err.field === field);
}

export function getFormChannelErrors<
  TField extends string,
  TError extends ChannelError
>(fields: TField[], errors: TError[]) {
  return fields.reduce((errs, field) => {
    errs[field] = [
      ...(errs[field] ? errs[field] : []),
      ...getFieldChannelError(errors, field)
    ];
    return errs;
  }, {} as Record<TField, TError[]>);
}

export { default as getProductErrorMessage } from "./product";
