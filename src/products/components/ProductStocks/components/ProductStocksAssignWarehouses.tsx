import TableRowLink from "@dashboard/components/TableRowLink";
import { WarehouseFragment } from "@dashboard/graphql";
import useDebounce from "@dashboard/hooks/useDebounce";
import { TableCell } from "@material-ui/core";
import {
  Box,
  Button,
  Dropdown,
  List,
  PlusIcon,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui-next";
import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

interface ProductStocksAssignWarehousesProps {
  warehousesToAssign: WarehouseFragment[];
  hasMoreWarehouses: boolean;
  hasWarehousesLoading: boolean;
  loadMoreWarehouses: () => void;
  onWarehouseSelect: (warehouseId: string, warehouseName: string) => void;
}

const SCROLL_THRESHOLD = 500;

export const ProductStocksAssignWarehouses = ({
  hasMoreWarehouses,
  hasWarehousesLoading,
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
        <TableRowLink className={sprinkles({ cursor: "pointer" })}>
          <TableCell colSpan={3} style={{ paddingLeft: vars.spacing[6] }}>
            <Text>
              <FormattedMessage {...messages.assignWarehouse} />
            </Text>
          </TableCell>
          <TableCell style={{ paddingRight: vars.spacing[6] }}>
            <Button type="button" icon={<PlusIcon />} variant="secondary" />
          </TableCell>
        </TableRowLink>
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
            {hasWarehousesLoading && (
              <Dropdown.Item key="loading">
                <List.Item paddingX={1.5} paddingY={2} borderRadius={4}>
                  <Text>
                    <FormattedMessage id="gjBiyj" defaultMessage="Loading..." />
                  </Text>
                </List.Item>
              </Dropdown.Item>
            )}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};
