import { OutputData } from "@editorjs/editorjs";
import { Typography } from "@material-ui/core";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import RichTextEditor from "@saleor/components/RichTextEditor";
import RichTextEditorContent from "@saleor/components/RichTextEditor/RichTextEditorContent";
import { RichTextEditorLoading } from "@saleor/components/RichTextEditor/RichTextEditorLoading";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import useRichText from "@saleor/utils/richText/useRichText";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsRichProps {
  disabled: boolean;
  edit: boolean;
  initial: string;
  saveButtonState: ConfirmButtonTransitionState;
  resetKey: string;
  onDiscard: () => void;
  onSubmit: (data: OutputData) => SubmitPromise;
}

const TranslationFieldsRich: React.FC<TranslationFieldsRichProps> = ({
  disabled,
  edit,
  initial,
  saveButtonState,
  resetKey,
  onDiscard,
  onSubmit,
}) => {
  const intl = useIntl();

  const { setIsDirty, setExitDialogSubmitRef } = useExitFormDialog();

  const {
    defaultValue,
    editorRef,
    isReadyForMount,
    handleChange,
    getValue,
  } = useRichText({
    initial,
    triggerChange: () => setIsDirty(true),
  });

  useEffect(() => setExitDialogSubmitRef(onSubmit), [onSubmit]);

  const submit = async () => onSubmit(await getValue());

  return edit ? (
    <form onSubmit={submit}>
      {isReadyForMount ? (
        <RichTextEditor
          defaultValue={defaultValue}
          editorRef={editorRef}
          onChange={handleChange}
          disabled={disabled}
          error={undefined}
          helperText={undefined}
          label={intl.formatMessage({
            id: "/vCXIP",
            defaultMessage: "Translation",
          })}
          name="translation"
          data-test-id="translation-field"
        />
      ) : (
        <RichTextEditorLoading
          label={intl.formatMessage({
            id: "/vCXIP",
            defaultMessage: "Translation",
          })}
          name="translation"
          data-test-id="translation-field"
        />
      )}
      <TranslationFieldsSave
        saveButtonState={saveButtonState}
        onDiscard={onDiscard}
        onSave={submit}
      />
    </form>
  ) : initial === null ? (
    <Typography color="textSecondary">
      <FormattedMessage id="T/5OyA" defaultMessage="No translation yet" />
    </Typography>
  ) : (
    <Typography>
      {isReadyForMount && (
        <RichTextEditorContent key={resetKey} value={defaultValue} />
      )}
    </Typography>
  );
};
TranslationFieldsRich.displayName = "TranslationFieldsRich";
export default TranslationFieldsRich;
