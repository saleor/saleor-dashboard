// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { AccountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField, Typography } from "@material-ui/core";
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
    <DashboardCard>
      <DashboardCard.Title
        title={intl.formatMessage({
          id: "qNcoRY",
          defaultMessage: "Notes",
          description: "notes about customer header",
        })}
      />
      <DashboardCard.Content>
        <Typography>
          <FormattedMessage
            id="w3sGrD"
            defaultMessage="Enter any extra infotmation regarding this customer."
          />
        </Typography>
        <FormSpacer />
        <TextField
          data-test-id="customer-note"
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
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerCreateNote.displayName = "CustomerCreateNote";
export default CustomerCreateNote;
