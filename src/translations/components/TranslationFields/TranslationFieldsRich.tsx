import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import DraftRenderer from "@saleor/components/DraftRenderer";
import Form from "@saleor/components/Form";
import RichTextEditor from "@saleor/components/RichTextEditor";
import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsRichProps {
  disabled: boolean;
  edit: boolean;
  initial: string;
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSubmit: (data: string) => void;
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

  return edit ? (
    <Form
      initial={{ translation: initial }}
      onSubmit={data => onSubmit(data.translation)}
    >
      {({ change, submit }) => (
        <div>
          <RichTextEditor
            disabled={disabled}
            error={undefined}
            helperText={undefined}
            initial={JSON.parse(initial)}
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
        </div>
      )}
    </Form>
  ) : initial === null ? (
    <Typography color="textSecondary">
      <FormattedMessage defaultMessage="No translation yet" />
    </Typography>
  ) : (
    <Typography>
      <DraftRenderer content={JSON.parse(initial)} />
    </Typography>
  );
};
TranslationFieldsRich.displayName = "TranslationFieldsRich";
export default TranslationFieldsRich;
