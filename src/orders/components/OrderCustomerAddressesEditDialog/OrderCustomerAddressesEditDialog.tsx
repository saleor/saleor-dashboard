import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { AddressTypeInput } from "@saleor/customers/types";
import {
  AddressFragment,
  AddressInput,
  AddressTypeEnum,
  CountryWithCodeFragment,
  Node,
  OrderErrorFragment,
} from "@saleor/graphql";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, DialogHeader } from "@saleor/macaw-ui";
import { transformAddressToAddressInput } from "@saleor/misc";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import OrderCustomerAddressesEditForm, {
  AddressInputOptionEnum,
  OrderCustomerAddressesEditFormData,
} from "./form";
import { dialogMessages } from "./messages";
import OrderCustomerAddressEdit from "./OrderCustomerAddressEdit";
import OrderCustomerAddressesSearch from "./OrderCustomerAddressesSearch";
import { useStyles } from "./styles";
import {
  AddressEditDialogVariant,
  OrderCustomerAddressesEditDialogOutput,
  OrderCustomerSearchAddressState,
} from "./types";
import {
  getAddressEditProps,
  hasPreSubmitErrors,
  validateDefaultAddress,
} from "./utils";

export interface OrderCustomerAddressesEditDialogProps {
  open: boolean;
  variant: AddressEditDialogVariant;
  loading: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  orderShippingAddress?: AddressTypeInput;
  orderBillingAddress?: AddressTypeInput;
  countries?: CountryWithCodeFragment[];
  customerAddresses?: AddressFragment[];
  defaultShippingAddress?: Node;
  defaultBillingAddress?: Node;
  onClose();
  onConfirm(
    data: Partial<OrderCustomerAddressesEditDialogOutput>,
  ): SubmitPromise<any[]>;
}

