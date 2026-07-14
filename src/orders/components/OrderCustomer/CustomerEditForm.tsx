import { type SearchCustomersQuery } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

interface CustomerEditFormProps extends FetchMoreProps {
  allUsers?: RelayToFlat<SearchCustomersQuery["search"]>;
  fetchUsers?: (query: string) => void;
  value: Option | null;
  onChange: (option: Option | null) => void;
}

export const CustomerEditForm: React.FC<CustomerEditFormProps> = ({
  allUsers,
  fetchUsers,
  onChange,
  onFetchMore,
  hasMore,
  loading,
  value,
}) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState("");
  const hasFetchedRef = useRef(false);
  const debouncedFetch = useDebounce((query: string) => {
    fetchUsers?.(query);
  }, 500);

  const options = useMemo(() => {
    const opts = (allUsers || []).map(user => ({
      label: user.email,
      value: user.id,
    }));
    const trimmed = inputValue.trim();

    if (trimmed && trimmed.includes("@")) {
      const hasExactMatch = opts.some(opt => opt.label.toLowerCase() === trimmed.toLowerCase());

      if (!hasExactMatch) {
        opts.unshift({
          label: `${intl.formatMessage({
            id: "9Z7LQq",
            defaultMessage: "Use email:",
          })} ${trimmed}`,
          value: trimmed,
        });
      }
    }

    return opts;
  }, [allUsers, inputValue, intl]);

  return (
    <DynamicCombobox
      data-test-id="select-customer"
      label={intl.formatMessage({
        id: "hkSkNx",
        defaultMessage: "Search Customers",
      })}
      options={options}
      value={value}
      onChange={onChange}
      onInputValueChange={nextValue => {
        setInputValue(nextValue);
        debouncedFetch(nextValue);
      }}
      onFocus={() => {
        if (!hasFetchedRef.current) {
          fetchUsers?.("");
          hasFetchedRef.current = true;
        }
      }}
      onScrollEnd={() => {
        if (hasMore && !loading) {
          onFetchMore();
        }
      }}
      loading={loading}
    />
  );
};

CustomerEditForm.displayName = "CustomerEditForm";
