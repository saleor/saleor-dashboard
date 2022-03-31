import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel
} from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import {
  AddressFragment,
  AddressInput,
  AddressTypeEnum,
  CountryWithCodeFragment,
  Node,
  OrderErrorFragment
} from "@saleor/graphql";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import {
  Button,
  ConfirmButtonTransitionState,
  DialogHeader
} from "@saleor/macaw-ui";
import {
  getAddressFormData,
  transformAddressToAddressInput
} from "@saleor/misc";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import OrderCustomerAddressesEditForm, {
  AddressInputOptionEnum,
  OrderCustomerAddressesEditFormData
} from "./form";
import { dialogMessages } from "./messages";
import OrderCustomerAddressEdit from "./OrderCustomerAddressEdit";
import { useStyles } from "./styles";
import {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogOutput
} from "./types";
import { getAddressEditProps, validateDefaultAddress } from "./utils";

export interface OrderCustomerAddressesEditDialogProps {
  open: boolean;
  variant: AddressEditDialogVariant;
  loading: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  countries?: CountryWithCodeFragment[];
  customerAddresses?: AddressFragment[];
  defaultShippingAddress?: Node;
  defaultBillingAddress?: Node;
  onClose();
  onConfirm(
    data: Partial<OrderCustomerAddressesEditDialogOutput>
  ): SubmitPromise<any[]>;
}

