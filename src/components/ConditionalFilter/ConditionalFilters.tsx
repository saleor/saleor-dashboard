import {
  _ExperimentalFilters,
  Box,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";
import { FiltersArea } from "./FIltersArea";
import { FilterValueProvider } from "./FilterValueProvider";
import { FilterContainer } from "./FilterElement";

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