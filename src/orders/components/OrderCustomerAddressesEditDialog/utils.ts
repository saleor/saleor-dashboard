import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import {
  AccountErrorFragment,
  AddressFragment,
  AddressInput,
  AddressTypeEnum,
  Node,
  OrderErrorFragment,
} from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { flatten } from "@saleor/misc";

import { getById } from "../OrderReturnPage/utils";
import {
  OrderCustomerAddressesEditData,
  OrderCustomerAddressesEditHandlers,
} from "./form";
import { OrderCustomerAddressEditProps } from "./OrderCustomerAddressEdit";
import { OrderCustomerSearchAddressState } from "./types";

interface AddressEditCommonProps {
  showCard: boolean;
  loading: boolean;
  countryChoices: SingleAutocompleteChoiceType[];
  customerAddresses: AddressFragment[];
}

export const stringifyAddress = (address: Partial<AddressFragment>): string => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...addressWithoutId } = address;
  return Object.values(flatten(addressWithoutId)).join(" ");
};

export const parseQuery = (query: string) =>
  query.replace(/([.?*+\-=:^$\\[\]<>(){}|])/g, "\\$&");

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

const filterAddressErrors = (
  dialogErrors: Array<OrderErrorFragment | AccountErrorFragment>,
  addressType: AddressTypeEnum,
) => dialogErrors.filter(error => error.addressType === addressType);

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
  setAddressSearchState: React.Dispatch<
    React.SetStateAction<OrderCustomerSearchAddressState>
  >,
  addressEditCommonProps: AddressEditCommonProps,
): OrderCustomerAddressEditProps => {
  if (variant === "shipping") {
    return {
      ...addressEditCommonProps,
      addressInputName: "shippingAddressInputOption",
      formErrors: filterAddressErrors(dialogErrors, AddressTypeEnum.SHIPPING),
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
      onChangeFormAddress: event =>
        handlers.changeFormAddress(event, "shippingAddress"),
      onChangeFormAddressCountry: handlers.selectShippingCountry,
    };
  }
  return {
    ...addressEditCommonProps,
    addressInputName: "billingAddressInputOption",
    formErrors: filterAddressErrors(dialogErrors, AddressTypeEnum.BILLING),
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
    onChangeFormAddress: event =>
      handlers.changeFormAddress(event, "billingAddress"),
    onChangeFormAddressCountry: handlers.selectBillingCountry,
  };
};
