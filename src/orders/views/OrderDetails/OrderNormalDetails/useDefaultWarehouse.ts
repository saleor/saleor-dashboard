import { OrderDetailsFragment, WarehouseFragment } from "@saleor/graphql";
import {
  getToFulfillOrderLines,
  isLineAvailableInWarehouse,
} from "@saleor/orders/utils/data";
import React from "react";

export interface UseDefaultWarehouseOpts {
  warehouses: WarehouseFragment[];
  order: OrderDetailsFragment;
  setter: React.Dispatch<React.SetStateAction<WarehouseFragment>>;
}

interface WarehousesAvailibility {
  warehouse: WarehouseFragment;
  linesAvailable: number;
}

export function useDefaultWarehouse(
  { warehouses, order, setter }: UseDefaultWarehouseOpts,
  deps: unknown[],
) {
  React.useEffect(() => {
    const warehousesAvailability: WarehousesAvailibility[] = warehouses?.map(
      warehouse => {
        if (!order?.lines) {
          return undefined;
        }
        const linesToFulfill = getToFulfillOrderLines(order.lines);

        const linesAvailable = linesToFulfill.filter(line =>
          isLineAvailableInWarehouse(line, warehouse),
        ).length;

        return {
          warehouse,
          linesAvailable,
        };
      },
    );
    const defaultWarehouse = order?.lines
      ? warehousesAvailability?.reduce((prev, curr) =>
          curr.linesAvailable > prev.linesAvailable ? curr : prev,
        ).warehouse
      : undefined;
    setter(defaultWarehouse);
  }, [order, ...deps]);
}
