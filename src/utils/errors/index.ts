import { UserError } from "@dashboard/types";

export function getFieldError<T extends UserError>(errors: T[], field: string): T | undefined {
  return errors.find(err => err.field === field);
}

export type FormErrors<TField extends string, TError extends UserError> = Record<
  TField,
  TError | undefined
>;

export function getFormErrors<TField extends string, TError extends UserError>(
  fields: TField[],
  errors: TError[] = [],
): FormErrors<TField, TError> {
  return fields.reduce(
    (errs, field) => {
      errs[field] = getFieldError(errors, field);
      return errs;
    },
    {} as unknown as Record<TField, TError | undefined>,
  );
}

export interface ChannelError {
  field: string | null;
  channels: string[] | [];
}

export function getFieldChannelError<T extends ChannelError>(errors: T[], field: string): T[] {
  return errors.filter(err => err.field === field);
}

export function getFormChannelErrors<TField extends string, TError extends ChannelError>(
  fields: TField[],
  errors: TError[],
) {
  return fields.reduce(
    (errs, field) => {
      errs[field] = [...(errs[field] ? errs[field] : []), ...getFieldChannelError(errors, field)];
      return errs;
    },
    {} as Record<TField, TError[]>,
  );
}

export function getFormChannelError<TError extends ChannelError>(
  formError: TError[],
  channelId: string,
) {
  return formError?.find(error => error.channels?.find(id => id === channelId));
}

export { default as getProductErrorMessage } from "./product";
