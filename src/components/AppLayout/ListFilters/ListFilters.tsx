import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { FilterProps, SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";

import { ExpressionFilters } from "./components/ExpressionFilters";
import { FiltersSelect } from "./components/FiltersSelect";
import { LegacyFiltersPresetsAlert } from "./components/LegacyFiltersPresetsAlert";
import SearchInput from "./components/SearchInput";

export interface NewFilterProps extends SearchPageProps {
  type: "expression-filter";
  searchPlaceholder: string;
  actions?: ReactNode;
}

interface OldFiltersProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchPageProps {
  type?: "old-filter-select";
  searchPlaceholder: string;
  actions?: ReactNode;
  filterStructure?: IFilter<TKeys>;
  errorMessages?: FilterErrorMessages<TKeys>;
}

export type ListFiltersProps<TKeys extends string = string> =
  | NewFilterProps
  | OldFiltersProps<TKeys>;

export const ListFilters = <TFilterKeys extends string = string>({
  initialSearch,
  searchPlaceholder,
  onSearchChange,
  actions,
  ...props
}: ListFiltersProps<TFilterKeys>) => {
  const isExpressionFilter = props.type === "expression-filter";

  return (
    <>
      {isExpressionFilter && <LegacyFiltersPresetsAlert />}
      <Box display="grid" __gridTemplateColumns="auto 1fr" gap={4} paddingBottom={2} paddingX={6}>
        <Box display="flex" alignItems="center" gap={4}>
          {isExpressionFilter ? (
            <ExpressionFilters data-test-id="filters-button" />
          ) : (
            <FiltersSelect<TFilterKeys>
              errorMessages={props.errorMessages}
              menu={props.filterStructure!}
              currencySymbol={props.currencySymbol}
              onFilterAdd={props.onFilterChange!}
              onFilterAttributeFocus={props.onFilterAttributeFocus}
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
