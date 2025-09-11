// @ts-strict-ignore
import { handleNestedMutationErrors } from "@dashboard/auth";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useFulfillOrderMutation,
  useOrderFulfillDataQuery,
  useOrderFulfillSettingsQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import OrderFulfillPage, {
  OrderFulfillSubmitData,
} from "@dashboard/orders/components/OrderFulfillPage";
import {
  orderFulfillUrl,
  OrderFulfillUrlDialog,
  OrderFulfillUrlQueryParams,
  orderUrl,
} from "@dashboard/orders/urls";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useIntl } from "react-intl";

export interface OrderFulfillProps {
  orderId: string;
  params: OrderFulfillUrlQueryParams;
}

const OrderFulfill = ({ orderId, params }: OrderFulfillProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers<
    OrderFulfillUrlDialog,
    OrderFulfillUrlQueryParams
  >(navigate, params => orderFulfillUrl(orderId, params), params);
  const { data: settings, loading: settingsLoading } = useOrderFulfillSettingsQuery({});
  const { data, loading } = useOrderFulfillDataQuery({
    displayLoader: true,
    variables: {
      orderId,
    },
  });
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
      } else {
        if (!data.orderFulfill.errors.every(err => err.code === "INSUFFICIENT_STOCK")) {
          handleNestedMutationErrors({ data, intl, notify });
        }
      }
    },
    disableErrorHandling: true,
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
        params={params}
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
                notifyCustomer: settings?.shop?.fulfillmentAutoApprove && formData.sendInfo,
                allowStockToBeExceeded: formData.allowStockToBeExceeded,
              },
              orderId,
            },
          });

          return getMutationErrors(res);
        }}
        order={data?.order}
        saveButtonBar={fulfillOrderOpts.status}
        shopSettings={settings?.shop}
        openModal={openModal}
        closeModal={closeModal}
      />
    </>
  );
};

OrderFulfill.displayName = "OrderFulfill";
export default OrderFulfill;
