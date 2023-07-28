import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { useFlag } from "@dashboard/featureFlags";
import { FilterProps, SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

import { ExpressionFilters } from "./components/ExpressionFilters";
import { FiltersSelect } from "./components/FiltersSelect";
import { LegacyFiltersPresetsAlert } from "./components/LegacyFiltersPresetsAlert";
import SearchInput from "./components/SearchInput";

export interface ListFiltersProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchPageProps {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
  actions?: ReactNode;
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
}: ListFiltersProps<TFilterKeys>) => {
  const isProductPage = window.location.pathname.includes("/products");
  const productListingPageFiltersFlag = useFlag("product_filters");
  const filtersEnabled = isProductPage && productListingPageFiltersFlag.enabled;

  return (
    <>
      {filtersEnabled && <LegacyFiltersPresetsAlert />}
      <Box
        display="grid"
        __gridTemplateColumns="auto 1fr"
        gap={4}
        paddingBottom={2}
        paddingX={6}
      >
        <Box display="flex" alignItems="center" gap={4}>
          {filtersEnabled ? (
            <ExpressionFilters />
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
};
ListFilters.displayName = "FilterBar";
