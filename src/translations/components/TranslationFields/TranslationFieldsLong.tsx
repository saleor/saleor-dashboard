import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TranslationFieldsSave from "./TranslationFieldsSave";

interface TranslationFieldsLongProps {
  disabled: boolean;
  edit: boolean;
  initial: string;
  saveButtonState: ConfirmButtonTransitionState;
  onDiscard: () => void;
  onSubmit: (data: string) => SubmitPromise;
}

const TranslationFieldsLong: React.FC<TranslationFieldsLongProps> = ({
  disabled,
  edit,
  initial,
  saveButtonState,
  onDiscard,
  onSubmit,
}) => {
  const intl = useIntl();

  return edit ? (
    <Form
      confirmLeave
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
              id: "/vCXIP",
              defaultMessage: "Translation",
            })}
            name="translation"
            value={data.translation || ""}
            data-test-id="translation-field"
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
    <Text color="default2">
      <FormattedMessage id="T/5OyA" defaultMessage="No translation yet" />
    </Text>
  ) : (
    <Text>{initial}</Text>
  );
};

TranslationFieldsLong.displayName = "TranslationFieldsLong";
export default TranslationFieldsLong;
