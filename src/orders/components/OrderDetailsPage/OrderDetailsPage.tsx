import { Typography } from "@material-ui/core";
import {
  extensionMountPoints,
  mapToMenuItemsForOrderDetails,
  useExtensions,
} from "@saleor/apps/useExtensions";
import { Backlink } from "@saleor/components/Backlink";
import CardMenu from "@saleor/components/CardMenu";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { Container } from "@saleor/components/Container";
import { DateTime } from "@saleor/components/Date";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import Skeleton from "@saleor/components/Skeleton";
import {
  OrderDetailsFragment,
  OrderDetailsQuery,
  OrderErrorFragment,
  OrderStatus,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import OrderChannelSectionCard from "@saleor/orders/components/OrderChannelSectionCard";
import { orderListUrl } from "@saleor/orders/urls";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationErrors, maybe } from "../../../misc";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerNote from "../OrderCustomerNote";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts";
import OrderFulfilledProductsCard from "../OrderFulfilledProductsCard";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderInvoiceList from "../OrderInvoiceList";
import OrderPayment from "../OrderPayment/OrderPayment";
import OrderUnfulfilledProductsCard from "../OrderUnfulfilledProductsCard";
import { messages } from "./messages";
import { useStyles } from "./styles";
import Title from "./Title";
import { filteredConditionalItems, hasAnyItemsReplaceable } from "./utils";

