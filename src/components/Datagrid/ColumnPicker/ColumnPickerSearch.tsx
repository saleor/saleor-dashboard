import Debounce from "@dashboard/components/Debounce";
import { SearchInput } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import messages from "./messages";
import { ColumnCategory } from "./useColumns";

interface ColumnPickerSearchProps {
  currentCategory: ColumnCategory;
  setQuery: (value: React.SetStateAction<string>) => void;
  query: string;
}

export const ColumnPickerSearch: React.FC<ColumnPickerSearchProps> = ({
  currentCategory,
  setQuery,
  query,
}: ColumnPickerSearchProps) => {
  const intl = useIntl();

  return (
    <Debounce debounceFn={(value: string) => currentCategory.onSearch(value)} time={500}>
      {debounceSearchChange => {
        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value ?? "";

          setQuery(value);
          debounceSearchChange(value);
        };

        return (
          <SearchInput
            size="small"
            placeholder={intl.formatMessage(messages.searchForColumns)}
            value={query}
            onChange={handleSearchChange}
            data-test-id="search-columns"
          />
        );
      }}
    </Debounce>
  );
};
