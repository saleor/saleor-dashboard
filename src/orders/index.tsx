import {
  ConditionalDraftOrderFilterProvider,
  ConditionalOrderFilterProvider,
} from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  orderDraftListPath,
  OrderDraftListUrlQueryParams,
  OrderDraftListUrlSortField,
  orderFulfillPath,
  OrderFulfillUrlQueryParams,
  orderGrantRefundEditPath,
  orderGrantRefundPath,
  orderListPath,
  OrderListUrlQueryParams,
  OrderListUrlSortField,
  orderManualTransactionRefundPath,
  orderPath,
  orderPaymentRefundPath,
  orderReturnPath,
  orderSendRefundPath,
  orderSettingsPath,
  orderTransactionRefundEditPath,
  orderTransactionRefundPath,
  OrderUrlQueryParams,
} from "./urls";
import OrderDetailsComponent from "./views/OrderDetails";
import OrderDraftListComponent from "./views/OrderDraftList";
import OrderGrantRefundEditComponent from "./views/OrderEditGrantRefund";
import OrderFulfillComponent from "./views/OrderFulfill";
import OrderGrantRefundComponent from "./views/OrderGrantRefund";
import OrderListComponent from "./views/OrderList";
import OrderManualTransactionRefundComponent from "./views/OrderManualTransactionRefund";
import OrderRefundComponent from "./views/OrderRefund";
import OrderReturnComponent from "./views/OrderReturn";
import OrderSendRefundComponent from "./views/OrderSendRefund";
import OrderSettings from "./views/OrderSettings";
import OrderTransactionRefundCreateComponent from "./views/OrderTransactionRefundCreate";
import OrderTransactionRefundEditComponent from "./views/OrderTransactionRefundEdit";

interface MatchParams {
  id?: string;
}

const OrderList = ({ location }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: OrderListUrlQueryParams = asSortParams(
    qs,
    OrderListUrlSortField,
    OrderListUrlSortField.number,
    false,
  );

  return (
    <ConditionalOrderFilterProvider locationSearch={location.search}>
      <OrderListComponent params={params} />
    </ConditionalOrderFilterProvider>
  );
};
const OrderDraftList = ({ location }: RouteComponentProps<any>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: OrderDraftListUrlQueryParams = asSortParams(
    qs,
    OrderDraftListUrlSortField,
    OrderDraftListUrlSortField.number,
    false,
  );

  return (
    <ConditionalDraftOrderFilterProvider locationSearch={location.search}>
      <OrderDraftListComponent params={params} />
    </ConditionalDraftOrderFilterProvider>
  );
};
const OrderDetails = ({ location, match }: RouteComponentProps<MatchParams>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: OrderUrlQueryParams = qs;
  const id = match.params.id!;

  return <OrderDetailsComponent id={decodeURIComponent(id)} params={params} />;
};
const OrderFulfill = ({ location, match }: RouteComponentProps<MatchParams>) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: OrderFulfillUrlQueryParams = qs;

  return <OrderFulfillComponent orderId={decodeURIComponent(match.params.id!)} params={params} />;
};
const OrderPaymentRefund = ({ match }: RouteComponentProps<MatchParams>) => (
  <OrderRefundComponent orderId={decodeURIComponent(match.params.id ?? "")} />
);
const OrderSendRefund = ({ match }: RouteComponentProps<MatchParams>) => (
  <OrderSendRefundComponent orderId={decodeURIComponent(match.params.id ?? "")} />
);
const OrderReturn = ({ match }: RouteComponentProps<MatchParams>) => (
  <OrderReturnComponent orderId={decodeURIComponent(match.params.id ?? "")} />
);
const OrderGrantRefund = ({ match }: RouteComponentProps<MatchParams>) => (
  <OrderGrantRefundComponent orderId={decodeURIComponent(match.params.id ?? "")} />
);
const OrderGrantRefundEdit = ({
  match,
}: RouteComponentProps<{ orderId: string; refundId: string }>) => (
  <OrderGrantRefundEditComponent
    orderId={decodeURIComponent(match.params.orderId)}
    grantRefundId={decodeURIComponent(match.params.refundId)}
  />
);

const OrderTransactionRefund = ({ match }: RouteComponentProps<MatchParams>) => (
  <OrderTransactionRefundCreateComponent orderId={decodeURIComponent(match.params.id ?? "")} />
);

const OrderTransactionRefundEdit = ({
  match,
}: RouteComponentProps<{ orderId: string; refundId: string }>) => (
  <OrderTransactionRefundEditComponent
    orderId={decodeURIComponent(match.params.orderId)}
    refundId={decodeURIComponent(match.params.refundId)}
  />
);
const OrderManualTransactionRefund = ({ match }: RouteComponentProps<MatchParams>) => {
  return (
    <OrderManualTransactionRefundComponent orderId={decodeURIComponent(match.params.id ?? "")} />
  );
};
const Component = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.orders)} />
      <Switch>
        <Route exact path={orderSettingsPath} component={OrderSettings} />
        <Route exact path={orderDraftListPath} component={OrderDraftList} />
        <Route exact path={orderListPath} component={OrderList} />
        <Route path={orderFulfillPath(":id")} component={OrderFulfill} />
        <Route path={orderReturnPath(":id")} component={OrderReturn} />
        <Route path={orderPaymentRefundPath(":id")} component={OrderPaymentRefund} />
        <Route path={orderSendRefundPath(":id")} component={OrderSendRefund} />
        <Route
          path={orderGrantRefundEditPath(":orderId", ":refundId")}
          component={OrderGrantRefundEdit}
        />
        <Route path={orderGrantRefundPath(":id")} component={OrderGrantRefund} />
        <Route
          path={orderTransactionRefundEditPath(":orderId", ":refundId")}
          component={OrderTransactionRefundEdit}
        />
        <Route path={orderTransactionRefundPath(":id")} component={OrderTransactionRefund} />
        <Route
          path={orderManualTransactionRefundPath(":id")}
          component={OrderManualTransactionRefund}
        />
        <Route path={orderPath(":id")} component={OrderDetails} />
      </Switch>
    </>
  );
};

export default Component;
