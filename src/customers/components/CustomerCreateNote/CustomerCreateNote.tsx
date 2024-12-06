// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { FormSpacer } from "@dashboard/components/FormSpacer";
import { AccountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
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

const CustomerCreateNote = ({ data, disabled, errors, onChange }: CustomerCreateNoteProps) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "qNcoRY",
            defaultMessage: "Notes",
            description: "notes about customer header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Text>
          <FormattedMessage
            id="w3sGrD"
            defaultMessage="Enter any extra infotmation regarding this customer."
          />
        </Text>
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
