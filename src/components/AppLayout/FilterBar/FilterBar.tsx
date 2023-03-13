import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { FilterProps, SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import Filter from "./Filter";
import SearchInput from "./SearchInput";

export interface FilterBarProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchPageProps {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
}

export const FilterBar: React.FC<FilterBarProps> = props => {
  const {
    currencySymbol,
    filterStructure,
    initialSearch,
    searchPlaceholder,
    onSearchChange,
    onFilterChange,
    onFilterAttributeFocus,
    errorMessages,
  } = props;

  return (
    <>
      <Box
        display="grid"
        __gridTemplateColumns="1fr 1fr"
        gap={7}
        marginBottom={5}
        paddingX={9}
      >
        <Box display="flex" alignItems="center" gap={7}>
          <Filter
            errorMessages={errorMessages}
            menu={filterStructure}
            currencySymbol={currencySymbol}
            onFilterAdd={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
          />
          <Box __width="320px">
            <SearchInput
              initialSearch={initialSearch}
              placeholder={searchPlaceholder}
              onSearchChange={onSearchChange}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {/* TODO: add view switcher here when will be ready */}
        </Box>
      </Box>
    </>
  );
};
FilterBar.displayName = "FilterBar";
