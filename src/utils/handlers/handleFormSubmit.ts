import { SubmitPromise } from "@saleor/hooks/useForm";

async function handleFormSubmit<TData, TErrors>(
  data: TData,
  onSubmit: (data: TData) => SubmitPromise<TErrors[]> | void,
  setChanged: (changed: boolean) => void,
  setEnableExitDialog?: (value: boolean) => void
): Promise<TErrors[]> {
  const result = onSubmit(data);

  if (!result) {
    return [];
  }

  const errors = await result;

  if (errors?.length === 0) {
    setChanged(false);

    if (!!setEnableExitDialog) {
      setEnableExitDialog(false);
    }

    return [];
  }

  return errors;
}

export default handleFormSubmit;
