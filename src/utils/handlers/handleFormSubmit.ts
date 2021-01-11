import { SubmitPromise } from "@saleor/hooks/useForm";

async function handleFormSubmit<T>(
  data: T,
  onSubmit: (data: T) => SubmitPromise,
  setChanged: (changed: boolean) => void
): Promise<boolean> {
  const errors = await onSubmit(data);
  const ok = errors.length === 0;

  if (ok) {
    setChanged(false);
  }

  return ok;
}

export default handleFormSubmit;