const defaultSearchState: OrderCustomerSearchAddressState = {
  open: false,
  type: undefined,
};

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
    onConfirm,
    orderShippingAddress,
    orderBillingAddress,
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const hasCustomerChanged =
    variant === AddressEditDialogVariant.CHANGE_CUSTOMER;

  const {
    errors: shippingValidationErrors,
    submit: handleShippingSubmit,
  } = useAddressValidation(address => address, AddressTypeEnum.SHIPPING);
  const {
    errors: billingValidationErrors,
    submit: handleBillingSubmit,
  } = useAddressValidation(address => address, AddressTypeEnum.BILLING);

  const dialogErrors = useModalDialogErrors(
    [...errors, ...shippingValidationErrors, ...billingValidationErrors],
    open,
  );

  const continueToSearchAddressesState = (
    data: OrderCustomerAddressesEditFormData,
  ): boolean => {
    if (hasCustomerChanged || addressSearchState.open) {
      return false;
    }
    if (!customerAddresses.length) {
      return false;
    }
    if (variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS) {
      return (
        data.shippingAddressInputOption ===
        AddressInputOptionEnum.CUSTOMER_ADDRESS
      );
    }
    return (
      data.billingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS
    );
  };

  const getCustomerAddress = (
    selectedCustomerAddressID: string,
  ): AddressInput =>
    transformAddressToAddressInput(
      customerAddresses.find(getById(selectedCustomerAddressID)),
    );
  // async because handleShippingSubmit can return a promise
  const handleAddressesSubmit = async (
    data: OrderCustomerAddressesEditFormData,
  ) => {
    const shippingAddress =
      customerAddresses.length > 0 &&
      data.shippingAddressInputOption ===
        AddressInputOptionEnum.CUSTOMER_ADDRESS
        ? getCustomerAddress(data.customerShippingAddress.id)
        : await handleShippingSubmit(data.shippingAddress);

    const billingAddress =
      customerAddresses.length > 0 &&
      data.billingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS
        ? getCustomerAddress(data.customerBillingAddress.id)
        : await handleBillingSubmit(data.billingAddress);

    if (variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS) {
      return {
        shippingAddress,
        ...(data.cloneAddress && { billingAddress: shippingAddress }),
      };
    }
    if (variant === AddressEditDialogVariant.CHANGE_BILLING_ADDRESS) {
      return {
        ...(data.cloneAddress && { shippingAddress: billingAddress }),
        billingAddress,
      };
    }
    return {
      shippingAddress,
      billingAddress: data.cloneAddress ? shippingAddress : billingAddress,
    };
  };

  const getDialogTitle = (): MessageDescriptor => {
    if (addressSearchState.open) {
      if (variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS) {
        return dialogMessages.shippingTitle;
      }
      if (variant === AddressEditDialogVariant.CHANGE_BILLING_ADDRESS) {
        return dialogMessages.billingTitle;
      }
    }
    if (variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS) {
      return dialogMessages.shippingChangeTitle;
    }
    if (variant === AddressEditDialogVariant.CHANGE_BILLING_ADDRESS) {
      return dialogMessages.billingChangeTitle;
    }
    return dialogMessages.customerChangeTitle;
  };
  const getDialogDescription = (): MessageDescriptor => {
    if (customerAddresses.length === 0) {
      return dialogMessages.noAddressDescription;
    }
    if (variant === AddressEditDialogVariant.CHANGE_CUSTOMER) {
      return dialogMessages.customerChangeDescription;
    }
    return dialogMessages.addressChangeDescription;
  };

  const handleContinue = (data: OrderCustomerAddressesEditFormData) => {
    if (continueToSearchAddressesState(data)) {
      setAddressSearchState({
        open: true,
        type:
          variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS
            ? AddressTypeEnum.SHIPPING
            : AddressTypeEnum.BILLING,
      });
      return;
    }
    handleSubmit(data);
  };
  const handleSubmit = async (data: OrderCustomerAddressesEditFormData) => {
    const addressesInput = await handleAddressesSubmit(data);
    if (addressesInput && !hasPreSubmitErrors(addressesInput)) {
      await onConfirm(addressesInput as OrderCustomerAddressesEditDialogOutput);
      setAddressSearchState(defaultSearchState);
    }
    return Promise.resolve([
      ...shippingValidationErrors,
      ...billingValidationErrors,
    ]);
  };

  const countryChoices = mapCountriesToChoices(countries);

  const [addressSearchState, setAddressSearchState] = React.useState<
    OrderCustomerSearchAddressState
  >(defaultSearchState);

  const validatedDefaultShippingAddress = validateDefaultAddress(
    defaultShippingAddress,
    customerAddresses,
  );
  const validatedDefaultBillingAddress = validateDefaultAddress(
    defaultBillingAddress,
    customerAddresses,
  );

  const addressEditCommonProps = {
    showCard: hasCustomerChanged,
    loading,
    countryChoices,
    customerAddresses,
  };

  const exitModal = () => {
    onClose();
    setAddressSearchState(defaultSearchState);
  };

  return (
    <Dialog onClose={exitModal} open={open} fullWidth>
      <DialogHeader onClose={exitModal}>
        <FormattedMessage {...getDialogTitle()} />
      </DialogHeader>
      <OrderCustomerAddressesEditForm
        countryChoices={countryChoices}
        countries={countries}
        defaultShippingAddress={validatedDefaultShippingAddress}
        defaultBillingAddress={validatedDefaultBillingAddress}
        defaultCloneAddress={hasCustomerChanged}
        initial={{
          shippingAddress: orderShippingAddress,
          billingAddress: orderBillingAddress,
        }}
        onSubmit={handleContinue}
      >
        {({ change, data, handlers }) => {
          const shippingAddressEditProps = getAddressEditProps(
            "shipping",
            data,
            handlers,
            change,
            dialogErrors,
            setAddressSearchState,
            addressEditCommonProps,
          );
          const billingAddressEditProps = getAddressEditProps(
            "billing",
            data,
            handlers,
            change,
            dialogErrors,
            setAddressSearchState,
            addressEditCommonProps,
          );
          return (
            <>
              {addressSearchState.open ? (
                <OrderCustomerAddressesSearch
                  openFromCustomerChange={hasCustomerChanged}
                  type={addressSearchState?.type}
                  cloneAddress={data.cloneAddress}
                  formChange={change}
                  transitionState={confirmButtonState}
                  customerAddresses={customerAddresses}
                  selectedCustomerAddressId={
                    addressSearchState.type === AddressTypeEnum.SHIPPING
                      ? data.customerShippingAddress?.id
                      : data.customerBillingAddress?.id
                  }
                  onChangeCustomerShippingAddress={customerAddress =>
                    handlers.changeCustomerAddress(
                      customerAddress,
                      "customerShippingAddress",
                    )
                  }
                  onChangeCustomerBillingAddress={customerAddress =>
                    handlers.changeCustomerAddress(
                      customerAddress,
                      "customerBillingAddress",
                    )
                  }
                  exitSearch={() => setAddressSearchState(defaultSearchState)}
                />
              ) : (
                <>
                  <DialogContent className={classes.dialogContent}>
                    <Typography>
                      <FormattedMessage {...getDialogDescription()} />
                    </Typography>
                    <VerticalSpacer />
                    {hasCustomerChanged && (
                      <>
                        <OrderCustomerAddressEdit
                          {...shippingAddressEditProps}
                        />
                        <FormSpacer />
                        <Divider />
                        <FormSpacer />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={data.cloneAddress}
                              name="billingSameAsShipping"
                              onChange={() =>
                                change({
                                  target: {
                                    name: "cloneAddress",
                                    value: !data.cloneAddress,
                                  },
                                })
                              }
                              data-test-id="billing-same-as-shipping"
                            />
                          }
                          label={intl.formatMessage(
                            dialogMessages.billingSameAsShipping,
                          )}
                        />
                        {!data.cloneAddress && (
                          <>
                            <FormSpacer />
                            <Typography>
                              {customerAddresses.length > 0 ? (
                                <FormattedMessage
                                  {...dialogMessages.customerChangeBillingDescription}
                                />
                              ) : (
                                <FormattedMessage
                                  {...dialogMessages.noAddressBillingDescription}
                                />
                              )}
                            </Typography>
                            <FormSpacer />
                            <OrderCustomerAddressEdit
                              {...billingAddressEditProps}
                            />
                          </>
                        )}
                      </>
                    )}
                    {variant ===
                      AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS && (
                      <>
                        <OrderCustomerAddressEdit
                          {...shippingAddressEditProps}
                        />
                        {data.shippingAddressInputOption ===
                          AddressInputOptionEnum.NEW_ADDRESS && (
                          <>
                            <FormSpacer />
                            <Divider />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={data.cloneAddress}
                                  name="billingSameAsShipping"
                                  onChange={() =>
                                    change({
                                      target: {
                                        name: "cloneAddress",
                                        value: !data.cloneAddress,
                                      },
                                    })
                                  }
                                  data-test-id="billing-same-as-shipping"
                                />
                              }
                              label={intl.formatMessage(
                                dialogMessages.billingSameAsShipping,
                              )}
                            />
                          </>
                        )}
                      </>
                    )}
                    {variant ===
                      AddressEditDialogVariant.CHANGE_BILLING_ADDRESS && (
                      <>
                        <OrderCustomerAddressEdit
                          {...billingAddressEditProps}
                        />
                        {data.shippingAddressInputOption ===
                          AddressInputOptionEnum.NEW_ADDRESS && (
                          <>
                            <FormSpacer />
                            <Divider />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={data.cloneAddress}
                                  name="shippingSameAsBilling"
                                  onChange={() =>
                                    change({
                                      target: {
                                        name: "cloneAddress",
                                        value: !data.cloneAddress,
                                      },
                                    })
                                  }
                                  data-test-id="billing-same-as-shipping"
                                />
                              }
                              label={intl.formatMessage(
                                dialogMessages.shippingSameAsBilling,
                              )}
                            />
                          </>
                        )}
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <ConfirmButton
                      transitionState={confirmButtonState}
                      variant="primary"
                      type="submit"
                      data-test-id="submit"
                    >
                      <FormattedMessage
                        {...(continueToSearchAddressesState(data)
                          ? buttonMessages.continue
                          : buttonMessages.save)}
                      />
                    </ConfirmButton>
                  </DialogActions>
                </>
              )}
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
