import { type OrderDetailsFragment, type SearchCustomersQuery } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { type FetchMoreProps, type RelayToFlat } from "@dashboard/types";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import type React from "react";
import { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { type CustomerEditData } from "./OrderCustomer";

interface CustomerEditFormProps extends FetchMoreProps {
  currentUser: OrderDetailsFragment["user"] | null;
  currentUserEmail: string | null;
  allUsers?: RelayToFlat<SearchCustomersQuery["search"]>;
  fetchUsers?: (query: string) => void;
  onCustomerEdit?: (data: CustomerEditData) => void;
  toggleEditMode: () => void;
}

export const CustomerEditForm: React.FC<CustomerEditFormProps> = ({
  currentUser,
  currentUserEmail,
  allUsers,
  fetchUsers,
  onCustomerEdit,
  onFetchMore,
  hasMore,
  loading,
  toggleEditMode,
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

  const handleSelect = (option: Option | null) => {
    if (!option?.value) {
      return;
    }

    const value = String(option.value);

    onCustomerEdit?.({
      prevUser: currentUser?.id,
      prevUserEmail: currentUserEmail || undefined,
      [value.includes("@") ? "userEmail" : "user"]: value,
    });
    toggleEditMode();
  };

  return (
    <DynamicCombobox
      data-test-id="select-customer"
      label={intl.formatMessage({
        id: "hkSkNx",
        defaultMessage: "Search Customers",
      })}
      options={options}
      value={null}
      onChange={handleSelect}
      onInputValueChange={value => {
        setInputValue(value);
        debouncedFetch(value);
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
