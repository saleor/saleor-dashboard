import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import AddressEdit from "@saleor/components/AddressEdit";
import CardSpacer from "@saleor/components/CardSpacer";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import CustomerAddressChoice from "@saleor/customers/components/CustomerAddressChoice";
import { AddressTypeInput } from "@saleor/customers/types";
import {
  CustomerAddresses_user_addresses,
  CustomerAddresses_user_defaultBillingAddress,
  CustomerAddresses_user_defaultShippingAddress
} from "@saleor/customers/types/CustomerAddresses";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React, { useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  title: {
    defaultMessage: "Shipping address for order",
    description: "dialog header"
  },
  customerAddress: {
    defaultMessage: "Use one of customer addresses",
    description: "address type"
  },
  newAddress: {
    defaultMessage: "Add new address",
    description: "address type"
  },
  billingSameAsShipping: {
    defaultMessage: "Billing address same as shipping address",
    description: "checkbox label"
  },
  shippingAddressDescription: {
    defaultMessage:
      "Which address would you like to use as shipping address for selected customer:",
    description: "dialog content"
  },
  billingAddressDescription: {
    defaultMessage: "Select one of customer addresses or add a new address:",
    description: "dialog content"
  }
});

const useStyles = makeStyles(
  {
    container: {
      display: "block"
    },
    optionLabel: {
      display: "block"
    },
    overflow: {
      overflowY: "visible"
    }
  },
  { name: "OrderCustomerAddressesEditDialog" }
);

export enum AddressInputOptionEnum {
  CUSTOMER_ADDRESS = "customerAddress",
  NEW_ADDRESS = "newAddress"
}

export interface OrderCustomerAddressesEditDialogData {
  billingSameAsShipping: boolean;
  shippingAddressInputOption: AddressInputOptionEnum;
  billingAddressInputOption: AddressInputOptionEnum;
  customerShippingAddress: CustomerAddresses_user_defaultShippingAddress;
  customerBillingAddress: CustomerAddresses_user_defaultBillingAddress;
  shippingAddress: AddressTypeInput;
  billingAddress: AddressTypeInput;
}

export interface OrderCustomerAddressesEditDialogProps {
  open: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  countries?: Array<{
    code: string;
    label: string;
  }>;
  customerAddresses?: CustomerAddresses_user_addresses[];
  defaultShippingAddress?: CustomerAddresses_user_defaultShippingAddress;
  defaultBillingAddress?: CustomerAddresses_user_defaultBillingAddress;
  onClose();
  onConfirm(data: AddressInput);
}

