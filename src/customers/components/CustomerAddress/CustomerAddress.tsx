import { Card, CardContent } from "@material-ui/core";
import AddressFormatter from "@saleor/components/AddressFormatter";
import CardMenu from "@saleor/components/CardMenu";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { AddressFragment, AddressTypeEnum } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

export interface CustomerAddressProps {
  address: AddressFragment;
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
    id: "hMRP6J",
    defaultMessage: "Default Address",
  },
  defaultBillingAddress: {
    id: "VyzsWZ",
    defaultMessage: "Default Billing Address",
  },
  defaultShippingAddress: {
    id: "nLML8Y",
    defaultMessage: "Default Shipping Address",
  },
  deleteAddress: {
    id: "puikeb",
    defaultMessage: "Delete Address",
    description: "button",
  },
  editAddress: {
    id: "w+8BfK",
    defaultMessage: "Edit Address",
    description: "button",
  },
  setDefaultBilling: {
    id: "hLOEeb",
    defaultMessage: "Set as default billing address",
    description: "button",
  },
  setDefaultShipping: {
    id: "+7OsyM",
    defaultMessage: "Set as default shipping address",
    description: "button",
  },
});

const useStyles = makeStyles(
  {
    actions: {
      flexDirection: "row",
    },
    actionsContainer: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "flex-end",
    },
    card: {
      display: "flex",
      flexDirection: "column",
    },
  },
  { name: "CustomerAddress" },
);
const CustomerAddress: React.FC<CustomerAddressProps> = props => {
  const {
    address,
    disabled,
    isDefaultBillingAddress,
    isDefaultShippingAddress,
    onEdit,
    onRemove,
    onSetAsDefault,
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
        toolbar={
          <CardMenu
            disabled={disabled}
            menuItems={[
              {
                label: intl.formatMessage(messages.setDefaultShipping),
                onSelect: () => onSetAsDefault(AddressTypeEnum.SHIPPING),
                testId: "set-default-shipping-address",
              },
              {
                label: intl.formatMessage(messages.setDefaultBilling),
                onSelect: () => onSetAsDefault(AddressTypeEnum.BILLING),
                testId: "set-default-billing-address",
              },
              {
                label: intl.formatMessage(messages.editAddress),
                onSelect: () => onEdit(),
                testId: "edit-address",
              },
              {
                label: intl.formatMessage(messages.deleteAddress),
                onSelect: () => onRemove(),
                testId: "delete-address",
              },
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
