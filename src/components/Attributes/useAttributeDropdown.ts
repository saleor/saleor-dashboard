import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import useDebounce from "@dashboard/hooks/useDebounce";
import { FetchMoreProps } from "@dashboard/types";
import { Option } from "@saleor/macaw-ui-next";
import { useCallback, useMemo, useRef } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  addNewValue: {
    id: "U2WgwW",
    defaultMessage: "Add new value: {value}",
    description: "add custom select input option",
  },
});

interface UseAttributeDropdownProps {
  inputValue: string;
  selectedValue: Option | null;
  fetchOptions: (query: string) => void;
  fetchMore?: FetchMoreProps;
}

/** Enhances DynamicCombobox from macaw to add features for selecting attribute values:
 * - displays "Add new value" line (it just sets value to whatever user entered - value is created on save)
 * - fetches more options if scrolled to bottom
 * - fetches options using user input (via `query` parameter in fetch query) on every input change (debounced) */
export const useAttributeDropdown = ({
  inputValue,
  selectedValue,
  fetchOptions,
  fetchMore,
}: UseAttributeDropdownProps) => {
  const intl = useIntl();
  const mounted = useRef(false);

  const fetchOptionsCallback = useCallback(
    (value: string) => {
      fetchOptions(value);
    },
    [fetchOptions],
  );

  const debouncedFetchOptions = useDebounce(fetchOptionsCallback, 500);
  const handleFetchMore = () => {
    if (fetchMore?.hasMore) {
      fetchMore.onFetchMore();
    }
  };

  const handleInputChange = (value: string) => {
    debouncedFetchOptions(value);
  };

  const handleFocus = () => {
    if (!mounted.current) {
      mounted.current = true;
      fetchOptions(DEFAULT_INITIAL_SEARCH_DATA.query);
    }
  };

  const customValueLabel = intl.formatMessage(messages.addNewValue, {
    value: inputValue,
  });

  const shouldShowCustomValue = useMemo(() => {
    if (!inputValue) {
      return false;
    }

    return selectedValue?.label?.toLocaleLowerCase() !== inputValue.toLocaleLowerCase();
  }, [inputValue, selectedValue]);

  const customValueOption: Option[] = shouldShowCustomValue
    ? [
        {
          label: customValueLabel,
          value: inputValue,
        },
      ]
    : [];

  const transformCustomValue = (option: Option): Option => {
    if (option.label.includes(customValueLabel)) {
      return { label: option.value, value: option.value };
    }

    return option;
  };

  return {
    customValueOption,
    customValueLabel,
    handleFetchMore,
    handleInputChange,
    handleFocus,
    transformCustomValue,
  };
};
