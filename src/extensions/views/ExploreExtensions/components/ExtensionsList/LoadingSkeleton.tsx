import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

export const LoadingSkeleton = () => {
  return (
    <Box data-test-id="extensions-loading-skeleton">
      {Array.from({ length: 4 }).map((_, i) => (
        <Box marginBottom={20} key={i}>
          <Box marginBottom={8}>
            <Skeleton __width="200px" />
          </Box>

          <Box display="grid" __gridTemplateColumns="repeat(auto-fill, minmax(375px, 1fr))" gap={6}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
