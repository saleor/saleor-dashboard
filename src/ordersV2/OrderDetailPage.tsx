import { TopNavWrapper } from "@dashboard/components/AppLayout";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { OrderDetailsFragment } from "@dashboard/graphql";
import { Divider } from "@saleor/macaw-ui-next";

import { OrderApps } from "./OrderApps";
import { OrderCustomer } from "./OrderCustomer/OrderCustomer";
import { OrderDetailsViewModel } from "./OrderDetailsViewModel";
import { OrderFulfillments } from "./OrderFulfillments/OrderFulfillments";
import { OrderHeader } from "./OrderHeader";
import { OrderInvoices } from "./OrderInvoices";
import { OrderLines } from "./OrderLines";
import { OrderCustomerNote } from "./OrderNotes";
import { OrderRefunds } from "./OrderRefunds/OrderRefunds";
import { OrderRefundsViewModel } from "./OrderRefunds/OrderRefundsViewModel";
import { OrderSummary } from "./OrderSummary/OrderSummary";

export const OrderDetailsPage = ({ order }: { order: OrderDetailsFragment }) => {
  return (
    <>
      <DetailPageLayout backgroundColor="default2" padding={4}>
        <TopNavWrapper
          __height="100%"
          gridColumn="9"
          borderColor="default1"
          borderTopWidth={1}
          borderLeftWidth={1}
          borderRightWidth={0}
          borderTopLeftRadius={5}
          borderBottomWidth={0}
          borderStyle="solid"
        >
          <OrderHeader
            orderNumber={order.number}
            status={order.status}
            created={order.created}
            channel={order.channel}
          />
        </TopNavWrapper>

        <DetailPageLayout.Content
          backgroundColor="default1"
          borderBottomLeftRadius={5}
          gridColumn={"9"}
          borderColor="default1"
          borderStyle="solid"
          borderWidth={1}
          borderRightWidth={0}
        >
          <OrderLines lines={order.lines} status={order.status} />
          {OrderDetailsViewModel.shouldShowFulfillments(order.fulfillments) && (
            <OrderFulfillments fulfillments={order.fulfillments} />
          )}
          <OrderSummary
            orderSubtotal={order.subtotal}
            shippingMethodName={order.shippingMethodName}
            shippingPrice={order.shippingPrice}
            discounts={order.discounts}
            paymentStatus={order.paymentStatus}
            orderTotalAmounts={{
              totalAuthorized: order.totalAuthorized,
              totalCaptured: order.totalCaptured,
              totalRefunded: order.totalRefunded,
              totalBalance: order.totalBalance,
              total: order.total,
              totalAuthorizePending: order.totalAuthorizePending,
              totalCharged: order.totalCharged,
              totalChargePending: order.totalChargePending,
              totalCanceled: order.totalCanceled,
              totalCancelPending: order.totalCancelPending,
            }}
            orderId={order.id}
            canBeMarkedAsPaid={OrderDetailsViewModel.canOrderBeMarkedAsPaid(order.actions)}
            giftCardsAmount={OrderDetailsViewModel.getGiftCardsAmountUsed({
              id: order.id,
              giftCards: order.giftCards,
            })}
            usedGiftCards={OrderDetailsViewModel.getUsedGiftCards(order.giftCards)}
          />
          <Divider />
          <OrderRefunds
            onNewRefund={() => alert("New refund")}
            onEditRefund={() => alert("Edit refund")}
            orderRefundsDisplayList={OrderRefundsViewModel.prepareOrderRefundDisplayList(
              order.transactions.flatMap(t => t.events),
              order.grantedRefunds,
            )}
            orderRefundState={OrderRefundsViewModel.getRefundState(order.transactions)}
          />
        </DetailPageLayout.Content>
        <DetailPageLayout.RightSidebar
          borderTopRightRadius={5}
          borderBottomRightRadius={5}
          backgroundColor="default1"
          gridColumn={"9"}
          borderColor="default1"
          borderStyle="solid"
          borderWidth={1}
        >
          <OrderCustomer
            userEmail={order.userEmail}
            userId={order.user?.id}
            shippingAddress={order.shippingAddress}
            billingAddress={order.billingAddress}
          />
          <Divider />
          {OrderDetailsViewModel.shouldShowInvoiceList(order.status) && (
            <>
              <OrderInvoices invoices={order.invoices} />
              <Divider />
            </>
          )}

          {OrderDetailsViewModel.shouldShowCustomerNote(order.customerNote) && (
            <>
              <OrderCustomerNote note={order.customerNote} />
              <Divider />
            </>
          )}
          <OrderApps />
        </DetailPageLayout.RightSidebar>
      </DetailPageLayout>
    </>
  );
};
