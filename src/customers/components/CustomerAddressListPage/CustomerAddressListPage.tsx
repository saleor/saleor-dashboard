import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { maybe, renderCollection } from "../../../misc";
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
      columnGap: theme.spacing(3),
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      rowGap: theme.spacing(3)
    }
  }),
  { name: "CustomerAddressListPage" }
);

const CustomerAddressListPage: React.FC<
  CustomerAddressListPageProps
> = props => {
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

  const isEmpty = maybe(() => customer.addresses.length) === 0;
  const fullName = maybe(
    () => [customer.firstName, customer.lastName].join(" "),
    "..."
  );

  return (
    <Container>
      <AppHeader onBack={onBack}>
        <FormattedMessage
          defaultMessage="{fullName} Details"
          description="customer details, header"
          values={{
            fullName
          }}
        />
      </AppHeader>
      {!isEmpty && (
        <PageHeader
          title={intl.formatMessage(
            {
              defaultMessage: "{fullName}'s Address Book",
              description: "customer's address book, header"
            },
            {
              fullName
            }
          )}
        >
          <Button color="primary" variant="contained" onClick={onAdd}>
            <FormattedMessage
              defaultMessage="Add address"
              description="button"
            />
          </Button>
        </PageHeader>
      )}
      {isEmpty ? (
        <div className={classes.empty}>
          <Typography variant="h5">
            <FormattedMessage defaultMessage="There is no address to show for this customer" />
          </Typography>
          <Typography className={classes.description}>
            <FormattedMessage defaultMessage="This customer doesn’t have any adresses added to his address book. You can add address using the button below." />
          </Typography>
          <Button
            className={classes.addButton}
            color="primary"
            variant="contained"
            onClick={onAdd}
          >
            <FormattedMessage
              defaultMessage="Add address"
              description="button"
            />
          </Button>
        </div>
      ) : (
        <div className={classes.root}>
          {renderCollection(
            maybe(() => customer.addresses),
            (address, addressNumber) => (
              <CustomerAddress
                address={address}
                addressNumber={addressNumber + 1}
                disabled={disabled}
                isDefaultBillingAddress={
                  maybe(() => customer.defaultBillingAddress.id) ===
                  maybe(() => address.id)
                }
                isDefaultShippingAddress={
                  maybe(() => customer.defaultShippingAddress.id) ===
                  maybe(() => address.id)
                }
                onEdit={() => onEdit(address.id)}
                onRemove={() => onRemove(address.id)}
                onSetAsDefault={type => onSetAsDefault(address.id, type)}
                key={maybe(() => address.id, "skeleton")}
              />
            )
          )}
        </div>
      )}
    </Container>
  );
};
CustomerAddressListPage.displayName = "CustomerAddressListPage";
export default CustomerAddressListPage;
