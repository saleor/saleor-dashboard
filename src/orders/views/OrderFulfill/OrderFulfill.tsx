import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import OrderFulfillPage from "@saleor/orders/components/OrderFulfillPage";
import { useOrderFulfill } from "@saleor/orders/mutations";
import { useOrderFulfillData } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
import { useWarehouseList } from "@saleor/warehouses/queries";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderFulfillProps {
  orderId: string;
}

const OrderFulfill: React.FC<OrderFulfillProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
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

  const [fulfillOrder, fulfillOrderOpts] = useOrderFulfill({
    onCompleted: data => {
      if (data.orderFulfill.errors.length === 0) {
        navigate(orderUrl(orderId), true);
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "Fulfilled Items",
            description: "order fulfilled success message"
          })
        });
      }
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
        loading={loading || warehousesLoading || fulfillOrderOpts.loading}
        errors={fulfillOrderOpts.data?.orderFulfill.errors}
        onBack={() => navigate(orderUrl(orderId))}
        onSubmit={formData =>
          fulfillOrder({
            variables: {
              input: {
                lines: formData.items.map(line => ({
                  orderLineId: line.id,
                  stocks: line.value
                })),
                notifyCustomer: formData.sendInfo
              },
              orderId
            }
          })
        }
        order={data?.order}
        saveButtonBar="default"
        warehouses={warehouseData?.warehouses.edges.map(edge => edge.node)}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
