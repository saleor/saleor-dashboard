import { TopNav } from "@dashboard/components/AppLayout";
import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { FilterPresetsProps } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface OrderDraftListHeaderProps extends FilterPresetsProps {
  limits: RefreshLimitsQuery["shop"]["limits"];
  isFilterPresetOpen: boolean;
  disabled: boolean;
  onAdd: () => void;
  setFilterPresetOpen: (open: boolean) => void;
}

export const OrderDraftListHeader = ({
  hasPresetsChanged,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetUpdate,
  onFilterPresetPresetSave,
  filterPresets,
  selectedFilterPreset,
  onFilterPresetsAll,
  isFilterPresetOpen,
  setFilterPresetOpen,
  disabled,
  limits,
  onAdd,
}: OrderDraftListHeaderProps) => {
  const intl = useIntl();
  const limitsReached = isLimitReached(limits, "orders");

  return (
    <TopNav
      title={intl.formatMessage(sectionNames.draftOrders)}
      withoutBorder
      isAlignToRight={false}
    >
      <Box
        __flex={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex">
          <Box marginX={3} display="flex" alignItems="center">
            <ChevronRightIcon />
          </Box>

          <FilterPresetsSelect
            presetsChanged={hasPresetsChanged()}
            onSelect={onFilterPresetChange}
            onRemove={onFilterPresetDelete}
            onUpdate={onFilterPresetUpdate}
            savedPresets={filterPresets}
            activePreset={selectedFilterPreset}
            onSelectAll={onFilterPresetsAll}
            onSave={onFilterPresetPresetSave}
            isOpen={isFilterPresetOpen}
            onOpenChange={setFilterPresetOpen}
            selectAllLabel={intl.formatMessage({
              id: "nJ0tek",
              defaultMessage: "All draft orders",
              description: "tab name",
            })}
          />
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="primary"
            disabled={disabled || limitsReached}
            onClick={onAdd}
            data-test-id="create-draft-order-button"
          >
            <FormattedMessage
              id="LshEVn"
              defaultMessage="Create order"
              description="button"
            />
          </Button>

          {hasLimits(limits, "orders") && (
            <LimitsInfo
              text={intl.formatMessage(
                {
                  id: "w2eTzO",
                  defaultMessage: "{count}/{max} orders",
                  description: "placed orders counter",
                },
                {
                  count: limits.currentUsage.orders,
                  max: limits.allowedUsage.orders,
                },
              )}
            />
          )}
        </Box>
      </Box>
    </TopNav>
  );
};
