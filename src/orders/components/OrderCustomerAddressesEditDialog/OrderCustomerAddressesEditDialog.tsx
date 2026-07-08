// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type AddressTypeInput } from "@dashboard/customers/types";
import {
  type AccountErrorFragment,
  type AddressFragment,
  type AddressInput,
  AddressTypeEnum,
  type CountryWithCodeFragment,
  type Node,
  type OrderErrorFragment,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import { buttonMessages } from "@dashboard/intl";
import { getById, transformAddressToAddressInput } from "@dashboard/misc";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { FormControlLabel } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useState } from "react";
import { FormattedMessage, type MessageDescriptor, useIntl } from "react-intl";

import { AddressEditDialogErrorCallout } from "./AddressEditDialogErrorCallout";
import OrderCustomerAddressesEditForm, {
  AddressInputOptionEnum,
  type OrderCustomerAddressesEditFormData,
  useOrderCustomerAddressesEditFormContext,
} from "./form";
import { dialogMessages } from "./messages";
import OrderCustomerAddressEdit from "./OrderCustomerAddressEdit";
import {
  AddressSearchActionsButtons,
  AddressSearchFooter,
  AddressSearchList,
  AddressSearchToolbar,
  OrderCustomerAddressesSearchProvider,
} from "./OrderCustomerAddressesSearch";
import {
  AddressEditDialogVariant,
  type OrderCustomerAddressesEditDialogOutput,
  type OrderCustomerSearchAddressState,
} from "./types";
import {
  findMatchingCustomerAddress,
  getAddressEditProps,
  getOrderLevelErrors,
  getPreSubmitErrors,
  hasPreSubmitErrors,
  resolveInitialCustomerAddress,
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
  onClose: () => any;
  onConfirm: (data: Partial<OrderCustomerAddressesEditDialogOutput>) => SubmitPromise<any[]>;
}

const defaultSearchState: OrderCustomerSearchAddressState = {
  open: false,
  type: undefined,
};

interface OrderCustomerAddressesEditDialogFieldsProps {
  addressEditCommonProps: {
    showCard: boolean;
    loading: boolean;
    countryChoices: ReturnType<typeof mapCountriesToChoices>;
    customerAddresses: AddressFragment[];
  };
  customerAddresses: AddressFragment[];
  dialogErrors: Array<OrderErrorFragment | AccountErrorFragment>;
  hasCustomerChanged: boolean;
  setAddressSearchState: React.Dispatch<React.SetStateAction<OrderCustomerSearchAddressState>>;
  variant: AddressEditDialogVariant;
}

const OrderCustomerAddressesEditDialogFields = ({
  addressEditCommonProps,
  customerAddresses,
  dialogErrors,
  hasCustomerChanged,
  setAddressSearchState,
  variant,
}: OrderCustomerAddressesEditDialogFieldsProps) => {
  const intl = useIntl();
  const { change, data, handlers } = useOrderCustomerAddressesEditFormContext();
  const shippingAddressEditProps = getAddressEditProps(
    "shipping",
    data,
    handlers,
    change,
    dialogErrors,
    setAddressSearchState,
    addressEditCommonProps,
    variant,
  );
  const billingAddressEditProps = getAddressEditProps(
    "billing",
    data,
    handlers,
    change,
    dialogErrors,
    setAddressSearchState,
    addressEditCommonProps,
    variant,
  );

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {hasCustomerChanged && (
        <>
          <OrderCustomerAddressEdit {...shippingAddressEditProps} />
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
            label={intl.formatMessage(dialogMessages.billingSameAsShipping)}
          />
          {!data.cloneAddress && (
            <>
              <Text size={2} color="default2">
                <FormattedMessage
                  {...(customerAddresses.length > 0
                    ? dialogMessages.customerChangeBillingDescription
                    : dialogMessages.noAddressBillingDescription)}
                />
              </Text>
              <OrderCustomerAddressEdit {...billingAddressEditProps} />
            </>
          )}
        </>
      )}

      {variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS && (
        <>
          <OrderCustomerAddressEdit {...shippingAddressEditProps} />
          {data.shippingAddressInputOption === AddressInputOptionEnum.NEW_ADDRESS && (
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
              label={intl.formatMessage(dialogMessages.billingSameAsShipping)}
            />
          )}
        </>
      )}

      {variant === AddressEditDialogVariant.CHANGE_BILLING_ADDRESS && (
        <>
          <OrderCustomerAddressEdit {...billingAddressEditProps} />
          {data.billingAddressInputOption === AddressInputOptionEnum.NEW_ADDRESS && (
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
              label={intl.formatMessage(dialogMessages.shippingSameAsBilling)}
            />
          )}
        </>
      )}
    </Box>
  );
};

