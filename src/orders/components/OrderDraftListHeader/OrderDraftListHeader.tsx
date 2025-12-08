import { useUserAccessibleChannels } from "@dashboard/auth/hooks/useUserAccessibleChannels";
import { TopNav } from "@dashboard/components/AppLayout";
import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForDraftOrderOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { FilterPresetsProps } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Box, Button, Tooltip } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";

interface OrderDraftListHeaderProps extends FilterPresetsProps {
  limits: RefreshLimitsQuery["shop"]["limits"];
  isFilterPresetOpen: boolean;
  disabled: boolean;
  onAdd: () => void;
  setFilterPresetOpen: (open: boolean) => void;
  selectedOrderDraftIds: string[];
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
  selectedOrderDraftIds,
}: OrderDraftListHeaderProps) => {
  const intl = useIntl();
  const userAccessibleChannels = useUserAccessibleChannels();
  const hasAccessibleChannels = userAccessibleChannels.length > 0;
  const limitsReached = isLimitReached(limits, "orders");

  const { DRAFT_ORDER_OVERVIEW_CREATE, DRAFT_ORDER_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.DRAFT_ORDER_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForDraftOrderOverviewActions(
    DRAFT_ORDER_OVERVIEW_MORE_ACTIONS,
    selectedOrderDraftIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(
    DRAFT_ORDER_OVERVIEW_CREATE,
  );

  return (
    <TopNav
      title={intl.formatMessage(sectionNames.draftOrders)}
      withoutBorder
      isAlignToRight={false}
    >
      <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex">
          <Box marginX={3} display="flex" alignItems="center">
            <ChevronRight />
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
          {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}

          <Tooltip>
            <Tooltip.Trigger>
              {extensionCreateButtonItems.length > 0 ? (
                <ButtonGroupWithDropdown
                  options={extensionCreateButtonItems}
                  data-test-id="create-draft-order-button"
                  disabled={disabled || limitsReached || !hasAccessibleChannels}
                  onClick={onAdd}
                >
                  <FormattedMessage
                    id="LshEVn"
                    defaultMessage="Create order"
                    description="button"
                  />
                </ButtonGroupWithDropdown>
              ) : (
                <Button
                  data-test-id="create-draft-order-button"
                  disabled={disabled || limitsReached || !hasAccessibleChannels}
                  onClick={onAdd}
                >
                  <FormattedMessage
                    id="LshEVn"
                    defaultMessage="Create order"
                    description="button"
                  />
                </Button>
              )}
            </Tooltip.Trigger>
            <Tooltip.Content>
              {!hasAccessibleChannels && (
                <FormattedMessage
                  defaultMessage="You don't have access to any channels"
                  id="grkY2V"
                />
              )}
            </Tooltip.Content>
          </Tooltip>

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
