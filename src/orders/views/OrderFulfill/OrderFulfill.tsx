import { useIntl } from "react-intl";
import React from "react";

import { useOrderFulfillData } from "@saleor/orders/queries";
import OrderFulfillPage from "@saleor/orders/components/OrderFulfillPage";
import useNavigator from "@saleor/hooks/useNavigator";
import { orderUrl } from "@saleor/orders/urls";
import { useWarehouseList } from "@saleor/warehouses/queries";
import { WindowTitle } from "@saleor/components/WindowTitle";

export interface OrderFulfillProps {
  orderId: string;
}

const OrderFulfill: React.FC<OrderFulfillProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const intl = useIntl();
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
    <>
      <WindowTitle
        title={
          data?.order?.number
            ? intl.formatMessage(
                {
                  defaultMessage: "Fulfill Order #{orderNumber}",
                  description: "window title"
                },
                {
                  orderNumber: data.order.number
                }
              )
            : intl.formatMessage({
                defaultMessage: "Fulfill Order",
                description: "window title"
              })
        }
      />
      <OrderFulfillPage
        disabled={loading || warehousesLoading}
        onBack={() => navigate(orderUrl(orderId))}
        onSubmit={() => undefined}
        order={data?.order}
        saveButtonBar="default"
        warehouses={warehouseData?.warehouses.edges.map(edge => edge.node)}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
