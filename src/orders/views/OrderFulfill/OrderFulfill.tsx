import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  useFulfillOrderMutation,
  useOrderFulfillDataQuery,
  useOrderFulfillSettingsQuery,
  useWarehouseDetailsQuery} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { extractMutationErrors } from "@saleor/misc";
import OrderFulfillPage from "@saleor/orders/components/OrderFulfillPage";
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
    loading: settingsLoading
  } = useOrderFulfillSettingsQuery({});

  const { data, loading } = useOrderFulfillDataQuery({
    displayLoader: true,
    variables: {
      orderId
    }
  });

  const [fulfillOrder, fulfillOrderOpts] = useFulfillOrderMutation({
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

  const { data: warehouseData } = useWarehouseDetailsQuery({
    variables: {
      id: params?.warehouse
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
        loading={loading || settingsLoading || fulfillOrderOpts.loading}
        errors={fulfillOrderOpts.data?.orderFulfill.errors}
        onBack={() => navigate(orderUrl(orderId))}
        onSubmit={formData =>
          extractMutationErrors(
            fulfillOrder({
              variables: {
                input: {
                  lines: formData.items
                    .filter(line => !!line?.value)
                    .map(line => ({
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
        warehouse={warehouseData?.warehouse}
        shopSettings={settings?.shop}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
