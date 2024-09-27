import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { FilterProps, SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import React, { ReactNode } from "react";

import { ExpressionFilters } from "./components/ExpressionFilters";
import { FiltersSelect } from "./components/FiltersSelect";
import { LegacyFiltersPresetsAlert } from "./components/LegacyFiltersPresetsAlert";
import SearchInput from "./components/SearchInput";

interface ListFiltersProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchPageProps {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
  actions?: ReactNode;
  filtersEnabled?: boolean;
}

export const ListFilters = <TFilterKeys extends string = string>({
  currencySymbol,
  filterStructure,
  initialSearch,
  searchPlaceholder,
  onSearchChange,
  onFilterChange,
  onFilterAttributeFocus,
  errorMessages,
  actions,
  filtersEnabled,
}: ListFiltersProps<TFilterKeys>) => (
  <>
    {filtersEnabled && <LegacyFiltersPresetsAlert />}
    <Box display="grid" __gridTemplateColumns="auto 1fr" gap={4} paddingBottom={2} paddingX={6}>
      <Box display="flex" alignItems="center" gap={4}>
        {filtersEnabled ? (
          <ExpressionFilters data-test-id="filters-button" />
        ) : (
          <FiltersSelect<TFilterKeys>
            errorMessages={errorMessages}
            menu={filterStructure}
            currencySymbol={currencySymbol}
            onFilterAdd={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
          />
        )}
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
