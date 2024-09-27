import Debounce from "@dashboard/components/Debounce";
import { SearchPageProps } from "@dashboard/types";
import { Box, SearchInput as MacawSearchInput } from "@saleor/macaw-ui-next";
import React from "react";

interface SearchInputProps extends SearchPageProps {
  placeholder: string;
}

const SearchInput: React.FC<SearchInputProps> = props => {
  const { initialSearch, onSearchChange, placeholder } = props;
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
          <Box display="flex" alignItems="center" width="100%">
            <MacawSearchInput
              size="small"
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
