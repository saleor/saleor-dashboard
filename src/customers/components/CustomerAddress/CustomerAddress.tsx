import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AddressFormatter from "@saleor/components/AddressFormatter";
import CardMenu from "@saleor/components/CardMenu";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import { buttonMessages } from "@saleor/intl";
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
                ? intl.formatMessage({
                    defaultMessage: "Default Address"
                  })
                : isDefaultShippingAddress
                ? intl.formatMessage({
                    defaultMessage: "Default Shipping Address"
                  })
                : isDefaultBillingAddress
                ? intl.formatMessage({
                    defaultMessage: "Default Billing Address"
                  })
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
                label: intl.formatMessage({
                  defaultMessage: "Set as default shipping address",
                  description: "button"
                }),
                onSelect: () => onSetAsDefault(AddressTypeEnum.SHIPPING)
              },
              {
                label: intl.formatMessage({
                  defaultMessage: "Set as default billing address",
                  description: "button"
                }),
                onSelect: () => onSetAsDefault(AddressTypeEnum.BILLING)
              }
            ]}
          />
        }
      />
      <CardContent>
        <AddressFormatter address={address} />
      </CardContent>
      <div className={classes.actionsContainer}>
        <CardActions className={classes.actions}>
          <Button color="primary" disabled={disabled} onClick={onEdit}>
            <FormattedMessage {...buttonMessages.edit} />
          </Button>
          <Button color="primary" disabled={disabled} onClick={onRemove}>
            <FormattedMessage {...buttonMessages.delete} />
          </Button>
        </CardActions>
      </div>
    </Card>
  );
};
CustomerAddress.displayName = "CustomerAddress";
export default CustomerAddress;
