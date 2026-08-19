import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { getFullName } from "@dashboard/misc";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useMemo, useRef } from "react";
import { useIntl } from "react-intl";

import { giftCardAssignCustomerMessages as messages } from "./messages";

export interface AssignedCustomer {
  id: string;
  email: string;
  name: string;
}

interface GiftCardAssignCustomerSelectProps {
  selectedCustomer: AssignedCustomer | null;
  onChange: (customer: AssignedCustomer | null) => void;
  disabled?: boolean;
  label?: string;
}

export const GiftCardAssignCustomerSelect = ({
  selectedCustomer,
  onChange,
  disabled = false,
  label,
}: GiftCardAssignCustomerSelectProps) => {
  const intl = useIntl();
  const hasFetchedRef = useRef(false);
  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const customers = mapEdgesToItems(result?.data?.search) ?? [];

  const debouncedSearch = useDebounce((query: string) => {
    search(query);
  }, 500);

  const options = useMemo<Option[]>(
    () =>
      customers.map(({ id, email, firstName, lastName }) => ({
        value: id,
        label: getFullName({ firstName, lastName }) || email,
      })),
    [customers],
  );

  const value = useMemo<Option | null>(
    () => (selectedCustomer ? { label: selectedCustomer.name, value: selectedCustomer.id } : null),
    [selectedCustomer],
  );

  const handleChange = (option: Option | null): void => {
    if (!option?.value) {
      onChange(null);

      return;
    }

    const id = String(option.value);
    const matched = customers.find(customer => customer.id === id);

    onChange({
      id,
      email: matched?.email ?? "",
      name: matched ? getFullName(matched) || matched.email : String(option.label),
    });
  };

  return (
    <DynamicCombobox
      data-test-id="assign-customer-field"
      disabled={disabled}
      label={label ?? intl.formatMessage(messages.label)}
      options={options}
      value={value}
      onChange={handleChange}
      onInputValueChange={debouncedSearch}
      onFocus={() => {
        if (!hasFetchedRef.current) {
          search("");
          hasFetchedRef.current = true;
        }
      }}
      onScrollEnd={() => {
        if (!result?.loading && result?.data?.search?.pageInfo?.hasNextPage) {
          loadMore();
        }
      }}
      loading={result?.loading}
      name="assignedCustomer"
    />
  );
};
