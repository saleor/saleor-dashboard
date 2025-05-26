import Debounce from "@dashboard/components/Debounce";
import { SearchPageProps } from "@dashboard/types";
import {
  Box,
  SearchInput as MacawSearchInput,
  SearchInputProps as MacawSearchInputProps,
} from "@saleor/macaw-ui-next";
import React from "react";

export interface SearchInputProps extends SearchPageProps {
  placeholder: string;
  size?: MacawSearchInputProps["size"];
}

const SearchInput: React.FC<SearchInputProps> = props => {
  const { initialSearch, onSearchChange, placeholder, size = "small" } = props;
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
          <Box as="label" display="flex" alignItems="center" width="100%">
            <MacawSearchInput
              size={size}
              value={search}
              onChange={handleSearchChange}
              placeholder={placeholder}
              data-test-id="search-input"
            />
          </Box>
        );
      }}
    </Debounce>
  );
};

SearchInput.displayName = "SearchInput";
export default SearchInput;
