import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useFulfillOrderMutation,
  useOrderFulfillDataQuery,
  useOrderFulfillmentUpdateTrackingMutation,
  useOrderFulfillSettingsQuery,
  useWarehouseDetailsQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationErrors } from "@saleor/misc";
import OrderFulfillPage, {
  OrderFulfillSubmitData,
} from "@saleor/orders/components/OrderFulfillPage";
import { OrderFulfillUrlQueryParams, orderUrl } from "@saleor/orders/urls";
import React from "react";
import { useIntl } from "react-intl";

export interface OrderFulfillProps {
  orderId: string;
  params: OrderFulfillUrlQueryParams;
}

const OrderFulfill: React.FC<OrderFulfillProps> = ({ orderId, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const {
    data: settings,
    loading: settingsLoading,
  } = useOrderFulfillSettingsQuery({});

  const { data, loading } = useOrderFulfillDataQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });

  const [updateTracking] = useOrderFulfillmentUpdateTrackingMutation();

  const [fulfillOrder, fulfillOrderOpts] = useFulfillOrderMutation({
    onCompleted: data => {
      if (data.orderFulfill.errors.length === 0) {
        navigate(orderUrl(orderId), { replace: true });
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "CYEnGq",
            defaultMessage: "Fulfilled Items",
            description: "order fulfilled success message",
          }),
        });
      }
    },
  });

  const { data: warehouseData } = useWarehouseDetailsQuery({
    variables: {
      id: params?.warehouse,
    },
  });

  return (
    <>
      <WindowTitle
        title={
          data?.order?.number
            ? intl.formatMessage(
                {
                  id: "2MKBk2",
                  defaultMessage: "Fulfill Order #{orderNumber}",
                  description: "window title",
                },
                {
                  orderNumber: data.order.number,
                },
              )
            : intl.formatMessage({
                id: "NzifUg",
                defaultMessage: "Fulfill Order",
                description: "window title",
              })
        }
      />
      <OrderFulfillPage
        loading={loading || settingsLoading || fulfillOrderOpts.loading}
        errors={fulfillOrderOpts.data?.orderFulfill.errors}
        onSubmit={async (formData: OrderFulfillSubmitData) => {
          const res = await fulfillOrder({
            variables: {
              input: {
                lines: formData.items
                  .filter(line => !!line?.value)
                  .map(line => ({
                    orderLineId: line.id,
                    stocks: line.value,
                  })),
                notifyCustomer:
                  settings?.shop?.fulfillmentAutoApprove && formData.sendInfo,
                allowStockToBeExceeded: formData.allowStockToBeExceeded,
              },
              orderId,
            },
          });

          const fulfillments = res?.data?.orderFulfill?.order?.fulfillments;
          if (fulfillments && formData.trackingNumber) {
            updateTracking({
              variables: {
                id: fulfillments[fulfillments.length - 1].id,
                input: {
                  ...(formData?.trackingNumber && {
                    trackingNumber: formData.trackingNumber,
                  }),
                  notifyCustomer:
                    settings?.shop?.fulfillmentAutoApprove && formData.sendInfo,
                },
              },
            });
          }
          return getMutationErrors(res);
        }}
        order={data?.order}
        saveButtonBar={fulfillOrderOpts.status}
        warehouse={warehouseData?.warehouse}
        shopSettings={settings?.shop}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
