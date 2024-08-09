// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { AccountErrorFragment, CustomerDetailsQuery } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    cardTitle: {
      height: 72,
    },
    checkbox: {
      marginBottom: theme.spacing(),
    },
    content: {
      paddingTop: theme.spacing(),
    },
    subtitle: {
      marginTop: theme.spacing(),
    },
  }),
  { name: "CustomerDetails" },
);

export interface CustomerDetailsProps {
  customer: CustomerDetailsQuery["user"];
  data: {
    isActive: boolean;
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = props => {
  const { customer, data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title
          className={classes.cardTitle}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <>
            {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
            {customer && customer.dateJoined ? (
              <Text className={classes.subtitle} size={2} fontWeight="light">
                <FormattedMessage
                  id="MjUyhA"
                  defaultMessage="Active member since {date}"
                  description="section subheader"
                  values={{
                    date: moment(customer.dateJoined).format("MMM YYYY"),
                  }}
                />
              </Text>
            ) : (
              <Skeleton style={{ width: "10rem" }} />
            )}
          </>
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content className={classes.content}>
        <ControlledCheckbox
          data-test-id="customer-active-checkbox"
          checked={data.isActive}
          className={classes.checkbox}
          disabled={disabled}
          label={intl.formatMessage({
            id: "+NUzaQ",
            defaultMessage: "User account active",
            description: "check to mark this account as active",
          })}
          name="isActive"
          onChange={onChange}
        />
        <TextField
          data-test-id="customer-note"
          disabled={disabled}
          error={!!formErrors.note}
          fullWidth
          multiline
          helperText={getAccountErrorMessage(formErrors.note, intl)}
          name="note"
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

CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
