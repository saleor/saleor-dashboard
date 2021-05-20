import { Button, Typography } from "@material-ui/core";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { renderCollection } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { AddressTypeEnum } from "../../../types/globalTypes";
import { CustomerAddresses_user } from "../../types/CustomerAddresses";
import CustomerAddress from "../CustomerAddress/CustomerAddress";

export interface CustomerAddressListPageProps {
  customer: CustomerAddresses_user;
  disabled: boolean;
  onAdd: () => void;
  onBack: () => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  onSetAsDefault: (id: string, type: AddressTypeEnum) => void;
}

const messages = defineMessages({
  addAddress: {
    defaultMessage: "Add address",
    description: "button"
  },
  doesntHaveAddresses: {
    defaultMessage:
      "This customer doesn’t have any adresses added to his address book. You can add address using the button below."
  },
  fullNameAddress: {
    defaultMessage: "{fullName}'s Address Book",
    description: "customer's address book, header"
  },
  fullNameDetail: {
    defaultMessage: "{fullName} Details",
    description: "customer details, header"
  },
  noAddressToShow: {
    defaultMessage: "There is no address to show for this customer"
  }
});

const useStyles = makeStyles(
  theme => ({
    addButton: {
      marginTop: theme.spacing(2)
    },
    description: {
      marginTop: theme.spacing(1)
    },
    empty: {
      margin: `${theme.spacing(13)}px auto 0`,
      textAlign: "center",
      width: 600
    },
    root: {
      display: "grid",
      gap: `${theme.spacing(3)}px`,
      gridTemplateColumns: "repeat(3, 1fr)",
      [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "repeat(2, 1fr)"
      },
      [theme.breakpoints.down("sm")]: {
        gridTemplateColumns: "repeat(1, 1fr)"
      }
    }
  }),
  { name: "CustomerAddressListPage" }
);

const CustomerAddressListPage: React.FC<CustomerAddressListPageProps> = props => {
  const {
    customer,
    disabled,
    onAdd,
    onBack,
    onEdit,
    onRemove,
    onSetAsDefault
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const isEmpty = customer?.addresses?.length === 0;
  const fullName = [customer?.firstName, customer?.lastName].join(" ") || "...";

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(messages.fullNameDetail, { fullName })}
      </AppHeader>
      {!isEmpty && (
        <PageHeader
          title={intl.formatMessage(messages.fullNameAddress, { fullName })}
        >
          <Button color="primary" variant="contained" onClick={onAdd}>
            {intl.formatMessage(messages.addAddress)}
          </Button>
        </PageHeader>
      )}
      {isEmpty ? (
        <div className={classes.empty}>
          <Typography variant="h5">
            {intl.formatMessage(messages.noAddressToShow)}
          </Typography>
          <Typography className={classes.description}>
            {intl.formatMessage(messages.doesntHaveAddresses)}
          </Typography>
          <Button
            className={classes.addButton}
            color="primary"
            variant="contained"
            onClick={onAdd}
          >
            {intl.formatMessage(messages.addAddress)}
          </Button>
        </div>
      ) : (
        <div className={classes.root}>
          {renderCollection(customer?.addresses, (address, addressNumber) => (
            <CustomerAddress
              address={address}
              addressNumber={addressNumber + 1}
              disabled={disabled}
              isDefaultBillingAddress={
                customer?.defaultBillingAddress?.id === address?.id
              }
              isDefaultShippingAddress={
                customer?.defaultShippingAddress?.id === address?.id
              }
              onEdit={() => onEdit(address.id)}
              onRemove={() => onRemove(address.id)}
              onSetAsDefault={type => onSetAsDefault(address.id, type)}
              key={address?.id || "skeleton"}
            />
          ))}
        </div>
      )}
    </Container>
  );
};
CustomerAddressListPage.displayName = "CustomerAddressListPage";
export default CustomerAddressListPage;
