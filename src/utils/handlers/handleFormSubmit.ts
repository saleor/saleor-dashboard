import { SubmitPromise } from "@saleor/hooks/useForm";
import { getMutationErrors } from "@saleor/misc";

// because our submit functions return either errors[],
// or { data: { mutationName: { errors: [] }}}
const extractErrors = (data: any): any[] => {
  if (Array.isArray(data)) {
    return data;
  }

  return getMutationErrors(data.data);
};

async function handleFormSubmit<T>(
  data: T,
  onSubmit: (data: T) => SubmitPromise | void,
  setChanged: (changed: boolean) => void,
  setEnableExitDialog?: (value: boolean) => void
): Promise<boolean> {
  const result = onSubmit(data);

  if (result) {
    const response = await result;
    const errors = extractErrors(response);

    if (errors?.length === 0) {
      setChanged(false);

      if (!!setEnableExitDialog) {
        setEnableExitDialog(false);
      }

      return false;
    }

    return true;
  }
}

export default handleFormSubmit;
