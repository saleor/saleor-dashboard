import Debounce from "@dashboard/components/Debounce";
import { SearchPageProps } from "@dashboard/types";
import {
  Box,
  SearchInput as MacawSearchInput,
  SearchInputProps as MacawSearchInputProps,
  sprinkles,
} from "@saleor/macaw-ui-next";
import React from "react";

export interface SearchInputProps extends SearchPageProps {
  placeholder: string;
  size?: MacawSearchInputProps["size"];
  withBorder?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = props => {
  const { initialSearch, onSearchChange, placeholder, withBorder, size = "small" } = props;
  const [search, setSearch] = React.useState(initialSearch);

  React.useEffect(() => setSearch(initialSearch), [initialSearch]);

  const className = withBorder
    ? sprinkles({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: {
          default: "default1",
          hover: "default1Hovered",
          focusWithin: "accent1",
        },
        backgroundColor: {
          default: "transparent",
          hover: "transparent",
          focusWithin: "transparent",
        },
      })
    : "";

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
              className={className}
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
