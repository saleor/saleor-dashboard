import { TextField, Typography } from "@material-ui/core";
import Form from "@saleor/components/Form";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsLongProps {
  disabled: boolean;
  edit: boolean;
  initial: string;
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSubmit: (data: string) => void;
}

const TranslationFieldsLong: React.FC<TranslationFieldsLongProps> = ({
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
      {({ change, data, submit }) => (
        <div>
          <TextField
            disabled={disabled}
            fullWidth
            multiline
            label={intl.formatMessage({
              defaultMessage: "Translation"
            })}
            name="translation"
            value={data.translation || ""}
            data-test-id="translation"
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
    <Typography>{initial}</Typography>
  );
};
TranslationFieldsLong.displayName = "TranslationFieldsLong";
export default TranslationFieldsLong;
