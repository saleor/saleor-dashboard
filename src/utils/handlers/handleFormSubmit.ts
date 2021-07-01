import { SubmitPromise } from "@saleor/hooks/useForm";

async function handleFormSubmit<T>(
  data: T,
  onSubmit: (data: T) => SubmitPromise | void,
  setChanged: (changed: boolean) => void,
  setEnableExitPrompt?: (value: boolean) => void
): Promise<boolean> {
  const result = onSubmit(data);

  if (result) {
    const errors = await result;

    if (errors?.length === 0) {
      setChanged(false);

      if (!!setEnableExitPrompt) {
        setEnableExitPrompt(false);
      }

      return false;
    }

    return true;
  }
}

export default handleFormSubmit;
