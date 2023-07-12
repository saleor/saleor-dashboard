import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { FilterAPIProvider } from "./API/FilterAPIProvider";
import { FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";
import { FilterValueProvider } from "./FilterValueProvider";
import { LeftOperandsProvider } from "./LeftOperandsProvider";

interface ConditionalFiltersProps {
  valueProvider: FilterValueProvider
  apiProvider: FilterAPIProvider
  leftOperandsProvider: LeftOperandsProvider
  onConfirm: (value: FilterContainer) => void
}

export const ConditionalFilters = ({ valueProvider, apiProvider, leftOperandsProvider, onConfirm }: ConditionalFiltersProps) => {
  const handleConfirm = (value: FilterContainer) => {
    valueProvider.persist(value)
    onConfirm(value)
  }

  return (
    <Box>
      {valueProvider.loading ? (
        <Text>Loading...</Text>
      ) : (
        <FiltersArea
          apiProvider={apiProvider}
          leftOperandsProvider={leftOperandsProvider}
          filterValue={valueProvider.value}
          onConfirm={handleConfirm}
        />
      )}
    </Box>
  );
};