import { Typography } from "@material-ui/core";
import AppHeader from "@saleor/components/AppHeader";
import CardMenu from "@saleor/components/CardMenu";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { Container } from "@saleor/components/Container";
import { DateTime } from "@saleor/components/Date";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import Skeleton from "@saleor/components/Skeleton";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import OrderChannelSectionCard from "@saleor/orders/components/OrderChannelSectionCard";
import { makeStyles } from "@saleor/theme";
import { UserPermissionProps } from "@saleor/types";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { OrderStatus } from "../../../types/globalTypes";
import { OrderDetails_order } from "../../types/OrderDetails";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerNote from "../OrderCustomerNote";
import OrderDraftDetails from "../OrderDraftDetails/OrderDraftDetails";
import { FormData as OrderDraftDetailsProductsFormData } from "../OrderDraftDetailsProducts";
import OrderFulfilledProductsCard from "../OrderFulfilledProductsCard";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderInvoiceList from "../OrderInvoiceList";
import OrderPayment from "../OrderPayment/OrderPayment";
import OrderUnfulfilledProductsCard from "../OrderUnfulfilledProductsCard";
import Title from "./Title";
import { filteredConditionalItems, hasAnyItemsReplaceable } from "./utils";

const useStyles = makeStyles(
  theme => ({
    date: {
      marginBottom: theme.spacing(3)
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 0
    }
  }),
  {
    name: "OrderDetailsPage"
  }
);

export interface OrderDetailsPageProps extends UserPermissionProps {
  order: OrderDetails_order;
  shippingMethods?: Array<{
    id: string;
    name: string;
  }>;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onOrderLineAdd?: () => void;
  onOrderLineChange?: (
    id: string,
    data: OrderDraftDetailsProductsFormData
  ) => void;
  onOrderLineRemove?: (id: string) => void;
  onShippingMethodEdit?: () => void;
  onBack();
  onBillingAddressEdit();
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

const messages = defineMessages({
  cancelOrder: {
    defaultMessage: "Cancel order",
    description: "cancel button"
  },
  confirmOrder: {
    defaultMessage: "Confirm order",
    description: "save button"
  },
  returnOrder: {
    defaultMessage: "Return / Replace order",
    description: "return button"
  }
});

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = props => {
  const {
    disabled,
    order,
    saveButtonBarState,
    userPermissions,
    onBack,
    onBillingAddressEdit,
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
    onSubmit
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler,
    resetMetadataChanged
  } = useMetadataChangeTrigger();

  const isOrderUnconfirmed = order?.status === OrderStatus.UNCONFIRMED;
  const canCancel = order?.status !== OrderStatus.CANCELED;
  const canEditAddresses = order?.status !== OrderStatus.CANCELED;
  const canFulfill = order?.status !== OrderStatus.CANCELED;
  const unfulfilled = (order?.lines || []).filter(
    line => line.quantityFulfilled < line.quantity
  );

  const handleSubmit = async (data: MetadataFormData) => {
    const metadata = isMetadataModified ? data.metadata : undefined;
    const privateMetadata = isPrivateMetadataModified
      ? data.privateMetadata
      : undefined;

    const result = await onSubmit({
      metadata,
      privateMetadata
    });
    resetMetadataChanged();
    return result;
  };

  const initial: MetadataFormData = {
    metadata: order?.metadata.map(mapMetadataItemToInput),
    privateMetadata: order?.privateMetadata.map(mapMetadataItemToInput)
  };

  const saveLabel = isOrderUnconfirmed
    ? intl.formatMessage(messages.confirmOrder)
    : undefined;

  const allowSave = (hasChanged: boolean) => {
    if (!isOrderUnconfirmed) {
      return disabled || !hasChanged;
    } else if (!order?.lines?.length) {
      return true;
    }
    return disabled;
  };

  const selectCardMenuItems = filteredConditionalItems([
    {
      item: {
        label: intl.formatMessage(messages.cancelOrder),
        onSelect: onOrderCancel
      },
      shouldExist: canCancel
    },
    {
      item: {
        label: intl.formatMessage(messages.returnOrder),
        onSelect: onOrderReturn
      },
      shouldExist: hasAnyItemsReplaceable(order)
    }
  ]);

  return (
    <Form initial={initial} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, submit }) => {
        const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.orders)}
            </AppHeader>
            <PageHeader
              className={classes.header}
              inline
              title={<Title order={order} />}
            >
              <CardMenu menuItems={selectCardMenuItems} />
            </PageHeader>
            <div className={classes.date}>
              {order && order.created ? (
                <Typography variant="caption">
                  <DateTime date={order.created} />
                </Typography>
              ) : (
                <Skeleton style={{ width: "10em" }} />
              )}
            </div>
            <Grid>
              <div data-test-id="orderFulfillment">
                {!isOrderUnconfirmed ? (
                  <OrderUnfulfilledProductsCard
                    canFulfill={canFulfill}
                    lines={unfulfilled}
                    onFulfill={onOrderFulfill}
                  />
                ) : (
                  <>
                    <OrderDraftDetails
                      order={order}
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
                      orderNumber={order.number}
                      onOrderFulfillmentCancel={() =>
                        onFulfillmentCancel(fulfillment.id)
                      }
                      onTrackingCodeAdd={() =>
                        onFulfillmentTrackingNumberUpdate(fulfillment.id)
                      }
                      onRefund={onPaymentRefund}
                    />
                  </React.Fragment>
                ))}
                {!isOrderUnconfirmed && (
                  <>
                    <OrderPayment
                      order={order}
                      onCapture={onPaymentCapture}
                      onMarkAsPaid={onPaymentPaid}
                      onRefund={onPaymentRefund}
                      onVoid={onPaymentVoid}
                    />
                    <CardSpacer />
                    <Metadata data={data} onChange={changeMetadata} />
                  </>
                )}
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
                  userPermissions={userPermissions}
                  onBillingAddressEdit={onBillingAddressEdit}
                  onShippingAddressEdit={onShippingAddressEdit}
                  onProfileView={onProfileView}
                />
                <CardSpacer />
                <OrderChannelSectionCard
                  selectedChannelName={order?.channel?.name}
                />
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
            <SaveButtonBar
              labels={{ save: saveLabel }}
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={allowSave(hasChanged)}
            />
          </Container>
        );
      }}
    </Form>
  );
};

OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
