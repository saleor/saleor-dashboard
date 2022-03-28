import { Divider } from "@material-ui/core";
import AddressEdit from "@saleor/components/AddressEdit";
import FormSpacer from "@saleor/components/FormSpacer";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { AddressTypeInput } from "@saleor/customers/types";
import {
  AccountErrorFragment,
  AddressFragment,
  OrderErrorFragment
} from "@saleor/graphql";
import { FormChange } from "@saleor/hooks/useForm";
import { SwitchSelector, SwitchSelectorButton } from "@saleor/macaw-ui";
import React, { useEffect } from "react";

import { getById } from "../OrderReturnPage/utils";
import { AddressInputOptionEnum } from "./form";
import OrderCustomerAddressesSearch from "./OrderCustomerAddressesSearch";

export interface OrderCustomerAddressEditProps {
  loading: boolean;
  customerAddresses: AddressFragment[];
  countryChoices: SingleAutocompleteChoiceType[];
  addressInputOption: AddressInputOptionEnum;
  addressInputName: string;
  onChangeAddressInputOption: FormChange;
  initialCustomerAddress?: AddressFragment;
  selectedCustomerAddressId: string;
  formAddress: AddressTypeInput;
  formAddressCountryDisplayName: string;
  formErrors: Array<AccountErrorFragment | OrderErrorFragment>;
  onChangeFormAddress: (event: React.ChangeEvent<any>) => void;
  onChangeFormAddressCountry: (event: React.ChangeEvent<any>) => void;
  onChangeCustomerAddress: (customerAddress: AddressFragment) => void;
}

const OrderCustomerAddressEdit: React.FC<OrderCustomerAddressEditProps> = props => {
  const {
    loading,
    customerAddresses,
    countryChoices,
    addressInputOption,
    addressInputName,
    onChangeAddressInputOption,
    selectedCustomerAddressId,
    formAddress,
    formAddressCountryDisplayName,
    formErrors,
    onChangeFormAddress,
    onChangeFormAddressCountry,
    onChangeCustomerAddress
  } = props;

  const switchOptions = [
    {
      value: "customerAddress",
      label: "Select address"
    },
    {
      value: "newAddress",
      label: "New address"
    }
  ];

  const initialAddress = customerAddresses.find(
    getById(selectedCustomerAddressId)
  );

  const [
    temporarySelectedAddress,
    setTemporarySelectedAddress
  ] = React.useState(initialAddress);

  useEffect(() => {
    if (temporarySelectedAddress) {
      onChangeCustomerAddress(temporarySelectedAddress);
    }
  }, [temporarySelectedAddress]);

  return (
    <>
      <SwitchSelector>
        {switchOptions.map(({ label, value }) => (
          <SwitchSelectorButton
            value={value}
            onClick={() =>
              onChangeAddressInputOption({
                target: { name: addressInputName, value }
              })
            }
            activeTab={addressInputOption}
          >
            {label}
          </SwitchSelectorButton>
        ))}
      </SwitchSelector>
      <FormSpacer />
      <Divider />
      <FormSpacer />

      {addressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS && (
        <>
          <OrderCustomerAddressesSearch
            customerAddresses={customerAddresses}
            selectedCustomerAddressId={selectedCustomerAddressId}
            loading={loading}
            temporarilySelectedAddress={temporarySelectedAddress}
            setTemporaryAddress={setTemporarySelectedAddress}
          />
          <FormSpacer />
        </>
      )}

      {addressInputOption === AddressInputOptionEnum.NEW_ADDRESS && (
        <AddressEdit
          countries={countryChoices}
          countryDisplayValue={formAddressCountryDisplayName}
          data={formAddress}
          errors={formErrors}
          onChange={onChangeFormAddress}
          onCountryChange={onChangeFormAddressCountry}
        />
      )}
    </>
  );
};

OrderCustomerAddressEdit.displayName = "OrderCustomerAddressEdit";
export default OrderCustomerAddressEdit;
