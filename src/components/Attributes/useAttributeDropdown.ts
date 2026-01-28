import useDebounce from "@dashboard/hooks/useDebounce";
import { FetchMoreProps } from "@dashboard/types";
import { Option } from "@saleor/macaw-ui-next";
import { useCallback, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { attributeRowMessages } from "./messages";

interface UseAttributeDropdownProps {
  attributeId: string;
  options: Option[];
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreAttributeValues?: FetchMoreProps;
}

interface UseAttributeDropdownResult {
  inputValue: string;
  setInputValue: (value: string) => void;
  displayOptions: Option[];
  handleInputChange: (value: string) => void;
  handleFocus: () => void;
  handleScrollEnd: () => void;
  loading: boolean;
}

export const useAttributeDropdown = ({
  attributeId,
  options,
  fetchAttributeValues,
  fetchMoreAttributeValues,
}: UseAttributeDropdownProps): UseAttributeDropdownResult => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState("");
  const mounted = useRef(false);

  const debouncedFetch = useDebounce((query: string) => {
    fetchAttributeValues(query, attributeId);
  }, 500);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      debouncedFetch(value);
    },
    [debouncedFetch],
  );

  const handleFocus = useCallback(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchAttributeValues("", attributeId);
    }
  }, [fetchAttributeValues, attributeId]);

  const handleScrollEnd = useCallback(() => {
    if (fetchMoreAttributeValues?.hasMore) {
      fetchMoreAttributeValues.onFetchMore();
    }
  }, [fetchMoreAttributeValues]);

  // Add "Add new value" option when user types a custom value
  const displayOptions = useMemo(() => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput) {
      return options;
    }

    // Check if the input exactly matches an existing option
    const hasExactMatch = options.some(
      opt => opt.label.toLowerCase() === trimmedInput.toLowerCase(),
    );

    if (hasExactMatch) {
      return options;
    }

    // Add "Add new value" option at the top
    const addNewValueOption: Option = {
      label: intl.formatMessage(attributeRowMessages.addNewValueWithLabel, { value: trimmedInput }),
      value: trimmedInput,
    };

    return [addNewValueOption, ...options];
  }, [options, inputValue, intl]);

  const loading = fetchMoreAttributeValues?.loading || fetchMoreAttributeValues?.hasMore || false;

  return {
    inputValue,
    setInputValue,
    displayOptions,
    handleInputChange,
    handleFocus,
    handleScrollEnd,
    loading,
  };
};
