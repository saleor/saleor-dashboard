import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { useEffect } from "react";

const noopSubmit = (): SubmitPromise => Promise.resolve([]);

interface UseTranslationExitFormParams {
  enabled: boolean;
  isDirty: boolean;
}

interface UseTranslationExitFormResult {
  resetFormsState: () => void;
}

/**
 * Owns a single exit-form-dialog registration for translation editing.
 *
 * In bulk and single-field edit modes the per-field forms stop tracking their own
 * dirty state (see `confirmLeave`/`trackDirty` in the translation field components).
 * This hook is driven by value-diff `isDirty`, keeping navigation blocking aligned
 * with the Savebar in bulk mode and with per-field save in single-field mode.
 */
export function useTranslationExitForm({
  enabled,
  isDirty,
}: UseTranslationExitFormParams): UseTranslationExitFormResult {
  const { setIsDirty, setExitDialogSubmitRef, resetFormsState, showDialog, unregisterForm } =
    useExitFormDialog();

  useEffect(
    function syncTranslationExitFormDirty() {
      if (!enabled || showDialog) {
        return;
      }

      // Registering a submit ref creates the form entry the provider needs before
      // `setIsDirty` has any effect. The exit dialog only offers leave/keep-editing,
      // so the submit fn itself is never invoked.
      setExitDialogSubmitRef(noopSubmit);
      setIsDirty(isDirty);
    },
    [enabled, isDirty, showDialog, setExitDialogSubmitRef, setIsDirty],
  );

  useEffect(
    function cleanupTranslationExitFormWhenDisabled() {
      if (enabled) {
        return;
      }

      unregisterForm();
    },
    [enabled, unregisterForm],
  );

  return { resetFormsState };
}