interface OrderCustomerAddressesEditDialogSubmitButtonProps {
  confirmButtonState: ConfirmButtonTransitionState;
  continueToSearchAddressesState: (data: OrderCustomerAddressesEditFormData) => boolean;
}

const OrderCustomerAddressesEditDialogSubmitButton = ({
  confirmButtonState,
  continueToSearchAddressesState,
}: OrderCustomerAddressesEditDialogSubmitButtonProps) => {
  const { data, submit } = useOrderCustomerAddressesEditFormContext();

  return (
    <ConfirmButton
      transitionState={confirmButtonState}
      variant="primary"
      onClick={submit}
      data-test-id="submit"
    >
      <FormattedMessage
        {...(continueToSearchAddressesState(data) ? buttonMessages.continue : buttonMessages.save)}
      />
    </ConfirmButton>
  );
};

interface OrderCustomerAddressesEditDialogSearchProps {
  children: ReactNode;
  confirmButtonState: ConfirmButtonTransitionState;
  customerAddresses: AddressFragment[];
  hasCustomerChanged: boolean;
  setAddressSearchState: React.Dispatch<React.SetStateAction<OrderCustomerSearchAddressState>>;
  type: AddressTypeEnum;
}

const OrderCustomerAddressesEditDialogSearch = ({
  children,
  confirmButtonState,
  customerAddresses,
  hasCustomerChanged,
  setAddressSearchState,
  type,
}: OrderCustomerAddressesEditDialogSearchProps) => {
  const { change, data, handlers } = useOrderCustomerAddressesEditFormContext();

  return (
    <OrderCustomerAddressesSearchProvider
      openFromCustomerChange={hasCustomerChanged}
      type={type}
      cloneAddress={data.cloneAddress}
      formChange={change}
      transitionState={confirmButtonState}
      customerAddresses={customerAddresses}
      selectedCustomerAddressId={
        type === AddressTypeEnum.SHIPPING
          ? data.customerShippingAddress?.id
          : data.customerBillingAddress?.id
      }
      onChangeCustomerShippingAddress={customerAddress =>
        handlers.changeCustomerAddress(customerAddress, "customerShippingAddress")
      }
      onChangeCustomerBillingAddress={customerAddress =>
        handlers.changeCustomerAddress(customerAddress, "customerBillingAddress")
      }
      exitSearch={() => setAddressSearchState(defaultSearchState)}
    >
      {children}
    </OrderCustomerAddressesSearchProvider>
  );
};

