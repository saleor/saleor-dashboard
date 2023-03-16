import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { FilterProps, SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

import { Filter } from "./Filter";
import SearchInput from "./SearchInput";

export interface FilterBarProps<TKeys extends string = string>
  extends FilterProps<TKeys>,
    SearchPageProps {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  filterStructure: IFilter<TKeys>;
  actions?: ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currencySymbol,
  filterStructure,
  initialSearch,
  searchPlaceholder,
  onSearchChange,
  onFilterChange,
  onFilterAttributeFocus,
  errorMessages,
  actions,
}: FilterBarProps) => (
  <>
    <Box
      display="grid"
      __gridTemplateColumns="1fr 1fr"
      gap={7}
      paddingBottom={5}
      paddingX={9}
      borderColor="neutralPlain"
      borderBottomStyle="solid"
      borderBottomWidth={1}
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
        {actions}
      </Box>
    </Box>
  </>
);
FilterBar.displayName = "FilterBar";
