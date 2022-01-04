import { FormId } from "@saleor/components/Form/ExitFormDialogProvider";
import useExitFormDialog from "@saleor/components/Form/useExitFormDialog";
import { SubmitPromise } from "@saleor/hooks/useForm";

interface UseHandleFormSubmitProps<TData, TErrors> {
  formId?: FormId;
  onSubmit: (data: TData) => SubmitPromise<TErrors[]> | void;
  setChanged: (changed: boolean) => void;
}

function useHandleFormSubmit<TData, TErrors>({
  formId,
  onSubmit,
  setChanged
}: UseHandleFormSubmitProps<TData, TErrors>) {
  const { setIsSubmitting } = useExitFormDialog({
    formId
  });

  async function handleFormSubmit(data: TData): Promise<TErrors[]> {
    setIsSubmitting(true);

    const result = onSubmit(data);

    if (!result) {
      return [];
    }

    const errors = await result;

    if (errors?.length === 0) {
      setChanged(false);

      return [];
    }

    setIsSubmitting(false);

    return errors;
  }

  return handleFormSubmit;
}

export default useHandleFormSubmit;
