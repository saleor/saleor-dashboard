import SingleAutocompleteSelectField from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import { getFullName } from "@saleor/misc";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardCreateFormContext } from "./GiftCardCreateFormProvider";
import { giftCardCreateDialogMessages as messages } from "./messages";

const GiftCardCustomerSelectField: React.FC = () => {
  const intl = useIntl();

  const { setSelectedCustomer, selectedCustomer, change } = useContext(
    GiftCardCreateFormContext
  );

  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const customers = mapEdgesToItems(result?.data?.search);

  const choices = customers?.map(({ email, firstName, lastName }) => ({
    value: email,
    label: getFullName({ firstName, lastName })
  }));

  const handleSelect = (event: React.ChangeEvent<any>) => {
    change(event);

    const value = event.target.value;
    const label = choices?.find(category => category.value === value)?.label;

    setSelectedCustomer({ email: value, name: label });
  };

  const label = `${intl.formatMessage(
    messages.customerLabel
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
    />
  );
};

export default GiftCardCustomerSelectField;
