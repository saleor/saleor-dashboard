import {
  conditionalFilterMessages,
  ConditionalFilters,
  useConditionalFilterContext,
} from "@dashboard/components/ConditionalFilter";
import { Box, Button, CloseIcon, DropdownButton, Popover, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export const ExpressionFilters = () => {
  const { formatMessage } = useIntl();
  const { valueProvider, containerState, filterWindow } = useConditionalFilterContext();
  const clickOutside = () => {
    containerState.clearEmpty();
  };

  return (
    <Popover open={filterWindow.isOpen} onOpenChange={open => filterWindow.setOpen(open)}>
      <Popover.Trigger>
        <DropdownButton data-test-id="filters-button">
          {formatMessage(conditionalFilterMessages.popoverTrigger, {
            count: valueProvider.count,
          })}
        </DropdownButton>
      </Popover.Trigger>
      <Popover.Content align="start" onInteractOutside={clickOutside}>
        <Box __minHeight="250px" __minWidth="636px" display="grid" __gridTemplateRows="auto 1fr">
          <Popover.Arrow fill="default1" />
          <Box
            paddingTop={3}
            paddingX={3}
            paddingBottom={1.5}
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="default1"
            borderTopLeftRadius={2}
            borderTopRightRadius={2}
          >
            <Text>{formatMessage(conditionalFilterMessages.popoverTitle)}</Text>
            <Box display="flex" alignItems="center" gap={2}>
              <Popover.Close>
                <Button variant="tertiary" icon={<CloseIcon />} />
              </Popover.Close>
            </Box>
          </Box>
          <ConditionalFilters onClose={() => filterWindow.setOpen(false)} />
        </Box>
      </Popover.Content>
    </Popover>
  );
};
