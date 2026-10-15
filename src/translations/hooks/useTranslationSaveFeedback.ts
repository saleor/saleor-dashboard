import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import {
  type BulkTranslationSubmitResult,
  fieldErrorsToRecord,
} from "@dashboard/translations/bulkSubmitResult";
import { translationDetailMessages } from "@dashboard/translations/components/TranslationsDetailLayout/messages";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";

interface UseTranslationSaveFeedbackParams {
  refetch: () => void;
  exitEditMode: () => void;
  exitBulkMode: () => void;
}

export function useTranslationSaveFeedback({
  refetch,
  exitEditMode,
  exitBulkMode,
}: UseTranslationSaveFeedbackParams) {
  const notify = useNotifier();
  const intl = useIntl();
  const { resetFormsState } = useExitFormDialog();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const notifyTranslationSaved = useCallback(() => {
    refetch();
    notify({
      status: "success",
      text: intl.formatMessage(translationDetailMessages.translationSaved),
    });
  }, [intl, notify, refetch]);

  const notifyAllTranslationsSaved = useCallback(() => {
    refetch();
    notify({
      status: "success",
      text: intl.formatMessage(translationDetailMessages.allTranslationsSaved),
    });
  }, [intl, notify, refetch]);

  const completeSingleFieldSave = useCallback(
    <TErrors>(errors: TErrors[], onSuccess?: () => void) => {
      if (errors.length === 0) {
        resetFormsState();
        notifyTranslationSaved();
        (onSuccess ?? exitEditMode)();
      }

      return errors;
    },
    [exitEditMode, notifyTranslationSaved, resetFormsState],
  );

  const completeBulkSave = useCallback(
    (result: BulkTranslationSubmitResult) => {
      if (!result.hasErrors) {
        resetFormsState();
        setFieldErrors({});
        notifyAllTranslationsSaved();
        exitBulkMode();

        return result;
      }

      setFieldErrors(fieldErrorsToRecord(result.fieldErrors));
      notify({
        status: "error",
        text: intl.formatMessage(translationDetailMessages.bulkSaveFailed, {
          count: result.fieldErrors.length,
        }),
      });

      return result;
    },
    [exitBulkMode, intl, notify, notifyAllTranslationsSaved, resetFormsState],
  );

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(previousErrors => {
      if (!previousErrors[fieldName]) {
        return previousErrors;
      }

      const nextErrors = { ...previousErrors };

      delete nextErrors[fieldName];

      return nextErrors;
    });
  }, []);

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  return {
    clearFieldError,
    clearFieldErrors,
    completeBulkSave,
    completeSingleFieldSave,
    fieldErrors,
    notifyTranslationSaved,
  };
}
