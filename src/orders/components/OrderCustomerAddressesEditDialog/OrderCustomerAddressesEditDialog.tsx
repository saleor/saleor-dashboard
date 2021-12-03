import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Typography
} from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import FormSpacer from "@saleor/components/FormSpacer";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
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
import { transformAddressToAddressInput } from "@saleor/misc";
import { AddressInput, AddressTypeEnum } from "@saleor/types/globalTypes";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getById } from "../OrderReturnPage/utils";
import OrderCustomerAddressesEditForm, {
  AddressInputOptionEnum,
  OrderCustomerAddressesEditFormData
} from "./form";
import { dialogMessages } from "./messages";
import OrderCustomerAddressEdit from "./OrderCustomerAddressEdit";
import OrderCustomerAddressesSearch from "./OrderCustomerAddressesSearch";
import { useStyles } from "./styles";
import { validateDefaultAddress } from "./utils";

export interface OrderCustomerSearchAddressState {
  open: boolean;
  type: AddressTypeEnum;
}
export interface OrderCustomerAddressesEditDialogOutput {
  shippingAddress: AddressInput;
  billingAddress: AddressInput;
}

export interface OrderCustomerAddressesEditDialogProps {
  open: boolean;
  loading: boolean;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  countries?: ShopInfo_shop_countries[];
  customerAddresses?: CustomerAddresses_user_addresses[];
  defaultShippingAddress?: CustomerAddresses_user_defaultShippingAddress;
  defaultBillingAddress?: CustomerAddresses_user_defaultBillingAddress;
  onClose();
  onConfirm(data: OrderCustomerAddressesEditDialogOutput): SubmitPromise;
}

const defaultSearchState: OrderCustomerSearchAddressState = {
  open: false,
  type: undefined
};

