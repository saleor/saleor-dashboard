import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import {
  type OrderDetailsFragment,
  OrderStatus,
  type TransactionActionEnum,
} from "@dashboard/graphql";
import { shop as shopFixture } from "@dashboard/orders/fixtures";
import { OrderDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderDiscountProvider";
import { OrderLineDiscountProvider } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { DevModeContext } from "../../../components/DevModePanel/hooks";
import OrderDetailsPage from "../../components/OrderDetailsPage/OrderDetailsPage";

/**
 * Test-only harness that renders the order-details page from a single `order`
 * fixture plus a handful of action spies. It hides the wide page prop surface
 * and supplies the app-shell contexts (dev mode, order discounts) that the page
 * expects. Story names, DOM output and the exposed callback names must survive
 * the payment-view split so the interaction suite runs unchanged after it.
 */
export interface OrderDetailsStoryHarnessProps {
  order: OrderDetailsFragment;
  onMarkAsPaid?: () => void;
  onPaymentCapture?: () => void;
  onPaymentRefund?: () => void;
  onPaymentVoid?: () => void;
  onTransactionAction?: (transactionId: string, actionType: TransactionActionEnum) => void;
  onAddManualTransaction?: () => void;
  onRefundAdd?: () => void;
  onOrderReturn?: () => void;
  onProfileView?: () => void;
  onInvoiceGenerate?: () => void;
  onOrderShowMetadata?: () => void;
}

const devModeContextValue = {
  variables: "",
  setVariables: fn(),
  isDevModeVisible: false,
  setDevModeVisibility: fn(),
  devModeContent: "",
  setDevModeContent: fn(),
};

export const OrderDetailsStoryHarness = (props: OrderDetailsStoryHarnessProps): ReactElement => {
  const { order } = props;
  const isUnconfirmed = order.status === OrderStatus.UNCONFIRMED;

  const page = (
    <OrderDetailsPage
      order={order}
      shop={shopFixture}
      loading={false}
      errors={[]}
      shippingMethods={order.shippingMethods ?? []}
      saveButtonBarState="default"
      onMarkAsPaid={props.onMarkAsPaid ?? fn()}
      onPaymentCapture={props.onPaymentCapture ?? fn()}
      onPaymentRefund={props.onPaymentRefund ?? fn()}
      onPaymentVoid={props.onPaymentVoid ?? fn()}
      onTransactionAction={props.onTransactionAction ?? fn()}
      onAddManualTransaction={props.onAddManualTransaction ?? fn()}
      onRefundAdd={props.onRefundAdd ?? fn()}
      onOrderReturn={props.onOrderReturn ?? fn()}
      onProfileView={props.onProfileView ?? fn()}
      onInvoiceGenerate={props.onInvoiceGenerate ?? fn()}
      onOrderShowMetadata={props.onOrderShowMetadata ?? fn()}
      onBillingAddressEdit={fn()}
      onShippingAddressEdit={fn()}
      onFulfillmentApprove={fn()}
      onFulfillmentCancel={fn()}
      onFulfillmentTrackingNumberUpdate={fn()}
      onFulfillmentShowMetadata={fn()}
      onOrderLineShowMetadata={fn()}
      onOrderFulfill={fn()}
      onOrderCancel={fn()}
      onNoteAdd={fn()}
      onNoteUpdate={fn() as never}
      onNoteUpdateLoading={false}
      onInvoiceClick={fn()}
      onInvoiceSend={fn()}
      onOrderLineAdd={fn()}
      onOrderLineChange={fn()}
      onOrderLineRemove={fn()}
      onShippingMethodEdit={fn()}
      onSubmit={isUnconfirmed ? (fn(() => Promise.resolve([])) as never) : undefined}
    />
  );

  if (isUnconfirmed) {
    return (
      <DevModeContext.Provider value={devModeContextValue}>
        <SavebarRefProvider>
          <OrderDiscountProvider order={order}>
            <OrderLineDiscountProvider order={order}>{page}</OrderLineDiscountProvider>
          </OrderDiscountProvider>
        </SavebarRefProvider>
      </DevModeContext.Provider>
    );
  }

  return <DevModeContext.Provider value={devModeContextValue}>{page}</DevModeContext.Provider>;
};