const OrderCustomerAddressesEditDialog: React.FC<OrderCustomerAddressesEditDialogProps> = props => {
  const {
    open,
    variant,
    loading,
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

  const hasCustomerChanged = variant === "CHANGE_CUSTOMER_ADDRESS";
  const isShippingAddressEdited =
    variant === "CHANGE_SHIPPING_ADDRESS" || hasCustomerChanged;

  const {
    errors: shippingValidationErrors,
    submit: handleNewShippingAddressSubmit
  } = useAddressValidation(address => address, AddressTypeEnum.SHIPPING);
  const {
    errors: billingValidationErrors,
    submit: handleNewBillingAddressSubmit
  } = useAddressValidation(address => address, AddressTypeEnum.BILLING);

  const dialogErrors = useModalDialogErrors(
    [...errors, ...shippingValidationErrors, ...billingValidationErrors],
    open
  );

  const getCustomerAddress = (
    selectedCustomerAddressID: string
  ): AddressInput =>
    transformAddressToAddressInput(
      customerAddresses.find(getById(selectedCustomerAddressID))
    );

  const handleAddressesSubmit = (data: OrderCustomerAddressesEditFormData) => {
    const shippingAddress =
      customerAddresses.length > 0 &&
      data.shippingAddressInputOption ===
        AddressInputOptionEnum.CUSTOMER_ADDRESS
        ? getCustomerAddress(data.customerShippingAddress.id)
        : handleNewShippingAddressSubmit(data.shippingAddress);

    const billingAddress =
      customerAddresses.length > 0 &&
      data.billingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS
        ? getCustomerAddress(data.customerBillingAddress.id)
        : handleNewBillingAddressSubmit(data.billingAddress);

    if (isShippingAddressEdited) {
      return {
        shippingAddress,
        ...(data.cloneAddress && { billingAddress: shippingAddress })
      };
    }

    return {
      ...(data.cloneAddress && { shippingAddress: billingAddress }),
      billingAddress
    };
  };

  const getDialogTitle = (): MessageDescriptor => {
    if (variant === "CHANGE_SHIPPING_ADDRESS") {
      return dialogMessages.shippingChangeTitle;
    }
    if (variant === "CHANGE_BILLING_ADDRESS") {
      return dialogMessages.billingChangeTitle;
    }
    return dialogMessages.customerChangeTitle;
  };

  const handleSubmit = async (data: OrderCustomerAddressesEditFormData) => {
    const addressesInput = handleAddressesSubmit(data);
    if (addressesInput) {
      await onConfirm(addressesInput as OrderCustomerAddressesEditDialogOutput);
    }

    return Promise.resolve([
      ...shippingValidationErrors,
      ...billingValidationErrors
    ]);
  };

  const countryChoices = mapCountriesToChoices(countries);

  const validatedDefaultShippingAddress = validateDefaultAddress(
    defaultShippingAddress,
    customerAddresses
  );
  const validatedDefaultBillingAddress = validateDefaultAddress(
    defaultBillingAddress,
    customerAddresses
  );

  const addressEditCommonProps = {
    showCard: hasCustomerChanged,
    loading,
    countryChoices,
    customerAddresses
  };

  const getVariant = (
    action: AddressEditDialogVariant
  ): "shipping" | "billing" => {
    switch (action) {
      case "CHANGE_CUSTOMER_ADDRESS":
      case "CHANGE_SHIPPING_ADDRESS":
        return "shipping";
      case "CHANGE_BILLING_ADDRESS":
        return "billing";
    }
  };

  const exitModal = () => {
    onClose();
  };

  return (
    <Dialog onClose={exitModal} open={open} fullWidth>
      <DialogHeader onClose={exitModal}>
        <FormattedMessage {...getDialogTitle()} />
      </DialogHeader>
      <OrderCustomerAddressesEditForm
        countryChoices={countryChoices}
        countries={countries}
        hasAddresses={!!customerAddresses.length}
        defaultShippingAddress={validatedDefaultShippingAddress}
        defaultBillingAddress={validatedDefaultBillingAddress}
        defaultCloneAddress={hasCustomerChanged}
        initial={{
          shippingAddress: getAddressFormData(),
          billingAddress: getAddressFormData()
        }}
        onSubmit={handleSubmit}
      >
        {({ change, data, handlers }) => {
          const addressEditProps = getAddressEditProps(
            getVariant(variant),
            data,
            handlers,
            change,
            dialogErrors,
            addressEditCommonProps
          );

          return (
            <>
              <DialogContent className={classes.dialogContent}>
                <OrderCustomerAddressEdit
                  {...addressEditProps}
                  customerAddresses={customerAddresses}
                  selectedCustomerAddressId={
                    isShippingAddressEdited
                      ? data.customerShippingAddress?.id
                      : data.customerBillingAddress?.id
                  }
                  onChangeCustomerAddress={customerAddress =>
                    isShippingAddressEdited
                      ? handlers.changeCustomerAddress(
                          customerAddress,
                          "customerShippingAddress"
                        )
                      : handlers.changeCustomerAddress(
                          customerAddress,
                          "customerBillingAddress"
                        )
                  }
                />
                <FormSpacer />
              </DialogContent>
              <DialogActions>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.cloneAddress}
                      name="addressesAreTheSame"
                      onChange={() =>
                        change({
                          target: {
                            name: "cloneAddress",
                            value: !data.cloneAddress
                          }
                        })
                      }
                      data-test-id="addresses-are-the-same"
                    />
                  }
                  label={intl.formatMessage(
                    isShippingAddressEdited
                      ? dialogMessages.billingSameAsShipping
                      : dialogMessages.shippingSameAsBilling
                  )}
                />
                <Button
                  variant="secondary"
                  onClick={() => exitModal()}
                  // One mui style has to be overwritten
                  // Inline styling has higher specificity
                  style={{
                    marginLeft: "auto"
                  }}
                  data-test-id="cancel"
                >
                  <FormattedMessage {...buttonMessages.cancel} />
                </Button>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  variant="primary"
                  type="submit"
                  data-test-id="submit"
                >
                  <FormattedMessage {...buttonMessages.save} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </OrderCustomerAddressesEditForm>
    </Dialog>
  );
};

OrderCustomerAddressesEditDialog.displayName =
  "OrderCustomerAddressesEditDialog";
export default OrderCustomerAddressesEditDialog;
