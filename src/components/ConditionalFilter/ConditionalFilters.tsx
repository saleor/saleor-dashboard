import { Box, Text } from "@saleor/macaw-ui/next";
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
        <Text>Loading...</Text>
      ) : (
        <FiltersArea onConfirm={handleConfirm} />
      )}
    </Box>
  );
};
