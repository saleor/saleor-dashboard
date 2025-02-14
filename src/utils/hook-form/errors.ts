import { FieldErrors } from "react-hook-form";

/** Maps all errors from react-hook-form formState, into a list of error strings
 *
 * @param errorObj "formState.errors" from react-hook-form useForm hook
 * */
export const flattenErrors = (errorObj: FieldErrors<unknown>) => {
  return Object.values(errorObj).reduce((messages, fieldError) => {
    if (fieldError?.message) {
      return [...messages, fieldError.message];
    }

    if (typeof fieldError === "object" && fieldError !== null) {
      return [...messages, ...flattenErrors(fieldError)];
    }

    return messages;
  }, []);
};
