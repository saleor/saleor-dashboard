import { WarehouseFragment } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { Box, Button, Dropdown, List, Spinner, Text } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

interface ProductStocksAssignWarehousesProps {
  warehousesToAssign: WarehouseFragment[];
  hasMoreWarehouses: boolean;
  loadMoreWarehouses: () => void;
  onWarehouseSelect: (warehouseId: string, warehouseName: string) => void;
}

const SCROLL_THRESHOLD = 1000;

export const ProductStocksAssignWarehouses = ({
  hasMoreWarehouses,
  loadMoreWarehouses,
  onWarehouseSelect,
  warehousesToAssign,
}: ProductStocksAssignWarehousesProps) => {
  const warehousesListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (hasMoreWarehouses && !warehousesToAssign.length) {
      loadMoreWarehouses();
    }
  }, [hasMoreWarehouses, warehousesToAssign.length]);

  const handleInfiniteScroll = () => {
    if (!warehousesListRef.current) {
      return;
    }

    const scrollHeight = warehousesListRef.current.scrollHeight;
    const scrollTop = warehousesListRef.current.scrollTop;
    const clientHeight = warehousesListRef.current.clientHeight;
    const scrollBottom = scrollHeight - (scrollTop + clientHeight);

    if (scrollBottom < SCROLL_THRESHOLD && hasMoreWarehouses) {
      loadMoreWarehouses();
    }
  };

  const debouncedHandleInfiniteScroll = useDebounce(handleInfiniteScroll, 500);

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
            ref={warehousesListRef}
            id="warehouse-list"
            padding={2}
            borderRadius={4}
            boxShadow="defaultOverlay"
            backgroundColor="default1"
            __maxHeight={400}
            overflowY="auto"
            onScroll={debouncedHandleInfiniteScroll}
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
                <List.Item paddingX={1.5} paddingY={2} borderRadius={4}>
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