export interface OrderDetailsPageProps {
  order: OrderDetailsFragment;
  shop: OrderDetailsQuery["shop"];
  shippingMethods?: Array<{
    id: string;
    name: string;
  }>;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  onOrderLineAdd?: () => void;
  onOrderLineChange?: (
    id: string,
    data: OrderDraftDetailsProductsFormData,
  ) => void;
  onOrderLineRemove?: (id: string) => void;
  onShippingMethodEdit?: () => void;
  onBillingAddressEdit();
  onFulfillmentApprove(id: string);
  onFulfillmentCancel(id: string);
  onFulfillmentTrackingNumberUpdate(id: string);
  onOrderFulfill();
  onProductClick?(id: string);
  onPaymentCapture();
  onPaymentPaid();
  onPaymentRefund();
  onPaymentVoid();
  onShippingAddressEdit();
  onOrderCancel();
  onNoteAdd(data: HistoryFormData);
  onProfileView();
  onOrderReturn();
  onInvoiceClick(invoiceId: string);
  onInvoiceGenerate();
  onInvoiceSend(invoiceId: string);
  onSubmit(data: MetadataFormData): SubmitPromise;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = props => {
  const {
    disabled,
    order,
    shop,
    saveButtonBarState,
    errors,
    onBillingAddressEdit,
    onFulfillmentApprove,
    onFulfillmentCancel,
    onFulfillmentTrackingNumberUpdate,
    onNoteAdd,
    onOrderCancel,
    onOrderFulfill,
    onPaymentCapture,
    onPaymentPaid,
    onPaymentRefund,
    onPaymentVoid,
    onShippingAddressEdit,
    onProfileView,
    onInvoiceClick,
    onInvoiceGenerate,
    onInvoiceSend,
    onOrderReturn,
    onOrderLineAdd,
    onOrderLineChange,
    onOrderLineRemove,
    onShippingMethodEdit,
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const navigate = useNavigator();
  const intl = useIntl();

  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
    resetMetadataChanged,
  } = useMetadataChangeTrigger();

  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const canCancel = order?.status !== OrderStatus.CANCELED;
  const canEditAddresses = order?.status !== OrderStatus.CANCELED;
  const canFulfill = order?.status !== OrderStatus.CANCELED;
  const notAllowedToFulfillUnpaid =
    shop?.fulfillmentAutoApprove &&
    !shop?.fulfillmentAllowUnpaid &&
    !order?.isPaid;
  const unfulfilled = (order?.lines || []).filter(
    line => line.quantityToFulfill > 0,
  );

  const handleSubmit = async (data: MetadataFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    const result = await onSubmit({
      metadata,
      privateMetadata,
    });
    resetMetadataChanged();
    return getMutationErrors(result);
  };

  const initial: MetadataFormData = {
    metadata: order?.metadata.map(mapMetadataItemToInput),
    privateMetadata: order?.privateMetadata.map(mapMetadataItemToInput),
  };

  const saveLabel = isOrderUnconfirmed
    ? { confirm: intl.formatMessage(messages.confirmOrder) }
    : undefined;

  const allowSave = () => {
    if (!isOrderUnconfirmed) {
      return disabled;
    } else if (!order?.lines?.length) {
      return true;
    }
    return disabled;
  };

  const selectCardMenuItems = filteredConditionalItems([
    {
      item: {
        label: intl.formatMessage(messages.cancelOrder),
        onSelect: onOrderCancel,
      },
      shouldExist: canCancel,
    },
    {
      item: {
        label: intl.formatMessage(messages.returnOrder),
        onSelect: onOrderReturn,
      },
      shouldExist: hasAnyItemsReplaceable(order),
    },
  ]);

  const { ORDER_DETAILS_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.ORDER_DETAILS,
  );

  const extensionMenuItems = mapToMenuItemsForOrderDetails(
    ORDER_DETAILS_MORE_ACTIONS,
    order?.id,
  );

  return (
    <Form confirmLeave initial={initial} onSubmit={handleSubmit}>
      {({ change, data, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <Backlink href={orderListUrl()}>
              {intl.formatMessage(sectionNames.orders)}
            </Backlink>
            <PageHeader
              className={classes.header}
              inline
              title={<Title order={order} />}
              cardMenu={
                <CardMenu
                  outlined
                  menuItems={[...selectCardMenuItems, ...extensionMenuItems]}
                />
              }
            />
            <div className={classes.date}>
              {order && order.created ? (
                <Typography variant="body2">
                  <DateTime date={order.created} />
                </Typography>
              ) : (
                <Skeleton style={{ width: "10em" }} />
              )}
            </div>
            <Grid>
              <div data-test-id="order-fulfillment">
                {!isOrderUnconfirmed ? (
                  <OrderUnfulfilledProductsCard
                    showFulfillmentAction={canFulfill}
                    notAllowedToFulfillUnpaid={notAllowedToFulfillUnpaid}
                    lines={unfulfilled}
                    onFulfill={onOrderFulfill}
                  />
                ) : (
                  <>
                    <OrderDraftDetails
                      order={order}
                      errors={errors}
                      onOrderLineAdd={onOrderLineAdd}
                      onOrderLineChange={onOrderLineChange}
                      onOrderLineRemove={onOrderLineRemove}
                      onShippingMethodEdit={onShippingMethodEdit}
                    />
                    <CardSpacer />
                  </>
                )}
                {order?.fulfillments?.map(fulfillment => (
                  <React.Fragment key={fulfillment.id}>
                    <OrderFulfilledProductsCard
                      fulfillment={fulfillment}
                      fulfillmentAllowUnpaid={shop?.fulfillmentAllowUnpaid}
                      order={order}
                      onOrderFulfillmentCancel={() =>
                        onFulfillmentCancel(fulfillment.id)
                      }
                      onTrackingCodeAdd={() =>
                        onFulfillmentTrackingNumberUpdate(fulfillment.id)
                      }
                      onRefund={onPaymentRefund}
                      onOrderFulfillmentApprove={() =>
                        onFulfillmentApprove(fulfillment.id)
                      }
                    />
                  </React.Fragment>
                ))}
                <OrderPayment
                  order={order}
                  onCapture={onPaymentCapture}
                  onMarkAsPaid={onPaymentPaid}
                  onRefund={onPaymentRefund}
                  onVoid={onPaymentVoid}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
                <OrderHistory
                  history={order?.events}
                  orderCurrency={order?.total?.gross.currency}
                  onNoteAdd={onNoteAdd}
                />
              </div>
              <div>
                <OrderCustomer
                  canEditAddresses={canEditAddresses}
                  canEditCustomer={false}
                  order={order}
                  errors={errors}
                  onBillingAddressEdit={onBillingAddressEdit}
                  onShippingAddressEdit={onShippingAddressEdit}
                  onProfileView={onProfileView}
                />
                <CardSpacer />
                <OrderChannelSectionCard channel={order?.channel} />
                <CardSpacer />
                {!isOrderUnconfirmed && (
                  <>
                    <OrderInvoiceList
                      invoices={order?.invoices}
                      onInvoiceClick={onInvoiceClick}
                      onInvoiceGenerate={onInvoiceGenerate}
                      onInvoiceSend={onInvoiceSend}
                    />
                    <CardSpacer />
                  </>
                )}
                <OrderCustomerNote note={maybe(() => order.customerNote)} />
              </div>
            </Grid>
            <Savebar
              labels={saveLabel}
              onCancel={() => navigate(orderListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={allowSave()}
            />
          </Container>
        );
      }}
    </Form>
  );
};

OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
