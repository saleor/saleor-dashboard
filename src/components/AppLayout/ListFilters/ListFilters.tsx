import { FilterErrorMessages, IFilter } from "@dashboard/components/Filter";
import { Box } from "@saleor/macaw-ui/next";
import React, { ReactNode, useState } from "react";
import SearchInput from "./components/SearchInput";
import { _ExperimentalFilters } from "@saleor/macaw-ui/next"
import { parse, stringify } from "qs";
import { ConditionalFilters } from "@dashboard/components/ConditionalFilter";

export interface ListFiltersProps<TKeys extends string = string> {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  actions?: ReactNode;
}


const STATIC_CONDITIONS = {
  category: [
    { value: "combobox", label: "is" },
  ],
  price: [
    { value: "input", label: "is" },
    { value: "range", label: "between" },
  ],
  discount: [
    { value: "input", label: "is" },
    { value: "range", label: "between" },
  ],
  rating: [
    { value: "combobox", label: "is" }
  ]
}



export const ListFilters = ({
  searchPlaceholder,
  errorMessages,
  actions,
}: ListFiltersProps) => {


  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={2}
        gap={4}
        paddingBottom={2}
        paddingX={6}
      >
        <Box display="flex" alignItems="center" gap={4}>
          <ConditionalFilters />
          <Box __width="320px">
            <SearchInput
              initialSearch={""}
              placeholder={searchPlaceholder}
              onSearchChange={() => {}}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {actions}
        </Box>
      </Box>
    </>
  )
};
ListFilters.displayName = "FilterBar";
