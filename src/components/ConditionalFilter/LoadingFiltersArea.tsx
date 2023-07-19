import { _ExperimentalFilters, Box, Divider } from "@saleor/macaw-ui/next";
import React from "react";

export const LoadingFiltersArea = () => (
  <Box
    padding={3}
    backgroundColor="interactiveNeutralSecondaryHovering"
    borderBottomLeftRadius={2}
    borderBottomRightRadius={2}
    display="flex"
    flexDirection="column"
  >
    <Box display="flex" flexDirection="column" gap={3} height="100%">
      <_ExperimentalFilters.Skeleton height={7} />
      <_ExperimentalFilters.Skeleton height={7} />
      <_ExperimentalFilters.Skeleton height={7} />
    </Box>
    <Divider />
    <Box display="flex" gap={4} justifyContent="space-between">
      <_ExperimentalFilters.Skeleton height={7} __width="60px" />
      <Box display="flex" gap={3}>
        <_ExperimentalFilters.Skeleton height={7} __width="60px" />
        <_ExperimentalFilters.Skeleton height={7} __width="60px" />
      </Box>
    </Box>
  </Box>
);
