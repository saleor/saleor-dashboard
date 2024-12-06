// @ts-strict-ignore
import { Combobox } from "@dashboard/components/Combobox";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { commonMessages } from "@dashboard/intl";
import { getFullName } from "@dashboard/misc";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";
import { GiftCardCreateFormCustomer } from "./types";

export interface GiftCardCustomerSelectFieldProps {
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  disabled?: boolean;
}

const GiftCardCustomerSelectField = ({
  selectedCustomer,
  setSelectedCustomer,
  disabled = false,
}: GiftCardCustomerSelectFieldProps) => {
  const intl = useIntl();
  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const customers = mapEdgesToItems(result?.data?.search);
  const choices = customers?.map(({ email, firstName, lastName }) => ({
    value: email,
    label: getFullName({ firstName, lastName }) || email,
  }));
  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const label = choices?.find(category => category.value === value)?.label;

    setSelectedCustomer({ email: value, name: label });
  };
  const label = `${intl.formatMessage(
    messages.customerLabel,
  )} *${intl.formatMessage(commonMessages.optionalField)}`;

  return (
    <Combobox
      data-test-id="customer-field"
      disabled={disabled}
      label={label}
      options={choices || []}
      fetchOptions={search}
      fetchMore={{
        onFetchMore: loadMore,
        hasMore: result?.data?.search?.pageInfo?.hasNextPage,
        loading: result?.loading,
      }}
      name="customer"
      value={{
        label: selectedCustomer.name,
        value: selectedCustomer.email,
      }}
      onChange={handleSelect}
    />
  );
};

export default GiftCardCustomerSelectField;
