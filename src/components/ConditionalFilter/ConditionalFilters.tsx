import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";
import { FilterValueProvider } from "./FilterValueProvider";

interface ConditionalFiltersProps {
  provider: FilterValueProvider
  onConfirm: (value: FilterContainer) => void
}

export const ConditionalFilters = ({ provider, onConfirm }: ConditionalFiltersProps) => {
  const handleConfirm = (value: FilterContainer) => {
    provider.persist(value)
    onConfirm(value)
  }

  return (
    <Box>
      {provider.loading ? (
        <Text>Loading...</Text>
      ) : (
        <FiltersArea filterValue={provider.value} onConfirm={handleConfirm} />
      )}
    </Box>
  );
};