const OrderCustomerAddressesEditDialog = (props: OrderCustomerAddressesEditDialogProps) => {
  const {
    open: defaultOpen,
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
  const open = !loading && defaultOpen;
  const hasCustomerChanged = variant === AddressEditDialogVariant.CHANGE_CUSTOMER;
  const { errors: shippingValidationErrors, submit: handleShippingSubmit } = useAddressValidation(
    address => address,
    AddressTypeEnum.SHIPPING,
  );
  const { errors: billingValidationErrors, submit: handleBillingSubmit } = useAddressValidation(
    address => address,
    AddressTypeEnum.BILLING,
  );
  const dialogErrors = useModalDialogErrors(
    [...errors, ...shippingValidationErrors, ...billingValidationErrors],
    open,
  );
  const [addressSearchState, setAddressSearchState] =
    useState<OrderCustomerSearchAddressState>(defaultSearchState);
  const continueToSearchAddressesState = (data: OrderCustomerAddressesEditFormData): boolean => {
    if (hasCustomerChanged || addressSearchState.open) {
      return false;
    }

    if (!customerAddresses.length) {
      return false;
    }

    if (variant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS) {
      return data.shippingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS;
    }

    return data.billingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS;
  };
  const getCustomerAddress = (selectedCustomerAddressID: string): AddressInput =>
    transformAddressToAddressInput(customerAddresses.find(getById(selectedCustomerAddressID)));
  const handleAddressesSubmit = async (data: OrderCustomerAddressesEditFormData) => {
    const shippingAddress =
      customerAddresses.length > 0 &&
      data.shippingAddressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS
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
  const getDialogSubtitle = (): MessageDescriptor => getDialogDescription();
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

    return handleSubmit(data);
  };
  const handleSubmit = async (data: OrderCustomerAddressesEditFormData) => {
    const addressesInput = await handleAddressesSubmit(data);

    if (addressesInput && !hasPreSubmitErrors(addressesInput)) {
      await onConfirm(addressesInput as OrderCustomerAddressesEditDialogOutput);
      setAddressSearchState(defaultSearchState);

      return [];
    }

    return addressesInput ? getPreSubmitErrors(addressesInput) : [];
  };
  const countryChoices = mapCountriesToChoices(countries);
  const validatedDefaultShippingAddress = validateDefaultAddress(
    defaultShippingAddress,
    customerAddresses,
  );
  const validatedDefaultBillingAddress = validateDefaultAddress(
    defaultBillingAddress,
    customerAddresses,
  );
  const matchingShippingCustomerAddress = findMatchingCustomerAddress(
    orderShippingAddress,
    customerAddresses,
  );
  const matchingBillingCustomerAddress = findMatchingCustomerAddress(
    orderBillingAddress,
    customerAddresses,
  );
  const initialFormData: Partial<OrderCustomerAddressesEditFormData> = {
    shippingAddress: orderShippingAddress,
    billingAddress: orderBillingAddress,
    customerShippingAddress: resolveInitialCustomerAddress(
      orderShippingAddress,
      customerAddresses,
      validatedDefaultShippingAddress,
    ),
    customerBillingAddress: resolveInitialCustomerAddress(
      orderBillingAddress,
      customerAddresses,
      validatedDefaultBillingAddress,
    ),
  };

  if (customerAddresses.length > 0) {
    initialFormData.shippingAddressInputOption = matchingShippingCustomerAddress
      ? AddressInputOptionEnum.CUSTOMER_ADDRESS
      : AddressInputOptionEnum.NEW_ADDRESS;
    initialFormData.billingAddressInputOption = matchingBillingCustomerAddress
      ? AddressInputOptionEnum.CUSTOMER_ADDRESS
      : AddressInputOptionEnum.NEW_ADDRESS;
  }

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
  const intl = useIntl();
  const orderLevelErrors = getOrderLevelErrors(dialogErrors);

  const modalContent = (
    <DashboardModal.Content size="sm">
      {addressSearchState.open ? (
        <>
          <DashboardModal.PickerHeader
            description={<FormattedMessage {...dialogMessages.searchInfo} />}
            toolbar={<AddressSearchToolbar />}
          >
            <FormattedMessage {...getDialogTitle()} />
          </DashboardModal.PickerHeader>

          {orderLevelErrors.length > 0 && (
            <Box __flexShrink={0}>
              <DashboardModal.Inset paddingY={4}>
                <AddressEditDialogErrorCallout errors={orderLevelErrors} />
              </DashboardModal.Inset>
            </Box>
          )}

          <DashboardModal.Body fill __overflowX="hidden">
            <DashboardModal.Inset>
              <AddressSearchList />
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <AddressSearchFooter />

          <DashboardModal.Actions>
            <AddressSearchActionsButtons />
          </DashboardModal.Actions>
        </>
      ) : (
        <>
          <DashboardModal.Header subtitle={intl.formatMessage(getDialogSubtitle())}>
            <FormattedMessage {...getDialogTitle()} />
          </DashboardModal.Header>

          <DashboardModal.Body>
            <DashboardModal.Inset>
              <Box display="flex" flexDirection="column" gap={4}>
                {orderLevelErrors.length > 0 && (
                  <AddressEditDialogErrorCallout errors={orderLevelErrors} />
                )}
                <OrderCustomerAddressesEditForm.Form>
                  <OrderCustomerAddressesEditDialogFields
                    addressEditCommonProps={addressEditCommonProps}
                    customerAddresses={customerAddresses}
                    dialogErrors={dialogErrors}
                    hasCustomerChanged={hasCustomerChanged}
                    setAddressSearchState={setAddressSearchState}
                    variant={variant}
                  />
                </OrderCustomerAddressesEditForm.Form>
              </Box>
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <OrderCustomerAddressesEditDialogSubmitButton
              confirmButtonState={confirmButtonState}
              continueToSearchAddressesState={continueToSearchAddressesState}
            />
          </DashboardModal.Actions>
        </>
      )}
    </DashboardModal.Content>
  );

  return (
    <OrderCustomerAddressesEditForm
      countryChoices={countryChoices}
      countries={countries}
      defaultShippingAddress={validatedDefaultShippingAddress}
      defaultBillingAddress={validatedDefaultBillingAddress}
      defaultCloneAddress={hasCustomerChanged}
      initial={initialFormData}
      onSubmit={handleContinue}
    >
      <DashboardModal onChange={exitModal} open={open}>
        {addressSearchState.open ? (
          <OrderCustomerAddressesEditDialogSearch
            confirmButtonState={confirmButtonState}
            customerAddresses={customerAddresses}
            hasCustomerChanged={hasCustomerChanged}
            setAddressSearchState={setAddressSearchState}
            type={addressSearchState.type}
          >
            {modalContent}
          </OrderCustomerAddressesEditDialogSearch>
        ) : (
          modalContent
        )}
      </DashboardModal>
    </OrderCustomerAddressesEditForm>
  );
};

OrderCustomerAddressesEditDialog.displayName = "OrderCustomerAddressesEditDialog";
export default OrderCustomerAddressesEditDialog;
