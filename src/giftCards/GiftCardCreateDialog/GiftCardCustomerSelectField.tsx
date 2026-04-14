import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { getFullName } from "@dashboard/misc";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { giftCardCreateMessages as messages } from "./messages";
import { type GiftCardCreateFormCustomer } from "./types";

interface GiftCardCustomerSelectFieldProps {
  selectedCustomer: GiftCardCreateFormCustomer;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  disabled?: boolean;
}

export const isValidEmailPattern = (email: string) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    email,
  );
};

export const GiftCardCustomerSelectField = ({
  selectedCustomer,
  setSelectedCustomer,
  disabled = false,
}: GiftCardCustomerSelectFieldProps) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState("");
  const hasFetchedRef = useRef(false);
  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const customers = mapEdgesToItems(result?.data?.search);

  const debouncedSearch = useDebounce((query: string) => {
    search(query);
  }, 500);

  const options = useMemo(() => {
    const opts = (customers || []).map(({ email, firstName, lastName }) => ({
      value: email,
      label: getFullName({ firstName, lastName }) || email,
    }));
    const trimmed = inputValue.trim();

    if (isValidEmailPattern(trimmed)) {
      const hasExactMatch = opts.some(opt => opt.value.toLowerCase() === trimmed.toLowerCase());

      if (!hasExactMatch) {
        opts.unshift({
          label: `${intl.formatMessage(messages.useEmail)} ${trimmed}`,
          value: trimmed,
        });
      }
    }

    return opts;
  }, [customers, inputValue, intl]);

  const value = useMemo<Option | null>(
    () =>
      selectedCustomer.email
        ? { label: selectedCustomer.name, value: selectedCustomer.email }
        : null,
    [selectedCustomer.email, selectedCustomer.name],
  );

  const handleSelect = (option: Option | null): void => {
    if (!option) {
      setSelectedCustomer({
        email: "",
        name: "",
      });

      return;
    }

    if (!option.value) {
      return;
    }

    const email = String(option.value);
    const matchedCustomer = options.find(o => o.value === email);

    setSelectedCustomer({
      email,
      name: matchedCustomer?.label ?? email,
    });
  };

  const label = intl.formatMessage(messages.customerLabel);

  return (
    <DynamicCombobox
      data-test-id="customer-field"
      disabled={disabled}
      label={label}
      options={options}
      value={value}
      onChange={handleSelect}
      onInputValueChange={val => {
        setInputValue(val);
        debouncedSearch(val);
      }}
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
      name="customer"
    />
  );
};
