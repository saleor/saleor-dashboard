import { Box } from "@saleor/macaw-ui/next";
import React, { FC } from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";
import { LoadingFiltersArea } from "./LoadingFiltersArea";

export const ConditionalFilters: FC = () => {
  const { valueProvider } = useConditionalFilterContext();

  const handleConfirm = (value: FilterContainer) => {
    valueProvider.persist(value);
  };

  return valueProvider.loading ? (
    <LoadingFiltersArea />
  ) : (
    <Box
      padding={3}
      backgroundColor="interactiveNeutralSecondaryHovering"
      borderBottomLeftRadius={2}
      borderBottomRightRadius={2}
    >
      <FiltersArea onConfirm={handleConfirm} />
    </Box>
  );
};
