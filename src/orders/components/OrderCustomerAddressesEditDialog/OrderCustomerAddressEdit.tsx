import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import AddressEdit from "@saleor/components/AddressEdit";
import CardSpacer from "@saleor/components/CardSpacer";
import FormSpacer from "@saleor/components/FormSpacer";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import Skeleton from "@saleor/components/Skeleton";
import CustomerAddressChoiceCard from "@saleor/customers/components/CustomerAddressChoiceCard";
import { AddressTypeInput } from "@saleor/customers/types";
import { CustomerAddresses_user_addresses } from "@saleor/customers/types/CustomerAddresses";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { FormChange } from "@saleor/hooks/useForm";
import React from "react";
import { useIntl } from "react-intl";

import { AddressInputOptionEnum } from "./form";
import { addressEditMessages } from "./messages";
import { useStyles } from "./styles";

export interface OrderCustomerAddressEditProps {
  loading: boolean;
  customerAddresses: CustomerAddresses_user_addresses[];
  countryChoices: SingleAutocompleteChoiceType[];
  addressInputOption: AddressInputOptionEnum;
  addressInputName: string;
  onChangeAddressInputOption: FormChange;
  customerAddressId: string;
  formAddress: AddressTypeInput;
  formAddressCountryDisplayName: string;
  formErrors: Array<AccountErrorFragment | OrderErrorFragment>;
  onChangeCustomerAddress: (
    customerAddress: CustomerAddresses_user_addresses
  ) => void;
  onChangeFormAddress: (event: React.ChangeEvent<any>) => void;
  onChangeFormAddressCountry: (event: React.ChangeEvent<any>) => void;
}

const OrderCustomerAddressEdit: React.FC<OrderCustomerAddressEditProps> = props => {
  const {
    loading,
    customerAddresses,
    countryChoices,
    addressInputOption,
    addressInputName,
    onChangeAddressInputOption,
    customerAddressId,
    formAddress,
    formAddressCountryDisplayName,
    formErrors,
    onChangeCustomerAddress,
    onChangeFormAddress,
    onChangeFormAddressCountry
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  if (loading) {
    return <Skeleton />;
  }

  if (!customerAddresses.length) {
    return (
      <AddressEdit
        countries={countryChoices}
        countryDisplayValue={formAddressCountryDisplayName}
        data={formAddress}
        errors={formErrors}
        onChange={onChangeFormAddress}
        onCountryChange={onChangeFormAddressCountry}
      />
    );
  }

  return (
    <RadioGroup
      className={classes.container}
      value={addressInputOption}
      name={addressInputName}
      onChange={event => onChangeAddressInputOption(event)}
    >
      <FormControlLabel
        value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
        control={
          <Radio
            color="primary"
            data-test="addressInputOption"
            data-test-id={AddressInputOptionEnum.CUSTOMER_ADDRESS}
          />
        }
        label={intl.formatMessage(addressEditMessages.customerAddress)}
        className={classes.optionLabel}
      />
      {addressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS && (
        <>
          {customerAddresses.map(customerAddress => (
            <React.Fragment key={customerAddress.id}>
              <CardSpacer />
              <CustomerAddressChoiceCard
                address={customerAddress}
                selected={customerAddress.id === customerAddressId}
                onSelect={() => onChangeCustomerAddress(customerAddress)}
              />
            </React.Fragment>
          ))}
          <FormSpacer />
        </>
      )}
      <FormControlLabel
        value={AddressInputOptionEnum.NEW_ADDRESS}
        control={
          <Radio
            color="primary"
            data-test={addressInputOption}
            data-test-id={AddressInputOptionEnum.NEW_ADDRESS}
          />
        }
        label={intl.formatMessage(addressEditMessages.newAddress)}
        className={classes.optionLabel}
      />
      {addressInputOption === AddressInputOptionEnum.NEW_ADDRESS && (
        <>
          <FormSpacer />
          <AddressEdit
            countries={countryChoices}
            countryDisplayValue={formAddressCountryDisplayName}
            data={formAddress}
            errors={formErrors}
            onChange={onChangeFormAddress}
            onCountryChange={onChangeFormAddressCountry}
          />
        </>
      )}
    </RadioGroup>
  );
};

OrderCustomerAddressEdit.displayName = "OrderCustomerAddressEdit";
export default OrderCustomerAddressEdit;
