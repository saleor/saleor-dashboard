import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useRichText from "@dashboard/utils/richText/useRichText";
import { OutputData } from "@editorjs/editorjs";
import React from "react";

export function useRichTextSubmit(
  initial: string,
  onSubmit: (data: OutputData) => SubmitPromise,
  loading: boolean,
) {
  const { setIsDirty, setExitDialogSubmitRef } = useExitFormDialog();

  const { defaultValue, editorRef, isReadyForMount, handleChange, getValue } =
    useRichText({
      initial,
      loading,
      triggerChange: () => setIsDirty(true),
    });

  const handleSubmit = React.useCallback(async () => {
    const result = onSubmit(await getValue());

    const errors = await result;
    if (errors?.length === 0) {
      setIsDirty(false);

      return [];
    }

    return errors;
  }, [getValue, onSubmit, setIsDirty]);

  React.useEffect(
    () => setExitDialogSubmitRef(handleSubmit),
    [handleSubmit, setExitDialogSubmitRef],
  );

  return {
    defaultValue,
    editorRef,
    isReadyForMount,
    handleChange,
    handleSubmit,
  };
}
