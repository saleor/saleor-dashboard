import { FormId, useExitFormDialog } from "@dashboard/components/Form";
import { NotificationContext } from "@dashboard/components/notifications";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { useContext } from "react";

interface UseHandleFormSubmitProps<TData, TError> {
  formId?: FormId;
  onSubmit?: (data: TData) => SubmitPromise<TError[]> | void;
}

function useHandleFormSubmit<TData, TErrors>({
  formId,
  onSubmit,
}: UseHandleFormSubmitProps<TData, TErrors>) {
  const { setIsSubmitting, setIsDirty } = useExitFormDialog({
    formId,
  });
  const notificationContext = useContext(NotificationContext);

  async function handleFormSubmit(data: TData): Promise<TErrors[]> {
    setIsSubmitting(true);

    if (notificationContext?.clearErrorNotifications) {
      notificationContext.clearErrorNotifications();
    }

    const result = onSubmit ? onSubmit(data) : null;

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
