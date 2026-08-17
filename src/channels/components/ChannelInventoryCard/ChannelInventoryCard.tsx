import { type ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { AllocationStrategyEnum, type StockSettingsInput } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { type ReorderAction } from "@dashboard/types";
import { Box, Button, RadioGroup, Text } from "@saleor/macaw-ui-next";
import { Warehouse } from "lucide-react";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SortableContainer from "../AssignmentList/SortableContainer";
import styles from "./ChannelInventoryCard.module.css";
import { ChannelInventoryWarehouseRow } from "./ChannelInventoryWarehouseRow";
import { messages } from "./messages";

interface ChannelInventoryCardProps {
  warehouses: ChannelWarehouses;
  removeWarehouse: (id: string) => void;
  reorderWarehouses: ReorderAction;
  disabled: boolean;
  /** Total warehouses in the shop (for assign vs create). */
  availableWarehousesCount: number;
  canCreateWarehouse: boolean;
  onAssignWarehouse?: () => void;
  onCreateWarehouse?: () => void;
  allocationStrategy?: StockSettingsInput["allocationStrategy"];
  onAllocationStrategyChange: (event: ChangeEvent) => void;
}

export const ChannelInventoryCard = ({
  warehouses,
  removeWarehouse,
  reorderWarehouses,
  disabled,
  availableWarehousesCount,
  canCreateWarehouse,
  onAssignWarehouse,
  onCreateWarehouse,
  allocationStrategy,
  onAllocationStrategyChange,
}: ChannelInventoryCardProps): ReactNode => {
  const intl = useIntl();
  const hasWarehouses = warehouses.length > 0;
  const hasUnassigned = availableWarehousesCount > warehouses.length;
  const allocationValue = allocationStrategy ?? AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER;

  const handleSortStart = (): void => {
    document.body.classList.add(styles.grabbing);
  };

  const handleSortEnd = (event: Parameters<ReorderAction>[0]): void => {
    document.body.classList.remove(styles.grabbing);
    reorderWarehouses(event);
  };

  const assignAction = (() => {
    // Secondary in the sidebar cards — setup checklist keeps primary for the main funnel.
    // Stay visible while saving; only disable so the layout doesn't jump.
    if (hasUnassigned && onAssignWarehouse && canCreateWarehouse && onCreateWarehouse) {
      return (
        <ButtonGroupWithDropdown
          variant="secondary"
          onClick={onAssignWarehouse}
          testId="inventory-assign-warehouse"
          disabled={disabled}
          options={[
            {
              label: intl.formatMessage(messages.createWarehouse),
              testId: "inventory-create-warehouse",
              onSelect: onCreateWarehouse,
            },
          ]}
        >
          <FormattedMessage {...messages.assignWarehouse} />
        </ButtonGroupWithDropdown>
      );
    }

    if (hasUnassigned && onAssignWarehouse) {
      return (
        <Button
          variant="secondary"
          type="button"
          data-test-id="inventory-assign-warehouse"
          onClick={onAssignWarehouse}
          disabled={disabled}
        >
          <FormattedMessage {...messages.assignWarehouse} />
        </Button>
      );
    }

    if (canCreateWarehouse && onCreateWarehouse) {
      return (
        <Button
          variant="secondary"
          type="button"
          data-test-id="inventory-create-warehouse"
          onClick={onCreateWarehouse}
          disabled={disabled}
        >
          <FormattedMessage {...messages.createWarehouse} />
        </Button>
      );
    }

    return null;
  })();

  return (
    <Box className={styles.card} data-test-id="channel-inventory-card">
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2">
          <FormattedMessage {...messages.title} />
        </Text>
        <Text size={2} color="default2">
          {hasWarehouses ? (
            <FormattedMessage {...messages.assignedCount} values={{ count: warehouses.length }} />
          ) : (
            <FormattedMessage {...messages.requiredToSell} />
          )}
        </Text>
      </Box>

      <Box className={styles.intro}>
        <Text size={3} color="default2">
          <FormattedMessage {...messages.description} />
        </Text>
      </Box>

      {!hasWarehouses ? (
        <Box className={styles.emptyState}>
          <Box className={styles.emptyLeading}>
            <Box className={styles.emptyIcon} aria-hidden>
              <Warehouse size={iconSize.small} strokeWidth={iconStrokeWidth} />
            </Box>
            <Box className={styles.emptyCopy}>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.emptyTitle} />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.emptyDescription} />
              </Text>
            </Box>
          </Box>
          {assignAction ? <Box className={styles.emptyAction}>{assignAction}</Box> : null}
        </Box>
      ) : (
        <>
          {/* @ts-expect-error legacy sortable types */}
          <SortableContainer
            axis="y"
            lockAxis="y"
            useDragHandle
            shouldCancelStart={() => disabled}
            onSortStart={handleSortStart}
            onSortEnd={handleSortEnd}
          >
            <div className={disabled ? `${styles.list} ${styles.listDisabled}` : styles.list}>
              {warehouses.map((warehouse, index) => (
                <ChannelInventoryWarehouseRow
                  key={warehouse.id}
                  index={index}
                  // @ts-expect-error legacy sortable types
                  id={warehouse.id}
                  name={warehouse.name}
                  position={index + 1}
                  onDelete={removeWarehouse}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContainer>
          <Box className={styles.listFooter}>
            <Text size={2} color="default2">
              <FormattedMessage {...messages.reorderHint} />
            </Text>
            {assignAction ? <Box className={styles.actions}>{assignAction}</Box> : null}
          </Box>
        </>
      )}

      <Box className={styles.allocation}>
        <Box className={styles.allocationCopy}>
          <Text size={3} fontWeight="medium">
            <FormattedMessage {...messages.allocationTitle} />
          </Text>
          <Text size={2} color="default2">
            {warehouses.length > 1 ? (
              <FormattedMessage {...messages.allocationDescription} />
            ) : (
              <FormattedMessage {...messages.allocationDescriptionWaiting} />
            )}
          </Text>
        </Box>
        <RadioGroup
          name="allocationStrategy"
          value={allocationValue}
          disabled={disabled}
          onValueChange={next => {
            // Ignore no-op updates (e.g. when the group enables after load) so
            // we don't mark the channel form dirty before the user edits.
            if (next === allocationValue) {
              return;
            }

            onAllocationStrategyChange({
              target: {
                name: "allocationStrategy",
                value: next,
              },
            });
          }}
          className={styles.allocationOptions}
          size="small"
          data-test-id="channel-inventory-allocation"
        >
          <RadioGroup.Item
            value={AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER}
            id="allocation-sort-order"
            disabled={disabled}
            alignItems="flex-start"
            className={`simple-radio-group ${styles.optionItem}`}
            data-test-id="allocation-prioritize-sorting-order"
          >
            <Box className={styles.optionCopy}>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.followListOrder} />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.followListOrderDescription} />
              </Text>
            </Box>
          </RadioGroup.Item>
          <RadioGroup.Item
            value={AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK}
            id="allocation-high-stock"
            disabled={disabled}
            alignItems="flex-start"
            className={`simple-radio-group ${styles.optionItem}`}
            data-test-id="allocation-prioritize-high-stock"
          >
            <Box className={styles.optionCopy}>
              <Text size={3} fontWeight="medium">
                <FormattedMessage {...messages.highestStockFirst} />
              </Text>
              <Text size={2} color="default2">
                <FormattedMessage {...messages.highestStockFirstDescription} />
              </Text>
            </Box>
          </RadioGroup.Item>
        </RadioGroup>
      </Box>
    </Box>
  );
};
