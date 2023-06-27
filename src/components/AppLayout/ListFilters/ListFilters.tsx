import { ConditionalFilters } from "@dashboard/components/ConditionalFilter";
import { FilterErrorMessages } from "@dashboard/components/Filter";
import { Box, Button, Popover } from "@saleor/macaw-ui/next";
import React, { ReactNode } from "react";

import SearchInput from "./components/SearchInput";

export interface ListFiltersProps<TKeys extends string = string> {
  searchPlaceholder: string;
  errorMessages?: FilterErrorMessages<TKeys>;
  actions?: ReactNode;
}

const STATIC_CONDITIONS = {
  category: [{ value: "combobox", label: "is" }],
  price: [
    { value: "input", label: "is" },
    { value: "range", label: "between" },
  ],
  discount: [
    { value: "input", label: "is" },
    { value: "range", label: "between" },
  ],
  rating: [{ value: "combobox", label: "is" }],
};

export const ListFilters = ({
  searchPlaceholder,
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
        <Popover>
          <Popover.Trigger>
            <Button>Show filters</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Box
              __minWidth="200px"
              __minHeight="100px"
              paddingX={4}
              paddingY={3}
            >
              <Popover.Arrow />
              <ConditionalFilters />
            </Box>
          </Popover.Content>
        </Popover>
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
);
ListFilters.displayName = "FilterBar";
