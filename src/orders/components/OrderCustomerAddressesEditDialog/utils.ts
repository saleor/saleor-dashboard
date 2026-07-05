import {
  type AccountErrorFragment,
  type AddressFragment,
  type AddressInput,
  AddressTypeEnum,
  type Node,
  type OrderErrorFragment,
} from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { flatten, getById } from "@dashboard/misc";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import commonErrorMessages from "@dashboard/utils/errors/common";
import getOrderErrorMessage from "@dashboard/utils/errors/order";
import { type Option } from "@saleor/macaw-ui-next";
import { type IntlShape } from "react-intl";

import {
  type OrderCustomerAddressesEditData,
  type OrderCustomerAddressesEditHandlers,
} from "./form";
import { dialogMessages } from "./messages";
import { type OrderCustomerAddressEditProps } from "./OrderCustomerAddressEdit";
import { AddressEditDialogVariant, type OrderCustomerSearchAddressState } from "./types";

interface AddressEditCommonProps {
  showCard: boolean;
  loading: boolean;
  countryChoices: Option[];
  customerAddresses: AddressFragment[];
}

export const stringifyAddress = (address: Partial<AddressFragment>): string => {
  const { ...addressWithoutId } = address;

  return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) => query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

export function validateDefaultAddress<T extends AddressFragment>(
  defaultAddress: Node,
  customerAddresses: T[],
): Node {
  const fallbackAddress = {
    id: customerAddresses[0]?.id,
  } as AddressFragment;

  if (!defaultAddress) {
    return fallbackAddress;
  }

  if (!customerAddresses.some(getById(defaultAddress.id))) {
    return fallbackAddress;
  }

  return defaultAddress;
}

export const ADDRESS_FORM_FIELDS = [
  "city",
  "cityArea",
  "country",
  "countryArea",
  "firstName",
  "lastName",
  "companyName",
  "phone",
  "postalCode",
  "streetAddress1",
  "streetAddress2",
] as const;

type DialogError = OrderErrorFragment | AccountErrorFragment;

const isAddressFormField = (field: string | null): boolean =>
  field != null && (ADDRESS_FORM_FIELDS as readonly string[]).includes(field);

const shouldIncludeUntypedAddressErrors = (
  dialogVariant: AddressEditDialogVariant,
  addressVariant: "shipping" | "billing",
): boolean => {
  if (dialogVariant === AddressEditDialogVariant.CHANGE_SHIPPING_ADDRESS) {
    return addressVariant === "shipping";
  }

  if (dialogVariant === AddressEditDialogVariant.CHANGE_BILLING_ADDRESS) {
    return addressVariant === "billing";
  }

  return false;
};

export const getAddressSectionErrors = (
  dialogErrors: DialogError[],
  addressType: AddressTypeEnum,
  dialogVariant: AddressEditDialogVariant,
  addressVariant: "shipping" | "billing",
): DialogError[] =>
  dialogErrors.filter(error => {
    if (error.addressType === addressType) {
      return true;
    }

    if (error.addressType != null) {
      return false;
    }

    if (!isAddressFormField(error.field)) {
      return false;
    }

    return shouldIncludeUntypedAddressErrors(dialogVariant, addressVariant);
  });

export const getOrderLevelErrors = (dialogErrors: DialogError[]): DialogError[] =>
  dialogErrors.filter(error => {
    if (
      error.addressType === AddressTypeEnum.SHIPPING ||
      error.addressType === AddressTypeEnum.BILLING
    ) {
      return false;
    }

    if (isAddressFormField(error.field)) {
      return false;
    }

    return true;
  });

const getOrderLevelErrorDetails = (error: DialogError, intl: IntlShape): string => {
  if (error.field === "origin") {
    return intl.formatMessage(dialogMessages.orderOriginErrorDetails);
  }

  if (error.message) {
    return error.message;
  }

  if (error.__typename === "AccountError") {
    return (
      getAccountErrorMessage(error, intl) ?? intl.formatMessage(commonErrorMessages.unknownError)
    );
  }

  return getOrderErrorMessage(error, intl) ?? intl.formatMessage(commonErrorMessages.unknownError);
};

export const getOrderLevelErrorMessage = (error: DialogError, intl: IntlShape): string => {
  const details = getOrderLevelErrorDetails(error, intl);

  if (error.field) {
    return intl.formatMessage(dialogMessages.orderLevelFieldError, {
      field: `\`${error.field}\``,
      details,
    });
  }

  return intl.formatMessage(dialogMessages.orderLevelError, {
    details,
  });
};

interface ShippingAddresses {
  shippingAddress: AccountErrorFragment[] | AddressInput;
  billingAddress: AccountErrorFragment[] | AddressInput;
}

export const hasPreSubmitErrors = (input: ShippingAddresses) =>
  Object.values(input)
    .flat()
    .some(el => "code" in el);

export const getAddressEditProps = (
  variant: "shipping" | "billing",
  data: OrderCustomerAddressesEditData,
  handlers: OrderCustomerAddressesEditHandlers,
  change: FormChange,
  dialogErrors: Array<OrderErrorFragment | AccountErrorFragment>,
  setAddressSearchState: React.Dispatch<React.SetStateAction<OrderCustomerSearchAddressState>>,
  addressEditCommonProps: AddressEditCommonProps,
  dialogVariant: AddressEditDialogVariant,
): OrderCustomerAddressEditProps => {
  if (variant === "shipping") {
    return {
      ...addressEditCommonProps,
      addressInputName: "shippingAddressInputOption",
      formErrors: getAddressSectionErrors(
        dialogErrors,
        AddressTypeEnum.SHIPPING,
        dialogVariant,
        variant,
      ),
      onEdit: () =>
        setAddressSearchState({
          open: true,
          type: AddressTypeEnum.SHIPPING,
        }),
      onChangeAddressInputOption: change,
      addressInputOption: data.shippingAddressInputOption,
      selectedCustomerAddressId: data.customerShippingAddress?.id,
      formAddress: data.shippingAddress,
      formAddressCountryDisplayName: data.shippingCountryDisplayName,
      onChangeFormAddress: event => handlers.changeFormAddress(event, "shippingAddress"),
      onChangeFormAddressCountry: handlers.selectShippingCountry,
    };
  }

  return {
    ...addressEditCommonProps,
    addressInputName: "billingAddressInputOption",
    formErrors: getAddressSectionErrors(
      dialogErrors,
      AddressTypeEnum.BILLING,
      dialogVariant,
      variant,
    ),
    onEdit: () =>
      setAddressSearchState({
        open: true,
        type: AddressTypeEnum.BILLING,
      }),
    onChangeAddressInputOption: change,
    addressInputOption: data.billingAddressInputOption,
    selectedCustomerAddressId: data.customerBillingAddress?.id,
    formAddress: data.billingAddress,
    formAddressCountryDisplayName: data.billingCountryDisplayName,
    onChangeFormAddress: event => handlers.changeFormAddress(event, "billingAddress"),
    onChangeFormAddressCountry: handlers.selectBillingCountry,
  };
};
