import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { useConditionalFilterContext } from "./context";
import { FilterContainer } from "./FilterElement";
import { FiltersArea } from "./FiltersArea";

interface ConditionalFiltersProps {
  onConfirm: (value: FilterContainer) => void;
}

export const ConditionalFilters = ({ onConfirm }: ConditionalFiltersProps) => {
  const { valueProvider } = useConditionalFilterContext();

  const handleConfirm = (value: FilterContainer) => {
    valueProvider.persist(value);
    // valueProvider.navigate(value);
    onConfirm(value);
  };

  // const handleClear = () => {
  // valueProvider.clear();
  // }

  return (
    <Box>
      {valueProvider.loading ? (
        <Text>Loading...</Text>
      ) : (
        <FiltersArea
          filterValue={valueProvider.value}
          onConfirm={handleConfirm}
        />
      )}
    </Box>
  );
};
