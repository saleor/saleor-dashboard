import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import OrderFulfillPage from "@saleor/orders/components/OrderFulfillPage";
import OrderFulfillStockExceededDialog from "@saleor/orders/components/OrderFulfillStockExceededDialog";
import { useOrderFulfill } from "@saleor/orders/mutations";
import { useOrderFulfillData } from "@saleor/orders/queries";
import { orderUrl } from "@saleor/orders/urls";
import { mapEdgesToItems } from "@saleor/utils/maps";
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

  const [
    displayStockExceededDialog,
    setDisplayStockExceededDialog
  ] = React.useState(false);

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
      // eslint-disable-next-line no-console
      console.log(data.orderFulfill.errors);
    }
  });

  React.useEffect(() => {
    setDisplayStockExceededDialog(
      fulfillOrderOpts.data?.orderFulfill.errors?.every(
        err => err.code === "INSUFFICIENT_STOCK"
      )
    );
  }, [fulfillOrderOpts.data]);

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
                notifyCustomer: formData.sendInfo,
                allowStockToBeExceeded: formData.allowStockToBeExceeded
              },
              orderId
            }
          })
        }
        order={data?.order}
        saveButtonBar="default"
        warehouses={mapEdgesToItems(warehouseData?.warehouses)}
      />
      <OrderFulfillStockExceededDialog
        lines={data?.order.lines}
        errors={fulfillOrderOpts.data?.orderFulfill.errors}
        open={displayStockExceededDialog}
        onClose={() => setDisplayStockExceededDialog(false)}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
