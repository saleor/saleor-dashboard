import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardMenu from "@saleor/components/CardMenu";
import { CardSpacer } from "@saleor/components/CardSpacer";
import { Container } from "@saleor/components/Container";
import { DateTime } from "@saleor/components/Date";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Skeleton from "@saleor/components/Skeleton";
import { sectionNames } from "@saleor/intl";
import { UserPermissionProps } from "@saleor/types";
import { maybe, renderCollection } from "../../../misc";
import { OrderStatus } from "../../../types/globalTypes";
import { OrderDetails_order } from "../../types/OrderDetails";
import OrderCustomer from "../OrderCustomer";
import OrderCustomerNote from "../OrderCustomerNote";
import OrderFulfillment from "../OrderFulfillment";
import OrderHistory, { FormData as HistoryFormData } from "../OrderHistory";
import OrderPayment from "../OrderPayment/OrderPayment";
import OrderUnfulfilledItems from "../OrderUnfulfilledItems/OrderUnfulfilledItems";

const useStyles = makeStyles(
  theme => ({
    date: {
      marginBottom: theme.spacing(3)
    },
    header: {
      display: "flex",
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
  countries?: Array<{
    code: string;
    label: string;
  }>;
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
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = props => {
  const {
    order,
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
    onProfileView
  } = props;
  const classes = useStyles(props);

  const intl = useIntl();

  const canCancel = maybe(() => order.status) !== OrderStatus.CANCELED;
  const canEditAddresses = maybe(() => order.status) !== OrderStatus.CANCELED;
  const canFulfill = maybe(() => order.status) !== OrderStatus.CANCELED;
  const unfulfilled = maybe(() => order.lines, []).filter(
    line => line.quantityFulfilled < line.quantity
  );

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.orders)}
      </AppHeader>
      <PageHeader
        className={classes.header}
        inline
        title={maybe(() => order.number) ? "#" + order.number : undefined}
      >
        {canCancel && (
          <CardMenu
            menuItems={[
              {
                label: intl.formatMessage({
                  defaultMessage: "Cancel order",
                  description: "button"
                }),
                onSelect: onOrderCancel
              }
            ]}
          />
        )}
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
        <div>
          {unfulfilled.length > 0 && (
            <OrderUnfulfilledItems
              canFulfill={canFulfill}
              lines={unfulfilled}
              onFulfill={onOrderFulfill}
            />
          )}
          {renderCollection(
            maybe(() => order.fulfillments),
            (fulfillment, fulfillmentIndex) => (
              <React.Fragment key={maybe(() => fulfillment.id, "loading")}>
                {!(unfulfilled.length === 0 && fulfillmentIndex === 0) && (
                  <CardSpacer />
                )}
                <OrderFulfillment
                  fulfillment={fulfillment}
                  orderNumber={maybe(() => order.number)}
                  onOrderFulfillmentCancel={() =>
                    onFulfillmentCancel(fulfillment.id)
                  }
                  onTrackingCodeAdd={() =>
                    onFulfillmentTrackingNumberUpdate(fulfillment.id)
                  }
                />
              </React.Fragment>
            )
          )}
          <CardSpacer />
          <OrderPayment
            order={order}
            onCapture={onPaymentCapture}
            onMarkAsPaid={onPaymentPaid}
            onRefund={onPaymentRefund}
            onVoid={onPaymentVoid}
          />
          <OrderHistory
            history={maybe(() => order.events)}
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
          <OrderCustomerNote note={maybe(() => order.customerNote)} />
        </div>
      </Grid>
    </Container>
  );
};
OrderDetailsPage.displayName = "OrderDetailsPage";
export default OrderDetailsPage;
