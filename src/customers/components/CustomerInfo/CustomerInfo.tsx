// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Grid from "@dashboard/components/Grid";
import { type AccountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface CustomerInfoProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerInfo = (props: CustomerInfoProps) => {
  const { data, disabled, errors, onChange } = props;

  const intl = useIntl();

  const formErrors = getFormErrors(["firstName", "lastName", "email", "note"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title size={6} fontWeight="medium">
          <FormattedMessage
            defaultMessage="Customer details"
            description="customer detail page, section header grouping name and contact fields"
            id="bxZ9Nx"
          />
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <Box display="flex" flexDirection="column" gap={5}>
          <Grid variant="uniform">
            <TextField
              data-test-id="customer-first-name"
              disabled={disabled}
              error={!!formErrors.firstName}
              fullWidth
              helperText={getAccountErrorMessage(formErrors.firstName, intl)}
              name="firstName"
              type="text"
              label={intl.formatMessage(commonMessages.firstName)}
              value={data.firstName}
              onChange={onChange}
              inputProps={{
                spellCheck: false,
              }}
            />
            <TextField
              data-test-id="customer-last-name"
              disabled={disabled}
              error={!!formErrors.lastName}
              fullWidth
              helperText={getAccountErrorMessage(formErrors.lastName, intl)}
              name="lastName"
              type="text"
              label={intl.formatMessage(commonMessages.lastName)}
              value={data.lastName}
              onChange={onChange}
              inputProps={{
                spellCheck: false,
              }}
            />
          </Grid>
          <TextField
            data-test-id="customer-email"
            disabled={disabled}
            error={!!formErrors.email}
            fullWidth
            helperText={getAccountErrorMessage(formErrors.email, intl)}
            name="email"
            type="email"
            label={intl.formatMessage(commonMessages.email)}
            value={data.email}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
          <TextField
            data-test-id="customer-note"
            disabled={disabled}
            error={!!formErrors.note}
            fullWidth
            multiline
            helperText={formErrors.note ? getAccountErrorMessage(formErrors.note, intl) : undefined}
            name="note"
            label={intl.formatMessage({
              id: "uUQ+Al",
              defaultMessage: "Note",
              description: "note about customer",
            })}
            value={data.note}
            onChange={onChange}
          />
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerInfo.displayName = "CustomerInfo";
export default CustomerInfo;
