import { SavebarRefProvider } from "@dashboard/components/Savebar/SavebarRefContext";
import {
  type OrderDetailsFragment,
  type OrderDetailsQueryResult,
  OrderStatus,
  type TransactionActionEnum,
} from "@dashboard/graphql";
import { LegacyPaymentsApiButtons } from "@dashboard/orders/components/OrderSummary/LegacyPaymentsApiButtons";
import { TransactionsApiButtons } from "@dashboard/orders/components/OrderSummary/TransactionsApiButtons";
import { OrderTransactionsSection } from "@dashboard/orders/components/OrderTransactionsSection/OrderTransactionsSection";
import { shop as shopFixture } from "@dashboard/orders/fixtures";
import {
  createLegacyRefundNavigationAdapter,
  createTransactionRefundNavigationAdapter,
  OrderRefundNavigationProvider,
} from "@dashboard/orders/orderRefundNavigation";
import { resolveOrderPaymentMode } from "@dashboard/orders/resolveOrderPaymentMode";
import { type ReactElement, useEffect } from "react";
import { fn } from "storybook/test";
import useRouter from "use-react-router";

import { DevModeContext } from "../../../components/DevModePanel/hooks";
import { type OrderUrlDialog } from "../../urls";
import { type CommonOrderOperations } from "./operations/useCommonOrderOperations";
import { OrderNormalDetails } from "./OrderNormalDetails";
import { OrderUnconfirmedDetails } from "./OrderUnconfirmedDetails";

/**
 * Test-only harness that renders the order-details lifecycle views from a
 * single `order` fixture plus a handful of action spies. It stands in for the
 * route: like the concrete Legacy/Transaction views it resolves the payment
 * mode once and supplies the resulting payment slots, and it stubs the
 * mutations the lifecycle views would otherwise get from the operation hooks.
 *
 * Story names, DOM output and the exposed callback names must survive the
 * payment-view split so the interaction suite runs unchanged after it. Actions
 * the views now perform themselves are observed where they land: dialog
 * openings through `openModal`, navigation through the router location.
 */
interface OrderDetailsStoryHarnessProps {
  order: OrderDetailsFragment;
  onMarkAsPaid?: () => void;
  onPaymentCapture?: () => void;
  onPaymentRefund?: () => void;
  onPaymentVoid?: () => void;
  onTransactionAction?: (transactionId: string, actionType: TransactionActionEnum) => void;
  onAddManualTransaction?: () => void;
  onRefundAdd?: () => void;
  onOrderReturn?: () => void;
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

const stubMutation = () => ({
  mutate: fn(),
  opts: { status: "default", loading: false, called: false, data: undefined },
});
const commonOperations = {
  orderAddNote: stubMutation(),
  orderUpdateNote: stubMutation(),
  orderCancel: stubMutation(),
  orderUpdate: stubMutation(),
  orderFulfillmentApprove: stubMutation(),
  orderFulfillmentCancel: stubMutation(),
  orderFulfillmentUpdateTracking: stubMutation(),
  orderInvoiceRequest: stubMutation(),
  orderInvoiceSend: stubMutation(),
  orderLineDelete: stubMutation(),
  orderLinesAdd: stubMutation(),
  orderLineUpdate: stubMutation(),
  orderShippingMethodUpdate: stubMutation(),
} as unknown as CommonOrderOperations;

/** Reports router navigation, which is how the views now express "go to X". */
const LocationSpy = ({ onNavigate }: { onNavigate: (pathname: string) => void }) => {
  const {
    location: { pathname },
  } = useRouter();

  useEffect(() => {
    onNavigate(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};

export const OrderDetailsStoryHarness = (props: OrderDetailsStoryHarnessProps): ReactElement => {
  const { order } = props;
  const isUnconfirmed = order.status === OrderStatus.UNCONFIRMED;
  const isTransactions = resolveOrderPaymentMode(order).kind === "transactions";
  const refundNavigation = isTransactions
    ? createTransactionRefundNavigationAdapter(order)
    : createLegacyRefundNavigationAdapter(order);

  const paymentActions = isTransactions ? (
    <TransactionsApiButtons order={order} onMarkAsPaid={props.onMarkAsPaid ?? fn()} />
  ) : (
    <LegacyPaymentsApiButtons
      order={order}
      onCapture={props.onPaymentCapture ?? fn()}
      onRefund={props.onPaymentRefund ?? fn()}
      onVoid={props.onPaymentVoid ?? fn()}
      onMarkAsPaid={props.onMarkAsPaid ?? fn()}
    />
  );
  const paymentSection = isTransactions ? (
    <OrderTransactionsSection
      order={order}
      shop={shopFixture}
      onTransactionAction={props.onTransactionAction ?? fn()}
      onAddManualTransaction={props.onAddManualTransaction ?? fn()}
      onRefundAdd={props.onRefundAdd ?? fn()}
    />
  ) : null;

  const viewProps = {
    id: order.id,
    params: {},
    data: { order, shop: shopFixture } as unknown as OrderDetailsQueryResult["data"],
    loading: false,
    common: commonOperations,
    saveButtonBarState: "default" as const,
    handleSubmit: () => Promise.resolve([]),
    openModal: (action: OrderUrlDialog) => {
      if (action === "view-order-metadata") {
        props.onOrderShowMetadata?.();
      }
    },
    closeModal: fn(),
    paymentActions,
    paymentSection,
  };

  const view = (
    <>
      <LocationSpy
        onNavigate={pathname => {
          if (pathname.endsWith("/return")) {
            props.onOrderReturn?.();
          }
        }}
      />
      <OrderRefundNavigationProvider adapter={refundNavigation}>
        {isUnconfirmed ? (
          <OrderUnconfirmedDetails {...viewProps} />
        ) : (
          <OrderNormalDetails {...viewProps} />
        )}
      </OrderRefundNavigationProvider>
    </>
  );

  return (
    <DevModeContext.Provider value={devModeContextValue}>
      <SavebarRefProvider>{view}</SavebarRefProvider>
    </DevModeContext.Provider>
  );
};
