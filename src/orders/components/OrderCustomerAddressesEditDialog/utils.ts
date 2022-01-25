import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  CustomerAddresses_user_addresses,
  CustomerAddresses_user_defaultShippingAddress
} from "@saleor/customers/types/CustomerAddresses";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormChange } from "@saleor/hooks/useForm";
import { flatten } from "@saleor/misc";
import { AddressTypeEnum } from "@saleor/types/globalTypes";

import { getById } from "../OrderReturnPage/utils";
import {
  OrderCustomerAddressesEditData,
  OrderCustomerAddressesEditHandlers
} from "./form";
import { OrderCustomerAddressEditProps } from "./OrderCustomerAddressEdit";
import { OrderCustomerSearchAddressState } from "./types";

interface AddressEditCommonProps {
  showCard: boolean;
  loading: boolean;
  countryChoices: SingleAutocompleteChoiceType[];
  customerAddresses: CustomerAddresses_user_addresses[];
}

export const stringifyAddress = (
  address: Partial<CustomerAddresses_user_addresses>
): string => {
  const { id, ...addressWithoutId } = address;
  return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) =>
  query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

export function validateDefaultAddress<
  T extends CustomerAddresses_user_defaultShippingAddress
>(
  defaultAddress: CustomerAddresses_user_defaultShippingAddress,
  customerAddresses: T[]
): CustomerAddresses_user_defaultShippingAddress {
  const fallbackAddress = {
    id: customerAddresses[0]?.id
  } as CustomerAddresses_user_defaultShippingAddress;
  if (!defaultAddress) {
    return fallbackAddress;
  }
  if (!customerAddresses.some(getById(defaultAddress.id))) {
    return fallbackAddress;
  }
  return defaultAddress;
}

export const getAddressEditProps = (
  variant: "shipping" | "billing",
  data: OrderCustomerAddressesEditData,
  handlers: OrderCustomerAddressesEditHandlers,
  change: FormChange,
  dialogErrors: Array<OrderErrorFragment | AccountErrorFragment>,
  setAddressSearchState: React.Dispatch<
    React.SetStateAction<OrderCustomerSearchAddressState>
  >,
  addressEditCommonProps: AddressEditCommonProps
): OrderCustomerAddressEditProps => {
  if (variant === "shipping") {
    return {
      ...addressEditCommonProps,
      addressInputName: "shippingAddressInputOption",
      formErrors: dialogErrors.filter(
        error => error.addressType === AddressTypeEnum.SHIPPING
      ),
      onEdit: () =>
        setAddressSearchState({
          open: true,
          type: AddressTypeEnum.SHIPPING
        }),
      onChangeAddressInputOption: change,
      addressInputOption: data.shippingAddressInputOption,
      selectedCustomerAddressId: data.customerShippingAddress?.id,
      formAddress: data.shippingAddress,
      formAddressCountryDisplayName: data.shippingCountryDisplayName,
      onChangeFormAddress: event =>
        handlers.changeFormAddress(event, "shippingAddress"),
      onChangeFormAddressCountry: handlers.selectShippingCountry
    };
  }
  return {
    ...addressEditCommonProps,
    addressInputName: "billingAddressInputOption",
    formErrors: dialogErrors.filter(
      error => error.addressType === AddressTypeEnum.BILLING
    ),
    onEdit: () =>
      setAddressSearchState({
        open: true,
        type: AddressTypeEnum.BILLING
      }),
    onChangeAddressInputOption: change,
    addressInputOption: data.billingAddressInputOption,
    selectedCustomerAddressId: data.customerBillingAddress?.id,
    formAddress: data.billingAddress,
    formAddressCountryDisplayName: data.billingCountryDisplayName,
    onChangeFormAddress: event =>
      handlers.changeFormAddress(event, "billingAddress"),
    onChangeFormAddressCountry: handlers.selectBillingCountry
  };
};
