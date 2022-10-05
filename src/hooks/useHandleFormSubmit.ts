import { FormId } from "@saleor/components/Form/ExitFormDialogProvider";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import { MessageContext } from "@saleor/components/messages";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { useContext } from "react";

interface UseHandleFormSubmitProps<TData, TErrors> {
  formId?: FormId;
  onSubmit: (data: TData) => SubmitPromise<TErrors[]> | void;
}

function useHandleFormSubmit<TData, TErrors>({
  formId,
  onSubmit,
}: UseHandleFormSubmitProps<TData, TErrors>) {
  const { setIsSubmitting, setIsDirty } = useExitFormDialog({
    formId,
  });
  const messageContext = useContext(MessageContext);

  async function handleFormSubmit(data: TData): Promise<TErrors[]> {
    setIsSubmitting(true);

    if (messageContext?.clearErrorNotifications) {
      messageContext.clearErrorNotifications();
    }

    const result = onSubmit(data);

    if (!result) {
      return [];
    }

    const errors = await result;

    setIsSubmitting(false);

    if (errors?.length === 0) {
      setIsDirty(false);

      return [];
    }

    return errors;
  }

  return handleFormSubmit;
}

export default useHandleFormSubmit;
