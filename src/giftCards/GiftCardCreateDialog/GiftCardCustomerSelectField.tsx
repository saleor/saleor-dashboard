// @ts-strict-ignore
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { commonMessages } from "@dashboard/intl";
import { getFullName } from "@dashboard/misc";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React, { useRef } from "react";
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
  const mounted = useRef(false);
  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const customers = mapEdgesToItems(result?.data?.search);
  const choices = customers?.map(({ email, firstName, lastName }) => ({
    value: email,
    label: getFullName({ firstName, lastName }) || email,
  }));
  const debouncedSearch = useDebounce(search, 500);

  const handleSelect = (option: Option | null) => {
    const value = option?.value ?? "";
    const label = choices?.find(choice => choice.value === value)?.label ?? "";

    setSelectedCustomer({ email: value, name: label });
  };
  const label = `${intl.formatMessage(
    messages.customerLabel,
  )} *${intl.formatMessage(commonMessages.optionalField)}`;

  return (
    <DynamicCombobox
      data-test-id="customer-field"
      disabled={disabled}
      label={label}
      options={choices || []}
      onInputValueChange={debouncedSearch}
      onFocus={() => {
        if (!mounted.current) {
          mounted.current = true;
          search("");
        }
      }}
      onScrollEnd={() => {
        if (result?.data?.search?.pageInfo?.hasNextPage) {
          loadMore();
        }
      }}
      loading={result?.loading || result?.data?.search?.pageInfo?.hasNextPage}
      name="customer"
      value={
        selectedCustomer.email
          ? {
              label: selectedCustomer.name,
              value: selectedCustomer.email,
            }
          : null
      }
      onChange={handleSelect}
      locale={{
        loadingText: intl.formatMessage(commonMessages.loading),
      }}
      size="small"
    />
  );
};

export default GiftCardCustomerSelectField;
