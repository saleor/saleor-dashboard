import { Card, CardContent, Typography } from "@material-ui/core";
import AddressFormatter from "@saleor/components/AddressFormatter";
import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import { CustomerDetailsFragment } from "@saleor/graphql";
import { buttonMessages } from "@saleor/intl";
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
    <Card>
      <CardTitle
        title={intl.formatMessage({
          id: "BfJGij",
          defaultMessage: "Address Information",
          description: "header",
        })}
        toolbar={
          <Button
            data-test-id="manage-addresses"
            disabled={disabled}
            variant="tertiary"
            href={manageAddressHref}
          >
            <FormattedMessage {...buttonMessages.manage} />
          </Button>
        }
      />
      {maybe(() => customer.defaultBillingAddress.id) !==
      maybe(() => customer.defaultShippingAddress.id) ? (
        <>
          {maybe(() => customer.defaultBillingAddress) !== null && (
            <CardContent>
              <Typography className={classes.label}>
                <FormattedMessage
                  id="biVFKU"
                  defaultMessage="Billing Address"
                  description="subsection header"
                />
              </Typography>
              <AddressFormatter
                address={maybe(() => customer.defaultBillingAddress)}
              />
            </CardContent>
          )}
          {maybe(
            () =>
              customer.defaultBillingAddress && customer.defaultShippingAddress,
          ) && <Hr />}
          {maybe(() => customer.defaultShippingAddress) && (
            <CardContent>
              <Typography className={classes.label}>
                <FormattedMessage
                  id="Zd3Eew"
                  defaultMessage="Shipping Address"
                  description="subsection header"
                />
              </Typography>
              <AddressFormatter
                address={maybe(() => customer.defaultShippingAddress)}
              />
            </CardContent>
          )}
        </>
      ) : maybe(() => customer.defaultBillingAddress) === null &&
        maybe(() => customer.defaultShippingAddress) === null ? (
        <CardContent>
          <Typography>
            <FormattedMessage
              id="3d1RXL"
              defaultMessage="This customer has no addresses yet"
            />
          </Typography>
        </CardContent>
      ) : (
        <CardContent>
          <Typography className={classes.label}>
            <FormattedMessage
              id="bHdFph"
              defaultMessage="Address"
              description="subsection header"
            />
          </Typography>
          <AddressFormatter
            address={maybe(() => customer.defaultBillingAddress)}
          />
        </CardContent>
      )}
    </Card>
  );
};
CustomerAddresses.displayName = "CustomerAddresses";
export default CustomerAddresses;
