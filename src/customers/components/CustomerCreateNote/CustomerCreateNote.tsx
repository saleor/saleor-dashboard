import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { FormSpacer } from "@saleor/components/FormSpacer";
import { AccountErrorFragment } from "@saleor/graphql";
import { getFormErrors } from "@saleor/utils/errors";
import getAccountErrorMessage from "@saleor/utils/errors/account";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface CustomerCreateNoteProps {
  data: {
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerCreateNote: React.FC<CustomerCreateNoteProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "qNcoRY",
          defaultMessage: "Notes",
          description: "notes about customer header",
        })}
      />
      <CardContent>
        <Typography>
          <FormattedMessage
            id="w3sGrD"
            defaultMessage="Enter any extra infotmation regarding this customer."
          />
        </Typography>
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={!!formErrors.note}
          fullWidth
          multiline
          name="note"
          helperText={getAccountErrorMessage(formErrors.note, intl)}
          label={intl.formatMessage({
            id: "uUQ+Al",
            defaultMessage: "Note",
            description: "note about customer",
          })}
          value={data.note}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
CustomerCreateNote.displayName = "CustomerCreateNote";
export default CustomerCreateNote;
