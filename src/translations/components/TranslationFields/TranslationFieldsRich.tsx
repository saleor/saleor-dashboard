import { OutputData } from "@editorjs/editorjs";
import { Typography } from "@material-ui/core";
import { useExitFormDialog } from "@saleor/components/Form/useExitFormDialog";
import RichTextEditor from "@saleor/components/RichTextEditor";
import RichTextEditorContent from "@saleor/components/RichTextEditor/RichTextEditorContent";
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
  onSubmit
}) => {
  const intl = useIntl();

  const { setIsDirty, setExitDialogSubmitRef } = useExitFormDialog();

  const [content, change] = useRichText({
    initial,
    triggerChange: () => setIsDirty(true)
  });

  useEffect(() => setExitDialogSubmitRef(onSubmit), [content]);

  const submit = () => onSubmit(content.current);

  return edit ? (
    <form onSubmit={submit}>
      <RichTextEditor
        data={content.current}
        disabled={disabled}
        error={undefined}
        helperText={undefined}
        label={intl.formatMessage({
          defaultMessage: "Translation"
        })}
        name="translation"
        data-test-id="translation"
        onChange={change}
      />
      <TranslationFieldsSave
        saveButtonState={saveButtonState}
        onDiscard={onDiscard}
        onSave={submit}
      />
    </form>
  ) : initial === null ? (
    <Typography color="textSecondary">
      <FormattedMessage defaultMessage="No translation yet" />
    </Typography>
  ) : (
    <Typography>
      <RichTextEditorContent key={resetKey} data={JSON.parse(initial)} />
    </Typography>
  );
};
TranslationFieldsRich.displayName = "TranslationFieldsRich";
export default TranslationFieldsRich;
