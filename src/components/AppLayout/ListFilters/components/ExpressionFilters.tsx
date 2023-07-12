import { ConditionalProductFilters } from "@dashboard/components/ConditionalFilter";
import { Box, Button, Popover } from "@saleor/macaw-ui/next";
import React from "react";

export const ExpressionFilters = () => (
  <Popover>
    <Popover.Trigger>
      <Button>Show filters</Button>
    </Popover.Trigger>
    <Popover.Content align="start">
      <Box __minWidth="200px" __minHeight="100px" paddingX={4} paddingY={3}>
        <Popover.Arrow />
        <ConditionalProductFilters />
      </Box>
    </Popover.Content>
  </Popover>
);
