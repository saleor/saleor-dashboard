import { OutputData } from "@editorjs/editorjs";
import Typography from "@material-ui/core/Typography";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import RichTextEditor from "@saleor/components/RichTextEditor";
import RichTextEditorContent from "@saleor/components/RichTextEditor/RichTextEditorContent";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsRichProps {
  disabled: boolean;
  edit: boolean;
  initial: string;
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSubmit: (data: OutputData) => void;
}

const TranslationFieldsRich: React.FC<TranslationFieldsRichProps> = ({
  disabled,
  edit,
  initial,
  saveButtonState,
  onDiscard,
  onSubmit
}) => {
  const intl = useIntl();
  const [content, change] = useRichText({
    initial,
    triggerChange: () => undefined
  });

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
      <RichTextEditorContent data={JSON.parse(initial)} />
    </Typography>
  );
};
TranslationFieldsRich.displayName = "TranslationFieldsRich";
export default TranslationFieldsRich;
