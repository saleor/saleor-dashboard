import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { useEffect } from "react";

const noopSubmit = (): SubmitPromise => Promise.resolve([]);

interface UseDiscountFormExitParams {
  enabled: boolean;
  isDirty: boolean;
}

/**
 * Syncs promotion create/edit dirty state into the shared exit-form dialog so
 * TopNav back / Cancel / browser history leave prompts match Savebar pristine state.
 */
export const useDiscountFormExit = ({
  enabled,
  isDirty,
}: UseDiscountFormExitParams): { resetFormsState: () => void } => {
  const { setIsDirty, setExitDialogSubmitRef, resetFormsState, showDialog, unregisterForm } =
    useExitFormDialog();

  useEffect(
    function syncDiscountExitFormDirty() {
      if (!enabled || showDialog) {
        return;
      }

      // Registering a submit ref creates the form entry the provider needs before
      // `setIsDirty` has any effect. Exit dialog is leave / keep-editing only.
      setExitDialogSubmitRef(noopSubmit);
      setIsDirty(isDirty);
    },
    [enabled, isDirty, showDialog, setExitDialogSubmitRef, setIsDirty],
  );

  useEffect(
    function cleanupDiscountExitFormWhenDisabled() {
      if (enabled) {
        return;
      }

      unregisterForm();
    },
    [enabled, unregisterForm],
  );

  return { resetFormsState };
};
