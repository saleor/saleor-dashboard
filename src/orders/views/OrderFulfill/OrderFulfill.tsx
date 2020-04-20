import React from "react";

import { useOrderFulfillData } from "@saleor/orders/queries";
import OrderFulfillPage from "@saleor/orders/components/OrderFulfillPage";
import useNavigator from "@saleor/hooks/useNavigator";
import { orderUrl } from "@saleor/orders/urls";
import { useWarehouseList } from "@saleor/warehouses/queries";

export interface OrderFulfillProps {
  orderId: string;
}

const OrderFulfill: React.FC<OrderFulfillProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const { data, loading } = useOrderFulfillData({
    displayLoader: true,
    variables: {
      orderId
    }
  });
  const { data: warehouseData, loading: warehousesLoading } = useWarehouseList({
    displayLoader: true,
    variables: {
      first: 20
    }
  });

  return (
    <OrderFulfillPage
      disabled={loading || warehousesLoading}
      onBack={() => navigate(orderUrl(orderId))}
      onSubmit={() => undefined}
      order={data?.order}
      saveButtonBar="default"
      warehouses={warehouseData?.warehouses.edges.map(edge => edge.node)}
    />
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
