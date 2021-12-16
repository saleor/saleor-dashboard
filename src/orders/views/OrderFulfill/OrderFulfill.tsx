import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { extractMutationErrors } from "@saleor/misc";
import OrderFulfillPage from "@saleor/orders/components/OrderFulfillPage";
import { useOrderFulfill } from "@saleor/orders/mutations";
import {
  useOrderFulfillData,
  useOrderFulfillSettingsQuery
} from "@saleor/orders/queries";
import { OrderFulfillData_order } from "@saleor/orders/types/OrderFulfillData";
import { orderUrl } from "@saleor/orders/urls";
import { getWarehousesFromOrderLines } from "@saleor/orders/utils/data";
import React from "react";
import { useIntl } from "react-intl";

import { WarehouseClickAndCollectOptionEnum } from "../../../types/globalTypes";

export interface OrderFulfillProps {
  orderId: string;
}

const resolveLocalFulfillment = (
  order: OrderFulfillData_order,
  orderLineWarehouses
) => {
  const deliveryMethod = order?.deliveryMethod;
  if (
    deliveryMethod?.__typename === "Warehouse" &&
    deliveryMethod?.clickAndCollectOption ===
      WarehouseClickAndCollectOptionEnum.LOCAL
  ) {
    return orderLineWarehouses?.filter(
      warehouse => warehouse?.id === deliveryMethod?.id
    );
  }
  return orderLineWarehouses;
};

const OrderFulfill: React.FC<OrderFulfillProps> = ({ orderId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const {
    data: settings,
    loading: settingsLoading
  } = useOrderFulfillSettingsQuery({});

  const { data, loading } = useOrderFulfillData({
    displayLoader: true,
    variables: {
      orderId
    }
  });

  const orderLinesWarehouses = getWarehousesFromOrderLines(data?.order?.lines);

  const [fulfillOrder, fulfillOrderOpts] = useOrderFulfill({
    onCompleted: data => {
      if (data.orderFulfill.errors.length === 0) {
        navigate(orderUrl(orderId), { replace: true });
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

  const resolvedOrderLinesWarehouses = resolveLocalFulfillment(
    data?.order,
    orderLinesWarehouses
  );

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
        loading={loading || settingsLoading || fulfillOrderOpts.loading}
        errors={fulfillOrderOpts.data?.orderFulfill.errors}
        onBack={() => navigate(orderUrl(orderId))}
        onSubmit={formData =>
          extractMutationErrors(
            fulfillOrder({
              variables: {
                input: {
                  lines: formData.items.map(line => ({
                    orderLineId: line.id,
                    stocks: line.value
                  })),
                  notifyCustomer:
                    settings?.shop?.fulfillmentAutoApprove && formData.sendInfo
                },
                orderId
              }
            })
          )
        }
        order={data?.order}
        saveButtonBar="default"
        warehouses={resolvedOrderLinesWarehouses}
        shopSettings={settings?.shop}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
