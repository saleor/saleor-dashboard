import { _ExperimentalFilters, Box, Divider } from "@saleor/macaw-ui/next";
import React, { FC } from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";

export const ConditionalFilters: FC = () => {
  const { valueProvider } = useConditionalFilterContext();

  const handleConfirm = (value: FilterContainer) => {
    valueProvider.persist(value);
  };

  return (
    <Box>
      {valueProvider.loading ? (
        <Box
          __minWidth="700px"
          __minHeight="100px"
          paddingX={5}
          paddingY={4}
          display="flex"
          gap={3}
          flexDirection="column"
        >
          <_ExperimentalFilters.Skeleton height={7} />
          <_ExperimentalFilters.Skeleton height={7} />
          <_ExperimentalFilters.Skeleton height={7} />
          <Divider />
          <Box display="flex" gap={4} justifyContent="space-between">
            <_ExperimentalFilters.Skeleton height={7} __width="20%" />
            <_ExperimentalFilters.Skeleton height={7} __width="20%" />
          </Box>
        </Box>
      ) : (
        <FiltersArea onConfirm={handleConfirm} />
      )}
    </Box>
  );
};
