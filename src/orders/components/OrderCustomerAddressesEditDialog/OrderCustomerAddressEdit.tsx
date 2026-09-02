// @ts-strict-ignore
import { AddressEdit } from "@dashboard/components/AddressEdit/AddressEdit";
import CardSpacer from "@dashboard/components/CardSpacer";
import FormSpacer from "@dashboard/components/FormSpacer";
import { CustomerAddressChoiceCard } from "@dashboard/customers/components/CustomerAddressChoiceCard/CustomerAddressChoiceCard";
import { type AddressTypeInput } from "@dashboard/customers/types";
import {
  type AccountErrorFragment,
  type AddressFragment,
  type OrderErrorFragment,
} from "@dashboard/graphql";
import { type FormChange } from "@dashboard/hooks/useForm";
import { getById } from "@dashboard/misc";
import { Box, type Option, RadioGroup, Skeleton, Text } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { useIntl } from "react-intl";

import { AddressInputOptionEnum } from "./form";
import { addressEditMessages } from "./messages";
import { useStyles } from "./styles";

export interface OrderCustomerAddressEditProps {
  loading: boolean;
  customerAddresses: AddressFragment[];
  countryChoices: Option[];
  addressInputOption: AddressInputOptionEnum;
  addressInputName: string;
  onChangeAddressInputOption: FormChange;
  selectedCustomerAddressId: string;
  formAddress: AddressTypeInput;
  formAddressCountryDisplayName: string;
  formErrors: Array<AccountErrorFragment | OrderErrorFragment>;
  onChangeFormAddress: (event: React.ChangeEvent<any>) => void;
  onChangeFormAddressCountry: (event: React.ChangeEvent<any>) => void;
  onEdit?: () => void;
  showCard?: boolean;
}

const OrderCustomerAddressEdit = (props: OrderCustomerAddressEditProps) => {
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
    onEdit,
    showCard = true,
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
      onValueChange={value =>
        onChangeAddressInputOption({ target: { name: addressInputName, value } })
      }
    >
      <RadioGroup.Item
        id={AddressInputOptionEnum.CUSTOMER_ADDRESS}
        value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
        data-test-id={AddressInputOptionEnum.CUSTOMER_ADDRESS}
      >
        <Text>{intl.formatMessage(addressEditMessages.customerAddress)}</Text>
      </RadioGroup.Item>
      {addressInputOption === AddressInputOptionEnum.CUSTOMER_ADDRESS && showCard && (
        <>
          <CardSpacer />
          <CustomerAddressChoiceCard
            address={customerAddresses.find(getById(selectedCustomerAddressId))}
            editable
            onEditClick={onEdit}
          />
          <FormSpacer />
        </>
      )}
      <RadioGroup.Item
        id={AddressInputOptionEnum.NEW_ADDRESS}
        value={AddressInputOptionEnum.NEW_ADDRESS}
        data-test-id={AddressInputOptionEnum.NEW_ADDRESS}
      >
        <Text>{intl.formatMessage(addressEditMessages.newAddress)}</Text>
      </RadioGroup.Item>
      {addressInputOption === AddressInputOptionEnum.NEW_ADDRESS && (
        <Box display="grid" gap={5}>
          <AddressEdit
            countries={countryChoices}
            countryDisplayValue={formAddressCountryDisplayName}
            data={formAddress}
            errors={formErrors}
            onChange={onChangeFormAddress}
            onCountryChange={onChangeFormAddressCountry}
          />
        </Box>
      )}
    </RadioGroup>
  );
};

OrderCustomerAddressEdit.displayName = "OrderCustomerAddressEdit";
export default OrderCustomerAddressEdit;
