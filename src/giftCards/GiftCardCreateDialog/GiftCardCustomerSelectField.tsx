import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import { getFullName } from "@saleor/misc";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";
import { GiftCardCreateFormCustomer } from "./types";

export interface GiftCardCustomerSelectFieldProps {
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  disabled?: boolean;
}

const GiftCardCustomerSelectField: React.FC<GiftCardCustomerSelectFieldProps> = ({
  selectedCustomer,
  setSelectedCustomer,
  disabled = false,
}) => {
  const intl = useIntl();

  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const customers = mapEdgesToItems(result?.data?.search);

  const choices = customers?.map(({ email, firstName, lastName }) => ({
    value: email,
    label: getFullName({ firstName, lastName }),
  }));

  const handleSelect = (event: React.ChangeEvent<any>) => {
    const value = event.target.value;
    const label = choices?.find(category => category.value === value)?.label;

    setSelectedCustomer({ email: value, name: label });
  };

  const label = `${intl.formatMessage(
    messages.customerLabel,
  )} *${intl.formatMessage(commonMessages.optionalField)}`;

  return (
    <SingleAutocompleteSelectField
      name="customer"
      label={label}
      data-test-id="customer-field"
      displayValue={selectedCustomer.name}
      value={selectedCustomer.email}
      choices={choices || []}
      fetchChoices={search}
      onChange={handleSelect}
      onFetchMore={loadMore}
      disabled={disabled}
    />
  );
};

export default GiftCardCustomerSelectField;
