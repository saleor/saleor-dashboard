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
import FormSpacer from "@saleor/components/FormSpacer";
import CustomerAddressChoice from "@saleor/customers/components/CustomerAddressChoice";
import {
  CustomerAddresses_user_addresses,
  CustomerAddresses_user_defaultBillingAddress,
  CustomerAddresses_user_defaultShippingAddress
} from "@saleor/customers/types/CustomerAddresses";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import { transformAddressToForm, transformFormToAddress } from "@saleor/misc";
import { makeStyles } from "@saleor/theme";
import { AddressInput, AddressTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderCustomerAddressesEditForm, {
  AddressInputOptionEnum,
  OrderCustomerAddressesEditFormData
} from "./form";
import messages from "./messages";

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

export interface OrderCustomerAddressesEditDialogOutput {
  shippingAddress: AddressInput;
  billingAddress: AddressInput;
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
  onConfirm(data: OrderCustomerAddressesEditDialogOutput): SubmitPromise;
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
  const {
    errors: shippingValidationErrors,
    submit: handleShippingSubmit
  } = useAddressValidation(address => address, AddressTypeEnum.SHIPPING);
  const {
    errors: billingValidationErrors,
    submit: handleBillingSubmit
  } = useAddressValidation(address => address, AddressTypeEnum.BILLING);
  const dialogErrors = useModalDialogErrors(
    [...errors, ...shippingValidationErrors, ...billingValidationErrors],
    open
  );

  const getCustomerAddress = (customerAddressId: string): AddressInput =>
    transformFormToAddress(
      transformAddressToForm(
        customerAddresses.find(
          customerAddress => customerAddress.id === customerAddressId
        )
      )
    );

  const handleAddressesSubmit = (data: OrderCustomerAddressesEditFormData) => {
    const shippingAddress =
      data.shippingAddressInputOption ===
      AddressInputOptionEnum.CUSTOMER_ADDRESS
        ? getCustomerAddress(data.customerShippingAddress.id)
        : handleShippingSubmit(data.shippingAddress);

    if (data.billingSameAsShipping) {
      return {
        shippingAddress,
        billingAddress: shippingAddress
      };
    }

    const billingAddress =
      data.billingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS
        ? getCustomerAddress(data.customerBillingAddress.id)
        : handleBillingSubmit(data.billingAddress);

    return {
      shippingAddress,
      billingAddress
    };
  };

  const handleSubmit = (data: OrderCustomerAddressesEditFormData) => {
    const adressesInput = handleAddressesSubmit(data);

    if (adressesInput.shippingAddress && adressesInput.billingAddress) {
      onConfirm(adressesInput);
    }
  };

  const countryChoices = countries.map(country => ({
    label: country.label,
    value: country.code
  }));

  return (
    <Dialog onClose={onClose} open={open}>
      <OrderCustomerAddressesEditForm
        countryChoices={countryChoices}
        defaultShippingAddress={defaultShippingAddress}
        defaultBillingAddress={defaultBillingAddress}
        onSubmit={handleSubmit}
      >
        {({ change, data, handlers }) => (
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
                      countryDisplayValue={data.shippingCountryDisplayName}
                      data={data.shippingAddress}
                      errors={dialogErrors.filter(
                        error => error.addressType === AddressTypeEnum.SHIPPING
                      )}
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
                      onCountryChange={handlers.selectShippingCountry}
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
                    <FormattedMessage {...messages.billingAddressDescription} />
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
                          countryDisplayValue={data.billingCountryDisplayName}
                          data={data.billingAddress}
                          errors={dialogErrors.filter(
                            error =>
                              error.addressType === AddressTypeEnum.BILLING
                          )}
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
                          onCountryChange={handlers.selectBillingCountry}
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
        )}
      </OrderCustomerAddressesEditForm>
    </Dialog>
  );
};

OrderCustomerAddressesEditDialog.displayName =
  "OrderCustomerAddressesEditDialog";
export default OrderCustomerAddressesEditDialog;
