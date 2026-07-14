// @ts-strict-ignore
import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import { type AddressTypeInput } from "@dashboard/customers/types";
import { type AddressFragment, type CountryWithCodeFragment, type Node } from "@dashboard/graphql";
import useForm, {
  type CommonUseFormResultWithHandlers,
  type FormChange,
  type SubmitPromise,
} from "@dashboard/hooks/useForm";
import useHandleFormSubmit from "@dashboard/hooks/useHandleFormSubmit";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { type Option } from "@saleor/macaw-ui-next";
import {
  type ChangeEvent,
  createContext,
  type FormEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { ORDER_CUSTOMER_ADDRESSES_EDIT_FORM_ID } from "./types";

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
    event: ChangeEvent<any>,
    addressType: "shippingAddress" | "billingAddress",
  ) => void;
  changeCustomerAddress: (
    customerAddress: AddressFragment,
    addressType: "customerShippingAddress" | "customerBillingAddress",
  ) => void;
  selectShippingCountry: FormChange;
  selectBillingCountry: FormChange;
}

export interface OrderCustomerAddressesEditFormContextValue
  extends CommonUseFormResultWithHandlers<
    OrderCustomerAddressesEditData,
    OrderCustomerAddressesEditHandlers
  > {
  submit: (event: FormEvent<any>) => SubmitPromise<any[]>;
}

interface UseOrderCustomerAddressesEditFormOpts {
  countryChoices: Option[];
  countries: CountryWithCodeFragment[];
  defaultShippingAddress: Node;
  defaultBillingAddress: Node;
  defaultCloneAddress: boolean;
}

interface OrderCustomerAddressesEditFormProps extends UseOrderCustomerAddressesEditFormOpts {
  children: ReactNode;
  initial?: Partial<OrderCustomerAddressesEditFormData>;
  onSubmit: (data: OrderCustomerAddressesEditData) => void;
}

const OrderCustomerAddressesEditFormContext =
  createContext<OrderCustomerAddressesEditFormContextValue | null>(null);

export const useOrderCustomerAddressesEditFormContext =
  (): OrderCustomerAddressesEditFormContextValue => {
    const context = useContext(OrderCustomerAddressesEditFormContext);

    if (!context) {
      throw new Error(
        "useOrderCustomerAddressesEditFormContext must be used within OrderCustomerAddressesEditForm",
      );
    }

    return context;
  };

function useOrderCustomerAddressesEditForm(
  providedInitialFormData: Partial<OrderCustomerAddressesEditFormData>,
  onSubmit: (data: OrderCustomerAddressesEditData) => void,
  opts: UseOrderCustomerAddressesEditFormOpts,
): OrderCustomerAddressesEditFormContextValue {
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
  const dataRef = useRef<OrderCustomerAddressesEditData>();
  const [shippingCountryDisplayName, setShippingCountryDisplayName] = useState(
    opts.countries.find(country => initialData.shippingAddress.country === country.code)?.country,
  );
  const [billingCountryDisplayName, setBillingCountryDisplayName] = useState(
    opts.countries.find(country => initialData.billingAddress.country === country.code)?.country,
  );
  const handleFormAddressChange = (
    event: ChangeEvent<any>,
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
  ) => {
    change({
      target: {
        name: addressType,
        value: customerAddress,
      },
    });

    if (dataRef.current) {
      dataRef.current = {
        ...dataRef.current,
        [addressType]: customerAddress,
      };
    }
  };
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

  useEffect(
    function syncFormDataRef() {
      dataRef.current = data;
    },
    [data],
  );

  const handleFormSubmit = useHandleFormSubmit({
    onSubmit,
  });
  const handleSubmit = () => handleFormSubmit(dataRef.current ?? data);
  const submit = (event: FormEvent<any>) => {
    event.stopPropagation();
    event.preventDefault();

    return handleSubmit();
  };

  useEffect(
    function registerExitDialogSubmitRef() {
      setExitDialogSubmitRef(submit);
    },
    [setExitDialogSubmitRef, submit],
  );

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

interface OrderCustomerAddressesEditFormElementProps {
  children: ReactNode;
  id?: string;
}

const OrderCustomerAddressesEditFormElement = ({
  children,
  id = ORDER_CUSTOMER_ADDRESSES_EDIT_FORM_ID,
}: OrderCustomerAddressesEditFormElementProps) => {
  const { submit } = useOrderCustomerAddressesEditFormContext();

  return (
    <form id={id} onSubmit={submit} autoComplete="off">
      {children}
    </form>
  );
};

const OrderCustomerAddressesEditForm = ({
  children,
  initial,
  onSubmit,
  ...rest
}: OrderCustomerAddressesEditFormProps) => {
  const value = useOrderCustomerAddressesEditForm(initial || {}, onSubmit, rest);

  return (
    <OrderCustomerAddressesEditFormContext.Provider value={value}>
      {children}
    </OrderCustomerAddressesEditFormContext.Provider>
  );
};

OrderCustomerAddressesEditForm.displayName = "OrderCustomerAddressesEditForm";
OrderCustomerAddressesEditForm.Form = OrderCustomerAddressesEditFormElement;
export default OrderCustomerAddressesEditForm;
