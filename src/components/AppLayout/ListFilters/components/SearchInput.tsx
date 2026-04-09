import Debounce from "@dashboard/components/Debounce";
import { type SearchPageProps } from "@dashboard/types";
import {
  Box,
  SearchInput as MacawSearchInput,
  type SearchInputProps as MacawSearchInputProps,
} from "@saleor/macaw-ui-next";
import * as React from "react";

import { SearchTooltip } from "./SearchTooltip/SearchTooltip";

interface SearchInputProps extends SearchPageProps {
  placeholder: string;
  size?: MacawSearchInputProps["size"];
  showSearchTooltip?: boolean;
}

const SearchInput = (props: SearchInputProps) => {
  const { initialSearch, onSearchChange, placeholder, size = "small", showSearchTooltip } = props;
  const [search, setSearch] = React.useState(initialSearch);

  React.useEffect(() => setSearch(initialSearch), [initialSearch]);

  return (
    <Debounce debounceFn={onSearchChange} time={500}>
      {debounceSearchChange => {
        const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;

          setSearch(value);
          debounceSearchChange(value);
        };

        return (
          <Box display="flex" alignItems="center" gap={1.5} width="100%">
            <Box as="label" display="flex" alignItems="center" width="100%">
              <MacawSearchInput
                size={size}
                value={search}
                onChange={handleSearchChange}
                placeholder={placeholder}
                data-test-id="search-input"
              />
            </Box>
            {showSearchTooltip && <SearchTooltip />}
          </Box>
        );
      }}
    </Debounce>
  );
};

SearchInput.displayName = "SearchInput";
export default SearchInput;