const OrderCustomerAddressesEditDialog: React.FC<OrderCustomerAddressesEditDialogProps> = props => {
  const {
    open,
    confirmButtonState,
    errors = [],
    countries = [],
    customerAddresses = [],
    defaultShippingAddress,
    defaultBillingAddress,
    onClose,
    onConfirm
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [shippingCountryDisplayName, setShippingCountryDisplayName] = useState(
    ""
  );
  const [billingCountryDisplayName, setBillingCountryDisplayName] = useState(
    ""
  );
  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onConfirm);
  const dialogErrors = useModalDialogErrors(
    [...errors, ...validationErrors],
    open
  );

  const countryChoices = countries.map(country => ({
    label: country.label,
    value: country.code
  }));

  const initialAddress: AddressTypeInput = {
    city: "",
    country: "",
    phone: "",
    postalCode: "",
    streetAddress1: ""
  };

  const initialData: OrderCustomerAddressesEditDialogData = {
    billingSameAsShipping: true,
    shippingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
    billingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
    customerShippingAddress: defaultShippingAddress,
    customerBillingAddress: defaultBillingAddress,
    shippingAddress: initialAddress,
    billingAddress: initialAddress
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <Form initial={initialData} onSubmit={handleSubmit}>
        {({ change, data }) => {
          const handleShippingCountrySelect = createSingleAutocompleteSelectHandler(
            event =>
              change({
                target: {
                  name: "shippingAddress",
                  value: event.target.value
                }
              }),
            setShippingCountryDisplayName,
            countryChoices
          );
          const handleBillingCountrySelect = createSingleAutocompleteSelectHandler(
            event =>
              change({
                target: {
                  name: "billingAddress",
                  value: event.target.value
                }
              }),
            setBillingCountryDisplayName,
            countryChoices
          );

          return (
            <>
              <DialogTitle>
                <FormattedMessage {...messages.title} />
              </DialogTitle>
              <DialogContent className={classes.overflow}>
                <Typography>
                  <FormattedMessage {...messages.shippingAddressDescription} />
                </Typography>
                <FormSpacer />
                <RadioGroup
                  className={classes.container}
                  value={data.shippingAddressInputOption}
                  name="shippingAddressInputOption"
                  onChange={event => change(event)}
                >
                  <FormControlLabel
                    value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
                    control={<Radio color="primary" />}
                    label={intl.formatMessage(messages.customerAddress)}
                    className={classes.optionLabel}
                  />
                  {data.shippingAddressInputOption ===
                    AddressInputOptionEnum.CUSTOMER_ADDRESS && (
                    <>
                      {customerAddresses.map(customerAddress => (
                        <React.Fragment key={customerAddress.id}>
                          <CardSpacer />
                          <CustomerAddressChoice
                            address={customerAddress}
                            selected={
                              customerAddress.id ===
                              data.customerShippingAddress?.id
                            }
                            onSelect={() =>
                              change({
                                target: {
                                  name: "customerShippingAddress",
                                  value: customerAddress
                                }
                              })
                            }
                          />
                        </React.Fragment>
                      ))}
                      <FormSpacer />
                    </>
                  )}
                  <FormControlLabel
                    value={AddressInputOptionEnum.NEW_ADDRESS}
                    control={<Radio color="primary" />}
                    label={intl.formatMessage(messages.newAddress)}
                    className={classes.optionLabel}
                  />
                  {data.shippingAddressInputOption ===
                    AddressInputOptionEnum.NEW_ADDRESS && (
                    <>
                      <FormSpacer />
                      <AddressEdit
                        countries={countryChoices}
                        countryDisplayValue={shippingCountryDisplayName}
                        data={data.shippingAddress}
                        errors={dialogErrors}
                        onChange={event =>
                          change({
                            target: {
                              name: "shippingAddress",
                              value: {
                                ...data.shippingAddress,
                                [event.target.name]: event.target.value
                              }
                            }
                          })
                        }
                        onCountryChange={handleShippingCountrySelect}
                      />
                    </>
                  )}
                </RadioGroup>
                <FormSpacer />
                <Divider />
                <FormSpacer />
                <ControlledCheckbox
                  checked={data.billingSameAsShipping}
                  name="billingSameAsShipping"
                  label={intl.formatMessage(messages.billingSameAsShipping)}
                  onChange={change}
                />
                {!data.billingSameAsShipping && (
                  <>
                    <FormSpacer />
                    <Typography>
                      <FormattedMessage
                        {...messages.billingAddressDescription}
                      />
                    </Typography>
                    <FormSpacer />
                    <RadioGroup
                      className={classes.container}
                      value={data.billingAddressInputOption}
                      name="billingAddressInputOption"
                      onChange={event => change(event)}
                    >
                      <FormControlLabel
                        value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
                        control={<Radio color="primary" />}
                        label={intl.formatMessage(messages.customerAddress)}
                        className={classes.optionLabel}
                      />
                      {data.billingAddressInputOption ===
                        AddressInputOptionEnum.CUSTOMER_ADDRESS && (
                        <>
                          {customerAddresses.map(customerAddress => (
                            <React.Fragment key={customerAddress.id}>
                              <CardSpacer />
                              <CustomerAddressChoice
                                address={customerAddress}
                                selected={
                                  customerAddress.id ===
                                  data.customerBillingAddress?.id
                                }
                                onSelect={() =>
                                  change({
                                    target: {
                                      name: "customerBillingAddress",
                                      value: customerAddress
                                    }
                                  })
                                }
                              />
                            </React.Fragment>
                          ))}
                          <FormSpacer />
                        </>
                      )}
                      <FormControlLabel
                        value={AddressInputOptionEnum.NEW_ADDRESS}
                        control={<Radio color="primary" />}
                        label={intl.formatMessage(messages.newAddress)}
                        className={classes.optionLabel}
                      />
                      {data.billingAddressInputOption ===
                        AddressInputOptionEnum.NEW_ADDRESS && (
                        <>
                          <FormSpacer />
                          <AddressEdit
                            countries={countryChoices}
                            countryDisplayValue={billingCountryDisplayName}
                            data={data.billingAddress}
                            errors={dialogErrors}
                            onChange={event =>
                              change({
                                target: {
                                  name: "billingAddress",
                                  value: {
                                    ...data.billingAddress,
                                    [event.target.name]: event.target.value
                                  }
                                }
                              })
                            }
                            onCountryChange={handleBillingCountrySelect}
                          />
                        </>
                      )}
                    </RadioGroup>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  <FormattedMessage {...buttonMessages.select} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};

OrderCustomerAddressesEditDialog.displayName =
  "OrderCustomerAddressesEditDialog";
export default OrderCustomerAddressesEditDialog;
