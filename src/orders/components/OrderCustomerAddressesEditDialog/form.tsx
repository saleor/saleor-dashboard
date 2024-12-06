// @ts-strict-ignore
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { AddressTypeInput } from "@dashboard/customers/types";
import { AddressFragment, CountryWithCodeFragment, Node } from "@dashboard/graphql";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange,
  SubmitPromise,
} from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { Option } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import * as React from "react";

export enum AddressInputOptionEnum {
  CUSTOMER_ADDRESS = "customerAddress",
  NEW_ADDRESS = "newAddress",
}

export interface OrderCustomerAddressesEditFormData {
  cloneAddress: boolean;
  shippingAddressInputOption: AddressInputOptionEnum;
  billingAddressInputOption: AddressInputOptionEnum;
  customerShippingAddress: Node;
  customerBillingAddress: Node;
  shippingAddress: AddressTypeInput;
  billingAddress: AddressTypeInput;
}

export interface OrderCustomerAddressesEditData extends OrderCustomerAddressesEditFormData {
  shippingCountryDisplayName: string;
  billingCountryDisplayName: string;
}

export interface OrderCustomerAddressesEditHandlers {
  changeFormAddress: (
    event: React.ChangeEvent<any>,
    addressType: "shippingAddress" | "billingAddress",
  ) => void;
  changeCustomerAddress: (
    customerAddress: AddressFragment,
    addressType: "customerShippingAddress" | "customerBillingAddress",
  ) => void;
  selectShippingCountry: FormChange;
  selectBillingCountry: FormChange;
}

interface UseOrderCustomerAddressesEditFormResult
  extends CommonUseFormResultWithHandlers<
    OrderCustomerAddressesEditData,
    OrderCustomerAddressesEditHandlers
  > {
  submit: (event: React.FormEvent<any>) => SubmitPromise<any[]>;
}

interface UseOrderCustomerAddressesEditFormOpts {
  countryChoices: Option[];
  countries: CountryWithCodeFragment[];
  defaultShippingAddress: Node;
  defaultBillingAddress: Node;
  defaultCloneAddress: boolean;
}

export interface OrderCustomerAddressesEditFormProps extends UseOrderCustomerAddressesEditFormOpts {
  children: (props: UseOrderCustomerAddressesEditFormResult) => React.ReactNode;
  initial?: Partial<OrderCustomerAddressesEditFormData>;
  onSubmit: (data: OrderCustomerAddressesEditData) => void;
}

function useOrderCustomerAddressesEditForm(
  providedInitialFormData: Partial<OrderCustomerAddressesEditFormData>,
  onSubmit: (data: OrderCustomerAddressesEditData) => void,
  opts: UseOrderCustomerAddressesEditFormOpts,
): UseOrderCustomerAddressesEditFormResult {
  const emptyAddress: AddressTypeInput = {
    city: "",
    country: "",
    phone: "",
    postalCode: "",
    streetAddress1: "",
  };
  const defaultInitialFormData: OrderCustomerAddressesEditFormData = {
    cloneAddress: opts.defaultCloneAddress,
    shippingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
    billingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
    customerShippingAddress: opts.defaultShippingAddress,
    customerBillingAddress: opts.defaultBillingAddress,
    shippingAddress: emptyAddress,
    billingAddress: emptyAddress,
  };
  const initialData = {
    ...defaultInitialFormData,
    ...providedInitialFormData,
  };
  const { handleChange, change, data: formData } = useForm(initialData);
  const { setExitDialogSubmitRef } = useExitFormDialog();
  const [shippingCountryDisplayName, setShippingCountryDisplayName] = useState(
    opts.countries.find(country => initialData.shippingAddress.country === country.code)?.country,
  );
  const [billingCountryDisplayName, setBillingCountryDisplayName] = useState(
    opts.countries.find(country => initialData.billingAddress.country === country.code)?.country,
  );
  const handleFormAddressChange = (
    event: React.ChangeEvent<any>,
    addressType: "shippingAddress" | "billingAddress",
  ) =>
    change({
      target: {
        name: addressType,
        value: {
          ...formData[addressType],
          [event.target.name]: event.target.value,
        },
      },
    });
  const handleCustomerAddressChange = (
    customerAddress: AddressFragment,
    addressType: "customerShippingAddress" | "customerBillingAddress",
  ) =>
    change({
      target: {
        name: addressType,
        value: customerAddress,
      },
    });
  const handleShippingCountrySelect = createSingleAutocompleteSelectHandler(
    event =>
      change({
        target: {
          name: "shippingAddress",
          value: {
            ...formData.shippingAddress,
            [event.target.name]: event.target.value,
            countryArea: "",
          },
        },
      }),
    setShippingCountryDisplayName,
    opts.countryChoices,
  );
  const handleBillingCountrySelect = createSingleAutocompleteSelectHandler(
    event =>
      change({
        target: {
          name: "billingAddress",
          value: {
            ...formData.billingAddress,
            [event.target.name]: event.target.value,
            countryArea: "",
          },
        },
      }),
    setBillingCountryDisplayName,
    opts.countryChoices,
  );
  const data = {
    ...formData,
    shippingCountryDisplayName,
    billingCountryDisplayName,
  };
  const handleFormSubmit = useHandleFormSubmit({
    onSubmit,
  });
  const handleSubmit = () => handleFormSubmit(data);
  const submit = (event: React.FormEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();

    return handleSubmit();
  };

  useEffect(() => setExitDialogSubmitRef(submit), [handleSubmit]);

  return {
    change: handleChange,
    submit,
    data,
    handlers: {
      changeCustomerAddress: handleCustomerAddressChange,
      changeFormAddress: handleFormAddressChange,
      selectShippingCountry: handleShippingCountrySelect,
      selectBillingCountry: handleBillingCountrySelect,
    },
  };
}

const OrderCustomerAddressesEditForm = ({
  children,
  initial,
  onSubmit,
  ...rest
}: OrderCustomerAddressesEditFormProps) => {
  const props = useOrderCustomerAddressesEditForm(initial || {}, onSubmit, rest);

  return (
    <form onSubmit={props.submit} autoComplete="off">
      {children(props)}
    </form>
  );
};

OrderCustomerAddressesEditForm.displayName = "OrderCustomerAddressesEditForm";
export default OrderCustomerAddressesEditForm;
