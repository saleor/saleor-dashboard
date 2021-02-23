import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import AddressFormatter from "@saleor/components/AddressFormatter";
import CardMenu from "@saleor/components/CardMenu";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { AddressTypeEnum } from "../../../types/globalTypes";
import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";

export interface CustomerAddressProps {
  address: CustomerAddresses_user_addresses;
  disabled: boolean;
  isDefaultBillingAddress: boolean;
  isDefaultShippingAddress: boolean;
  addressNumber: number;
  onEdit: () => void;
  onRemove: () => void;
  onSetAsDefault: (type: AddressTypeEnum) => void;
}

const messages = defineMessages({
  defaultAddress: {
    defaultMessage: "Default Address"
  },
  defaultBillingAddress: {
    defaultMessage: "Default Billing Address"
  },
  defaultShippingAddress: {
    defaultMessage: "Default Shipping Address"
  },
  deleteAddress: {
    defaultMessage: "Delete Address",
    description: "button"
  },
  editAddress: {
    defaultMessage: "Edit Address",
    description: "button"
  },
  setDefaultBilling: {
    defaultMessage: "Set as default billing address",
    description: "button"
  },
  setDefaultShipping: {
    defaultMessage: "Set as default shipping address",
    description: "button"
  }
});

const useStyles = makeStyles(
  {
    actions: {
      flexDirection: "row"
    },
    actionsContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "flex-end"
    },
    card: {
      display: "flex",
      flexDirection: "column"
    }
  },
  { name: "CustomerAddress" }
);
const CustomerAddress: React.FC<CustomerAddressProps> = props => {
  const {
    address,
    disabled,
    isDefaultBillingAddress,
    isDefaultShippingAddress,
    onEdit,
    onRemove,
    onSetAsDefault
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  return (
    <Card className={classes.card}>
      <CardTitle
        title={
          address ? (
            <>
              {isDefaultBillingAddress && isDefaultShippingAddress
                ? intl.formatMessage(messages.defaultAddress)
                : isDefaultShippingAddress
                ? intl.formatMessage(messages.defaultShippingAddress)
                : isDefaultBillingAddress
                ? intl.formatMessage(messages.defaultBillingAddress)
                : null}
            </>
          ) : (
            <Skeleton />
          )
        }
        height="const"
        toolbar={
          <CardMenu
            disabled={disabled}
            menuItems={[
              {
                label: intl.formatMessage(messages.setDefaultShipping),
                onSelect: () => onSetAsDefault(AddressTypeEnum.SHIPPING)
              },
              {
                label: intl.formatMessage(messages.setDefaultBilling),
                onSelect: () => onSetAsDefault(AddressTypeEnum.BILLING)
              },
              {
                label: intl.formatMessage(messages.editAddress),
                onSelect: () => onEdit()
              },
              {
                label: intl.formatMessage(messages.deleteAddress),
                onSelect: () => onRemove()
              }
            ]}
          />
        }
      />
      <CardContent>
        <AddressFormatter address={address} />
      </CardContent>
    </Card>
  );
};
CustomerAddress.displayName = "CustomerAddress";
export default CustomerAddress;
