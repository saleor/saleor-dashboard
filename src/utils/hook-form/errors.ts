import { FieldError, FieldErrors, FieldValues } from "react-hook-form";

/** Maps all errors from react-hook-form formState, into a list of error strings
 *
 * @param errorObj "formState.errors" from react-hook-form useForm hook
 * */
export const flattenErrors = <T extends FieldValues>(
  errorObj: FieldErrors<T> | FieldError | undefined,
): string[] => {
  if (!errorObj) {
    return [];
  }

  return Object.values(errorObj).reduce<string[]>((messages, fieldError) => {
    if (typeof fieldError === "object" && fieldError !== null) {
      if ("message" in fieldError && typeof fieldError.message === "string") {
        return [...messages, fieldError.message];
      }

      if ("type" in fieldError) {
        return messages;
      }

      return [...messages, ...flattenErrors(fieldError as FieldErrors<T>)];
    }

    return messages;
  }, []);
};
