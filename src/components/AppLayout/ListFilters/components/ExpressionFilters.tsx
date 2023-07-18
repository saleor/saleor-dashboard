import { ConditionalFilters } from "@dashboard/components/ConditionalFilter";
import { Box, Button, CloseIcon, Popover, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const ExpressionFilters = () => (
  <Popover>
    <Popover.Trigger>
      <Button>Show filters</Button>
    </Popover.Trigger>
    <Popover.Content align="start">
      <Box>
        <Box
          paddingX={5}
          paddingY={4}
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="surfaceNeutralPlain"
        >
          <Text variant="body" size="medium">
            Filter conditions
          </Text>
          <Box display="flex" alignItems="center" gap={2}>
            <Button variant="tertiary">Clear filters</Button>
            <Popover.Close>
              <Button variant="tertiary" icon={<CloseIcon />} />
            </Popover.Close>
          </Box>
        </Box>
        <ConditionalFilters />
      </Box>
    </Popover.Content>
  </Popover>
);
