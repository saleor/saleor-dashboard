import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

import Form from "@saleor/components/Form";
import Hr from "@saleor/components/Hr";
import Skeleton from "@saleor/components/Skeleton";
import {
  Timeline,
  TimelineAddNote,
  TimelineEvent,
  TimelineNote
} from "@saleor/components/Timeline";
import {
  OrderEventsEmailsEnum,
  OrderEventsEnum
} from "../../../types/globalTypes";
import { OrderDetails_order_events } from "../../types/OrderDetails";

export interface FormData {
  message: string;
}

const getEventMessage = (event: OrderDetails_order_events, intl: IntlShape) => {
  switch (event.type) {
    case OrderEventsEnum.CANCELED:
      return intl.formatMessage({
        defaultMessage: "Order was cancelled",
        description: "order history message"
      });
    case OrderEventsEnum.DRAFT_ADDED_PRODUCTS:
      return intl.formatMessage({
        defaultMessage: "Products were added to draft order",
        description: "order history message"
      });
    case OrderEventsEnum.DRAFT_CREATED:
      return intl.formatMessage({
        defaultMessage: "Draft order was created",
        description: "order history message"
      });
    case OrderEventsEnum.DRAFT_REMOVED_PRODUCTS:
      return intl.formatMessage({
        defaultMessage: "Products were deleted from draft order",
        description: "order history message"
      });
    case OrderEventsEnum.EMAIL_SENT:
      switch (event.emailType) {
        case OrderEventsEmailsEnum.DIGITAL_LINKS:
          return intl.formatMessage({
            defaultMessage: "Links to the order's digital goods were sent",
            description: "order history message"
          });
        case OrderEventsEmailsEnum.FULFILLMENT_CONFIRMATION:
          return intl.formatMessage({
            defaultMessage: "Fulfillment confirmation was sent to customer",
            description: "order history message"
          });
        case OrderEventsEmailsEnum.ORDER_CONFIRMATION:
          return intl.formatMessage({
            defaultMessage: "Order confirmation was sent to customer",
            description: "order history message"
          });
        case OrderEventsEmailsEnum.PAYMENT_CONFIRMATION:
          return intl.formatMessage({
            defaultMessage: "Payment confirmation was sent to customer",
            description: "order history message"
          });
        case OrderEventsEmailsEnum.SHIPPING_CONFIRMATION:
          return intl.formatMessage({
            defaultMessage: "Shipping details was sent to customer",
            description: "order history message"
          });
        case OrderEventsEmailsEnum.TRACKING_UPDATED:
          return intl.formatMessage({
            defaultMessage: "Shipping tracking number was sent to customer",
            description: "order history message"
          });
      }
    case OrderEventsEnum.FULFILLMENT_CANCELED:
      return intl.formatMessage({
        defaultMessage: "Fulfillment was cancelled",
        description: "order history message"
      });
    case OrderEventsEnum.FULFILLMENT_FULFILLED_ITEMS:
      return intl.formatMessage(
        {
          defaultMessage: "Fulfilled {quantity} items",
          description: "order history message"
        },
        {
          quantity: event.quantity
        }
      );
    case OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS:
      return intl.formatMessage(
        {
          defaultMessage: "Restocked {quantity} items",
          description: "order history message"
        },
        {
          quantity: event.quantity
        }
      );
    case OrderEventsEnum.NOTE_ADDED:
      return intl.formatMessage({
        defaultMessage: "Note was added to the order",
        description: "order history message"
      });
    case OrderEventsEnum.ORDER_FULLY_PAID:
      return intl.formatMessage({
        defaultMessage: "Order was fully paid",
        description: "order history message"
      });
    case OrderEventsEnum.ORDER_MARKED_AS_PAID:
      return intl.formatMessage({
        defaultMessage: "Marked order as paid",
        description: "order history message"
      });
    case OrderEventsEnum.OTHER:
      return event.message;
    case OrderEventsEnum.OVERSOLD_ITEMS:
      return intl.formatMessage(
        {
          defaultMessage: "Oversold {quantity} items",
          description: "order history message"
        },
        {
          quantity: event.quantity
        }
      );
    case OrderEventsEnum.PAYMENT_CAPTURED:
      return intl.formatMessage({
        defaultMessage: "Payment was captured",
        description: "order history message"
      });
    case OrderEventsEnum.PAYMENT_FAILED:
      return intl.formatMessage({
        defaultMessage: "Payment failed",
        description: "order history message"
      });
    case OrderEventsEnum.PAYMENT_REFUNDED:
      return intl.formatMessage({
        defaultMessage: "Payment was refunded",
        description: "order history message"
      });
    case OrderEventsEnum.PAYMENT_VOIDED:
      return intl.formatMessage({
        defaultMessage: "Payment was voided",
        description: "order history message"
      });
    case OrderEventsEnum.PLACED:
      return intl.formatMessage({
        defaultMessage: "Order was placed",
        description: "order history message"
      });
    case OrderEventsEnum.PLACED_FROM_DRAFT:
      return intl.formatMessage({
        defaultMessage: "Order was created from draft",
        description: "order history message"
      });
    case OrderEventsEnum.TRACKING_UPDATED:
      return intl.formatMessage({
        defaultMessage: "Updated fulfillment group's tracking number",
        description: "order history message"
      });
    case OrderEventsEnum.UPDATED_ADDRESS:
      return intl.formatMessage({
        defaultMessage: "Order address was updated",
        description: "order history message"
      });
  }
};

const styles = (theme: Theme) =>
  createStyles({
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing.unit
    },
    root: { marginTop: theme.spacing.unit * 4 },
    user: {
      marginBottom: theme.spacing.unit
    }
  });

interface OrderHistoryProps extends WithStyles<typeof styles> {
  history: OrderDetails_order_events[];
  onNoteAdd: (data: FormData) => void;
}

const OrderHistory = withStyles(styles, { name: "OrderHistory" })(
  ({ classes, history, onNoteAdd }: OrderHistoryProps) => {
    const intl = useIntl();

    return (
      <div className={classes.root}>
        <Typography className={classes.header} color="textSecondary">
          <FormattedMessage defaultMessage="Order History" />
        </Typography>
        <Hr />
        {history ? (
          <Timeline>
            <Form initial={{ message: "" }} onSubmit={onNoteAdd} resetOnSubmit>
              {({ change, data, reset, submit }) => (
                <TimelineAddNote
                  message={data.message}
                  reset={reset}
                  onChange={change}
                  onSubmit={submit}
                />
              )}
            </Form>
            {history
              .slice()
              .reverse()
              .map(event => {
                if (event.type === OrderEventsEnum.NOTE_ADDED) {
                  return (
                    <TimelineNote
                      date={event.date}
                      user={event.user}
                      message={event.message}
                      key={event.id}
                    />
                  );
                }
                return (
                  <TimelineEvent
                    date={event.date}
                    title={getEventMessage(event, intl)}
                    key={event.id}
                  />
                );
              })}
          </Timeline>
        ) : (
          <Skeleton />
        )}
      </div>
    );
  }
);
OrderHistory.displayName = "OrderHistory";
export default OrderHistory;
