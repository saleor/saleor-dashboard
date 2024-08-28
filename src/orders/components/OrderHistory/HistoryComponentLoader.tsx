import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

export const HistoryComponentLoader = () => (
  <Box>
    <Skeleton __height="32px" __marginBottom="20px" />
    <Skeleton __height="16px" __marginBottom="18px" />
    <Skeleton __height="20px" __marginBottom="18px" />
    <Skeleton __height="16px" __marginBottom="18px" />
  </Box>
);