const OrderCustomerAddressesEditDialog: React.FC<OrderCustomerAddressesEditDialogProps> = props => {
  const {
    open,
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
        : handleShippingSubmit(data.shippingAddress);

    if (data.billingSameAsShipping) {
      return {
        shippingAddress,
        billingAddress: shippingAddress
      };
    }

    const billingAddress =
      customerAddresses.length > 0 &&
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

  const countryChoices = mapCountriesToChoices(countries);

  const [addressSearchState, setAddressSearchState] = React.useState<
    OrderCustomerSearchAddressState
  >(defaultSearchState);

  const validatedDefaultShippingAddress = validateDefaultAddress(
    defaultShippingAddress,
    customerAddresses
  );
  const validatedDefaultBillingAddress = validateDefaultAddress(
    defaultBillingAddress,
    customerAddresses
  );

  return (
    <Dialog
      onClose={() => {
        setAddressSearchState(defaultSearchState);
        onClose();
      }}
      open={open}
      fullWidth
    >
      <OrderCustomerAddressesEditForm
        countryChoices={countryChoices}
        defaultShippingAddress={validatedDefaultShippingAddress}
        defaultBillingAddress={validatedDefaultBillingAddress}
        onSubmit={handleSubmit}
      >
        {({ change, data, handlers }) => (
          <>
            {addressSearchState.open ? (
              <OrderCustomerAddressesSearch
                type={addressSearchState?.type}
                customerAddresses={customerAddresses}
                selectedCustomerAddressId={
                  addressSearchState.type === AddressTypeEnum.SHIPPING
                    ? data.customerShippingAddress?.id
                    : data.customerBillingAddress?.id
                }
                onChangeCustomerShippingAddress={customerAddress =>
                  handlers.changeCustomerAddress(
                    customerAddress,
                    "customerShippingAddress"
                  )
                }
                onChangeCustomerBillingAddress={customerAddress =>
                  handlers.changeCustomerAddress(
                    customerAddress,
                    "customerBillingAddress"
                  )
                }
                exitSearch={() => setAddressSearchState(defaultSearchState)}
              />
            ) : (
              <>
                <DialogTitle>
                  <FormattedMessage {...dialogMessages.title} />
                </DialogTitle>
                <DialogContent className={classes.scrollableContent}>
                  <Typography>
                    {customerAddresses.length > 0 ? (
                      <FormattedMessage
                        {...dialogMessages.customerShippingAddressDescription}
                      />
                    ) : (
                      <FormattedMessage
                        {...dialogMessages.shippingAddressDescription}
                      />
                    )}
                  </Typography>
                  <FormSpacer />
                  <OrderCustomerAddressEdit
                    loading={loading}
                    countryChoices={countryChoices}
                    addressInputOption={data.shippingAddressInputOption}
                    addressInputName="shippingAddressInputOption"
                    onChangeAddressInputOption={change}
                    customerAddresses={customerAddresses}
                    selectedCustomerAddressId={data.customerShippingAddress?.id}
                    formAddress={data.shippingAddress}
                    formAddressCountryDisplayName={
                      data.shippingCountryDisplayName
                    }
                    formErrors={dialogErrors.filter(
                      error => error.addressType === AddressTypeEnum.SHIPPING
                    )}
                    onChangeFormAddress={event =>
                      handlers.changeFormAddress(event, "shippingAddress")
                    }
                    onChangeFormAddressCountry={handlers.selectShippingCountry}
                    onEdit={() =>
                      setAddressSearchState({
                        open: true,
                        type: AddressTypeEnum.SHIPPING
                      })
                    }
                  />
                  <FormSpacer />
                  <Divider />
                  <FormSpacer />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={data.billingSameAsShipping}
                        name="billingSameAsShipping"
                        onChange={() =>
                          change({
                            target: {
                              name: "billingSameAsShipping",
                              value: !data.billingSameAsShipping
                            }
                          })
                        }
                        data-test="billingSameAsShipping"
                      />
                    }
                    label={intl.formatMessage(
                      dialogMessages.billingSameAsShipping
                    )}
                  />
                  {!data.billingSameAsShipping && (
                    <>
                      <FormSpacer />
                      <Typography>
                        {customerAddresses.length > 0 ? (
                          <FormattedMessage
                            {...dialogMessages.customerBillingAddressDescription}
                          />
                        ) : (
                          <FormattedMessage
                            {...dialogMessages.billingAddressDescription}
                          />
                        )}
                      </Typography>
                      <FormSpacer />
                      <OrderCustomerAddressEdit
                        loading={loading}
                        countryChoices={countryChoices}
                        addressInputOption={data.billingAddressInputOption}
                        addressInputName="billingAddressInputOption"
                        onChangeAddressInputOption={change}
                        customerAddresses={customerAddresses}
                        selectedCustomerAddressId={
                          data.customerBillingAddress?.id
                        }
                        formAddress={data.billingAddress}
                        formAddressCountryDisplayName={
                          data.billingCountryDisplayName
                        }
                        formErrors={dialogErrors.filter(
                          error => error.addressType === AddressTypeEnum.BILLING
                        )}
                        onChangeFormAddress={event =>
                          handlers.changeFormAddress(event, "billingAddress")
                        }
                        onChangeFormAddressCountry={
                          handlers.selectBillingCountry
                        }
                        onEdit={() =>
                          setAddressSearchState({
                            open: true,
                            type: AddressTypeEnum.BILLING
                          })
                        }
                      />
                    </>
                  )}
                </DialogContent>
                <DialogActions>
                  <ConfirmButton
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    type="submit"
                    data-test="submit"
                  >
                    <FormattedMessage {...buttonMessages.save} />
                  </ConfirmButton>
                </DialogActions>
              </>
            )}
          </>
        )}
      </OrderCustomerAddressesEditForm>
    </Dialog>
  );
};

OrderCustomerAddressesEditDialog.displayName =
  "OrderCustomerAddressesEditDialog";
export default OrderCustomerAddressesEditDialog;
