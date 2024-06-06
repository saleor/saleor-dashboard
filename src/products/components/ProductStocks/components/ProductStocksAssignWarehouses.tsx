import { WarehouseFragment } from "@dashboard/graphql";
import { useInfinityScroll } from "@dashboard/hooks/useInfinityScroll";
import { Box, Button, Dropdown, List, Spinner, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

interface ProductStocksAssignWarehousesProps {
  warehousesToAssign: WarehouseFragment[];
  hasMoreWarehouses: boolean;
  loadMoreWarehouses: () => void;
  onWarehouseSelect: (warehouseId: string, warehouseName: string) => void;
}

export const ProductStocksAssignWarehouses = ({
  hasMoreWarehouses,
  loadMoreWarehouses,
  onWarehouseSelect,
  warehousesToAssign,
}: ProductStocksAssignWarehousesProps) => {
  useEffect(() => {
    // In case there is no more warehouses to assign, load more warehouses
    // Example: from first page all warehouse has been already assigned, so we need to load more warehouses to assign
    if (hasMoreWarehouses && !warehousesToAssign.length) {
      loadMoreWarehouses();
    }
  }, [hasMoreWarehouses, warehousesToAssign.length]);

  const handleOnScroll = () => {
    if (hasMoreWarehouses) {
      loadMoreWarehouses();
    }
  };

  const { onScroll, setScrollRef } = useInfinityScroll<HTMLUListElement>({
    loadOnInit: true,
    onLoadMore: handleOnScroll,
    threshold: 1000,
  });

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <Button
          type="button"
          variant="secondary"
          marginTop={5}
          data-test-id="assign-warehouse-button"
        >
          <FormattedMessage {...messages.assignWarehouse} />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Box>
          <List
            ref={setScrollRef}
            id="warehouse-list"
            padding={2}
            borderRadius={4}
            boxShadow="defaultOverlay"
            backgroundColor="default1"
            __maxHeight={400}
            overflowY="auto"
            onScroll={onScroll}
          >
            {warehousesToAssign.map(warehouse => (
              <Dropdown.Item key={warehouse.id}>
                <List.Item
                  paddingX={1.5}
                  paddingY={2}
                  borderRadius={4}
                  onClick={() => onWarehouseSelect(warehouse.id, warehouse.name)}
                >
                  <Text>{warehouse.name}</Text>
                </List.Item>
              </Dropdown.Item>
            ))}
            {hasMoreWarehouses && (
              <Dropdown.Item>
                <List.Item
                  paddingX={1.5}
                  paddingY={2}
                  borderRadius={4}
                  display="flex"
                  justifyContent="center"
                >
                  <Spinner />
                </List.Item>
              </Dropdown.Item>
            )}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};
