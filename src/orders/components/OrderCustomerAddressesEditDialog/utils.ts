import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  AccountErrorFragmentFragment,
  AddressFragmentFragment,
  Node,
  OrderErrorFragmentFragment
} from "@saleor/graphql";
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
  customerAddresses: AddressFragmentFragment[];
}

export const stringifyAddress = (
  address: Partial<AddressFragmentFragment>
): string => {
  const { id, ...addressWithoutId } = address;
  return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) =>
  query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

export function validateDefaultAddress<T extends AddressFragmentFragment>(
  defaultAddress: Node,
  customerAddresses: T[]
): Node {
  const fallbackAddress = {
    id: customerAddresses[0]?.id
  } as AddressFragmentFragment;
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
  dialogErrors: Array<
    OrderErrorFragmentFragment | AccountErrorFragmentFragment
  >,
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
