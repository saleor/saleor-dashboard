// @ts-strict-ignore
import AddressFormatter from "@dashboard/components/AddressFormatter";
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { Hr } from "@dashboard/components/Hr";
import { CustomerDetailsFragment } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";

const useStyles = makeStyles(
  theme => ({
    label: {
      fontWeight: 600,
      marginBottom: theme.spacing(1),
    },
  }),
  { name: "CustomerAddresses" },
);

export interface CustomerAddressesProps {
  customer: CustomerDetailsFragment;
  disabled: boolean;
  manageAddressHref: string;
}

const CustomerAddresses: React.FC<CustomerAddressesProps> = props => {
  const { customer, disabled, manageAddressHref } = props;
  const classes = useStyles(props);
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "BfJGij",
            defaultMessage: "Address Information",
            description: "header",
          })}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            data-test-id="manage-addresses"
            disabled={disabled}
            variant="tertiary"
            href={manageAddressHref}
          >
            <FormattedMessage {...buttonMessages.manage} />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      {maybe(() => customer.defaultBillingAddress.id) !==
      maybe(() => customer.defaultShippingAddress.id) ? (
        <>
          {maybe(() => customer.defaultBillingAddress) !== null && (
            <DashboardCard.Content>
              <Typography className={classes.label}>
                <FormattedMessage
                  id="biVFKU"
                  defaultMessage="Billing Address"
                  description="subsection header"
                />
              </Typography>
              <AddressFormatter address={maybe(() => customer.defaultBillingAddress)} />
            </DashboardCard.Content>
          )}
          {maybe(() => customer.defaultBillingAddress && customer.defaultShippingAddress) && <Hr />}
          {maybe(() => customer.defaultShippingAddress) && (
            <DashboardCard.Content>
              <Typography className={classes.label}>
                <FormattedMessage
                  id="Zd3Eew"
                  defaultMessage="Shipping Address"
                  description="subsection header"
                />
              </Typography>
              <AddressFormatter address={maybe(() => customer.defaultShippingAddress)} />
            </DashboardCard.Content>
          )}
        </>
      ) : maybe(() => customer.defaultBillingAddress) === null &&
        maybe(() => customer.defaultShippingAddress) === null ? (
        <DashboardCard.Content>
          <Typography>
            <FormattedMessage id="3d1RXL" defaultMessage="This customer has no addresses yet" />
          </Typography>
        </DashboardCard.Content>
      ) : (
        <DashboardCard.Content>
          <Typography className={classes.label}>
            <FormattedMessage
              id="bHdFph"
              defaultMessage="Address"
              description="subsection header"
            />
          </Typography>
          <AddressFormatter address={maybe(() => customer.defaultBillingAddress)} />
        </DashboardCard.Content>
      )}
    </DashboardCard>
  );
};

CustomerAddresses.displayName = "CustomerAddresses";
export default CustomerAddresses;
