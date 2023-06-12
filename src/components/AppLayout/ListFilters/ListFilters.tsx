import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { FilterProps, SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

import { FiltersSelect } from "./components/FiltersSelect";
import SearchInput from "./components/SearchInput";

export interface ListFiltersProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchPageProps {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
  actions?: ReactNode;
}

export const ListFilters = ({
  currencySymbol,
  filterStructure,
  initialSearch,
  searchPlaceholder,
  onSearchChange,
  onFilterChange,
  onFilterAttributeFocus,
  errorMessages,
  actions,
}: ListFiltersProps) => (
  <>
    <Box
      display="grid"
      gridTemplateColumns={2}
      gap={4}
      paddingBottom={2}
      paddingX={6}
    >
      <Box display="flex" alignItems="center" gap={4}>
        <FiltersSelect
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
        {actions}
      </Box>
    </Box>
  </>
);
ListFilters.displayName = "FilterBar";
