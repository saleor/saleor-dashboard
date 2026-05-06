import Debounce from "@dashboard/components/Debounce";
import { type SearchPageProps } from "@dashboard/types";
import {
  Box,
  SearchInput as MacawSearchInput,
  type SearchInputProps as MacawSearchInputProps,
} from "@saleor/macaw-ui-next";
import * as React from "react";

import styles from "./SearchInput.module.css";
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
          <Box
            as="label"
            display="flex"
            alignItems="center"
            width="100%"
            // Inactive: matches the page surface (default1 = pure white in light
            // theme / page bg in dark theme), so only the gentle border outlines
            // the input. On focus the wrapper shifts to a visible tint via
            // :focus-within in the CSS module. The module also forces every
            // nested background transparent so the magnifier, input field and
            // trailing tooltip icon all share this exact same color.
            backgroundColor="default1"
            borderWidth={1}
            borderStyle="solid"
            borderColor="default1"
            borderRadius={3}
            className={styles.wrapper}
          >
            <Box __flex={1} __minWidth={0} display="flex" alignItems="center">
              <MacawSearchInput
                size={size}
                value={search}
                onChange={handleSearchChange}
                placeholder={placeholder}
                data-test-id="search-input"
              />
            </Box>
            {showSearchTooltip && (
              <Box display="flex" alignItems="center" paddingRight={2}>
                <SearchTooltip />
              </Box>
            )}
          </Box>
        );
      }}
    </Debounce>
  );
};

SearchInput.displayName = "SearchInput";
export default SearchInput;
