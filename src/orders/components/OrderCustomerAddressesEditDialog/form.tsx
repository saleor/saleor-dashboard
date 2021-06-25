import { ExitFormDialogContext } from "@saleor/components/Form/ExitFormDialogProvider";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { AddressTypeInput } from "@saleor/customers/types";
import {
  CustomerAddresses_user_addresses,
  CustomerAddresses_user_defaultBillingAddress,
  CustomerAddresses_user_defaultShippingAddress
} from "@saleor/customers/types/CustomerAddresses";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange
} from "@saleor/hooks/useForm";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React, { useContext, useEffect, useState } from "react";

export enum AddressInputOptionEnum {
  CUSTOMER_ADDRESS = "customerAddress",
  NEW_ADDRESS = "newAddress"
}

export interface OrderCustomerAddressesEditFormData {
  billingSameAsShipping: boolean;
  shippingAddressInputOption: AddressInputOptionEnum;
  billingAddressInputOption: AddressInputOptionEnum;
  customerShippingAddress: CustomerAddresses_user_defaultShippingAddress;
  customerBillingAddress: CustomerAddresses_user_defaultBillingAddress;
  shippingAddress: AddressTypeInput;
  billingAddress: AddressTypeInput;
}

export interface OrderCustomerAddressesEditData
  extends OrderCustomerAddressesEditFormData {
  shippingCountryDisplayName: string;
  billingCountryDisplayName: string;
}

export interface OrderCustomerAddressesEditHandlers {
  changeFormAddress: (
    event: React.ChangeEvent<any>,
    addressType: "shippingAddress" | "billingAddress"
  ) => void;
  changeCustomerAddress: (
    customerAddress: CustomerAddresses_user_addresses,
    addressType: "customerShippingAddress" | "customerBillingAddress"
  ) => void;
  selectShippingCountry: FormChange;
  selectBillingCountry: FormChange;
}

interface UseOrderCustomerAddressesEditFormResult
  extends CommonUseFormResultWithHandlers<
    OrderCustomerAddressesEditData,
    OrderCustomerAddressesEditHandlers
  > {
  onSubmit: (event: React.FormEvent<any>) => Promise<boolean>;
}

interface UseOrderCustomerAddressesEditFormOpts {
  countryChoices: SingleAutocompleteChoiceType[];
  defaultShippingAddress: CustomerAddresses_user_defaultShippingAddress;
  defaultBillingAddress: CustomerAddresses_user_defaultBillingAddress;
}

export interface OrderCustomerAddressesEditFormProps
  extends UseOrderCustomerAddressesEditFormOpts {
  children: (props: UseOrderCustomerAddressesEditFormResult) => React.ReactNode;
  initial?: Partial<OrderCustomerAddressesEditFormData>;
  onSubmit: (data: OrderCustomerAddressesEditData) => Promise<boolean>;
}

const initialAddress: AddressTypeInput = {
  city: "",
  country: "",
  phone: "",
  postalCode: "",
  streetAddress1: ""
};

const getDefaultInitialFormData = (
  opts: UseOrderCustomerAddressesEditFormOpts
): OrderCustomerAddressesEditFormData => ({
  billingSameAsShipping: true,
  shippingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
  billingAddressInputOption: AddressInputOptionEnum.CUSTOMER_ADDRESS,
  customerShippingAddress: opts.defaultShippingAddress,
  customerBillingAddress: opts.defaultBillingAddress,
  shippingAddress: initialAddress,
  billingAddress: initialAddress
});

function useOrderCustomerAddressesEditForm(
  initial: Partial<OrderCustomerAddressesEditFormData>,
  onSubmit: (data: OrderCustomerAddressesEditData) => void,
  opts: UseOrderCustomerAddressesEditFormOpts
): UseOrderCustomerAddressesEditFormResult {
  const {
    handleChange,
    hasChanged,
    change,
    data: formData,
    setChanged
  } = useForm({
    ...initial,
    ...getDefaultInitialFormData(opts)
  });

  const { setExitDialogSubmitRef, setEnableExitDialog } = useContext(
    ExitFormDialogContext
  );

  const [shippingCountryDisplayName, setShippingCountryDisplayName] = useState(
    ""
  );
  const [billingCountryDisplayName, setBillingCountryDisplayName] = useState(
    ""
  );

  const handleFormAddressChange = (
    event: React.ChangeEvent<any>,
    addressType: "shippingAddress" | "billingAddress"
  ) =>
    change({
      target: {
        name: addressType,
        value: {
          ...formData[addressType],
          [event.target.name]: event.target.value
        }
      }
    });
  const handleCustomerAddressChange = (
    customerAddress: CustomerAddresses_user_addresses,
    addressType: "customerShippingAddress" | "customerBillingAddress"
  ) =>
    change({
      target: {
        name: addressType,
        value: customerAddress
      }
    });
  const handleShippingCountrySelect = createSingleAutocompleteSelectHandler(
    event =>
      change({
        target: {
          name: "shippingAddress",
          value: {
            ...formData.shippingAddress,
            [event.target.name]: event.target.value
          }
        }
      }),
    setShippingCountryDisplayName,
    opts.countryChoices
  );
  const handleBillingCountrySelect = createSingleAutocompleteSelectHandler(
    event =>
      change({
        target: {
          name: "billingAddress",
          value: {
            ...formData.billingAddress,
            [event.target.name]: event.target.value
          }
        }
      }),
    setBillingCountryDisplayName,
    opts.countryChoices
  );

  const data = {
    ...formData,
    shippingCountryDisplayName,
    billingCountryDisplayName
  };

  const handleSubmit = () =>
    handleFormSubmit(data, onSubmit, setChanged, setEnableExitDialog);

  const submit = (event: React.FormEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();
    return handleSubmit();
  };

  useEffect(() => setExitDialogSubmitRef(submit as () => Promise<boolean>), [
    handleSubmit
  ]);

  return {
    change: handleChange,
    submit,
    hasChanged,
    data,
    handlers: {
      changeCustomerAddress: handleCustomerAddressChange,
      changeFormAddress: handleFormAddressChange,
      selectShippingCountry: handleShippingCountrySelect,
      selectBillingCountry: handleBillingCountrySelect
    }
  };
}

const OrderCustomerAddressesEditForm: React.FC<OrderCustomerAddressesEditFormProps> = ({
  children,
  initial,
  onSubmit,
  ...rest
}) => {
  const props = useOrderCustomerAddressesEditForm(
    initial || {},
    onSubmit,
    rest
  );

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

OrderCustomerAddressesEditForm.displayName = "OrderCustomerAddressesEditForm";
export default OrderCustomerAddressesEditForm;
