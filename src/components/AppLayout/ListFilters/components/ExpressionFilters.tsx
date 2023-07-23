import { ConditionalFilters } from "@dashboard/components/ConditionalFilter";
import { Box, Button, CloseIcon, Popover, Text } from "@saleor/macaw-ui/next";
import React from "react";

export const ExpressionFilters = () => (
  <Popover>
    <Popover.Trigger>
      <Button>Show filters</Button>
    </Popover.Trigger>
    <Popover.Content align="start">
      <Box
        __minHeight="250px"
        __minWidth="636px"
        display="grid"
        __gridTemplateRows="auto 1fr"
      >
        <Box
          paddingTop={3}
          paddingX={3}
          paddingBottom={1.5}
          display="flex"
          gap={1}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="surfaceNeutralPlain"
          borderTopLeftRadius={2}
          borderTopRightRadius={2}
        >
          <Text variant="body" size="medium">
            Conditions
          </Text>
          <Box display="flex" alignItems="center" gap={2}>
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
