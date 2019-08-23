import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AddressFormatter from "@saleor/components/AddressFormatter";
import CardTitle from "@saleor/components/CardTitle";
import { Hr } from "@saleor/components/Hr";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "../../../misc";
import { CustomerDetails_user } from "../../types/CustomerDetails";

const styles = (theme: Theme) =>
  createStyles({
    label: {
      fontWeight: 600,
      marginBottom: theme.spacing.unit
    }
  });

export interface CustomerAddressesProps extends WithStyles<typeof styles> {
  customer: CustomerDetails_user;
  disabled: boolean;
  onAddressManageClick: () => void;
}

const CustomerAddresses = withStyles(styles, { name: "CustomerAddresses" })(
  ({
    classes,
    customer,
    disabled,
    onAddressManageClick
  }: CustomerAddressesProps) => {
    const intl = useIntl();

    return (
      <Card>
        <CardTitle
          title={intl.formatMessage({
            defaultMessage: "Address Information",
            description: "header"
          })}
          toolbar={
            <Button
              color="primary"
              disabled={disabled}
              variant="text"
              onClick={onAddressManageClick}
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
                    defaultMessage="Billing address"
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
                customer.defaultBillingAddress &&
                customer.defaultShippingAddress
            ) && <Hr />}
            {maybe(() => customer.defaultShippingAddress) && (
              <CardContent>
                <Typography className={classes.label}>
                  <FormattedMessage
                    defaultMessage="Shipping address"
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
              <FormattedMessage defaultMessage="This customer has no addresses yet" />
            </Typography>
          </CardContent>
        ) : (
          <CardContent>
            <Typography className={classes.label}>
              <FormattedMessage
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
  }
);
CustomerAddresses.displayName = "CustomerAddresses";
export default CustomerAddresses;
