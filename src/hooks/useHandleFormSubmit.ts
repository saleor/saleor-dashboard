import { type FormId, useExitFormDialog } from "@dashboard/components/Form";
import { NotificationContext } from "@dashboard/components/notifications";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
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

    // When onSubmit is synchronous/void (e.g. dialog forms that only dispatch
    // local state), there is no promise to await. We must still clear the
    // global submitting flag, otherwise setEnableExitDialog stays gated off and
    // the exit/leave dialog silently stops blocking navigation for every form.
    if (!result) {
      setIsSubmitting(false);

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
