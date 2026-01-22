import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { getFullName } from "@dashboard/misc";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DynamicCombobox } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";
import { GiftCardCreateFormCustomer } from "./types";

interface GiftCardCustomerSelectFieldProps {
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  disabled?: boolean;
}

export const GiftCardCustomerSelectField = ({
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
  const handleSelect = (option: { value: string; label: string }): void => {
    const label = choices?.find(o => o.value === option.value)?.label ?? option.value;

    setSelectedCustomer({ email: option.value, name: label });
  };
  const label = `${intl.formatMessage(messages.customerLabel)}`;

  return (
    <DynamicCombobox
      data-test-id="customer-field"
      disabled={disabled}
      label={label}
      onFocus={() => search("")}
      options={choices || []}
      onScrollEnd={() => {
        if (!result?.loading && result?.data?.search?.pageInfo?.hasNextPage) {
          loadMore();
        }
      }}
      name="customer"
      value={{
        label: selectedCustomer.name,
        value: selectedCustomer.email,
      }}
      onChange={v =>
        handleSelect({
          value: v?.value ?? "",
          label: v?.label ?? "",
        })
      }
    />
  );
};
