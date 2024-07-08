// @ts-strict-ignore
import AddressEdit from "@dashboard/components/AddressEdit";
import CardSpacer from "@dashboard/components/CardSpacer";
import FormSpacer from "@dashboard/components/FormSpacer";
import Skeleton from "@dashboard/components/Skeleton";
import CustomerAddressChoiceCard from "@dashboard/customers/components/CustomerAddressChoiceCard";
import { AddressTypeInput } from "@dashboard/customers/types";
import { AccountErrorFragment, AddressFragment, OrderErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { getById } from "@dashboard/misc";
import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { Box, Option } from "@saleor/macaw-ui-next";
import React from "react";
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
      onChange={event => onChangeAddressInputOption(event)}
    >
      <FormControlLabel
        value={AddressInputOptionEnum.CUSTOMER_ADDRESS}
        control={<Radio color="primary" data-test-id={AddressInputOptionEnum.CUSTOMER_ADDRESS} />}
        label={intl.formatMessage(addressEditMessages.customerAddress)}
        className={classes.optionLabel}
      />
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
      <FormControlLabel
        value={AddressInputOptionEnum.NEW_ADDRESS}
        control={<Radio color="primary" data-test-id={AddressInputOptionEnum.NEW_ADDRESS} />}
        label={intl.formatMessage(addressEditMessages.newAddress)}
        className={classes.optionLabel}
      />
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
