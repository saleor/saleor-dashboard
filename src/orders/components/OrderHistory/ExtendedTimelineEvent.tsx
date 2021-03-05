import { makeStyles, Typography } from "@material-ui/core";
import Money from "@saleor/components/Money";
import { TimelineEvent } from "@saleor/components/Timeline";
import { orderUrl } from "@saleor/orders/urls";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
import { OrderEventsEnum } from "@saleor/types/globalTypes";
import classNames from "classnames";
import camelCase from "lodash/camelCase";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { OrderDetails_order_events } from "../../types/OrderDetails";

const useStyles = makeStyles(
  theme => ({
    eventSubtitle: {
      marginBottom: theme.spacing(0.5),
      marginTop: theme.spacing(1)
    },
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing(1)
    },
    linesTableCell: {
      paddingRight: theme.spacing(3)
    },
    root: { marginTop: theme.spacing(4) },
    topSpacer: {
      marginTop: theme.spacing(3)
    },
    user: {
      marginBottom: theme.spacing(1)
    }
  }),
  { name: "OrderHistory" }
);

export const productTitles = defineMessages({
  draftCreatedFromReplace: {
    defaultMessage: "Products replaced",
    description: "draft created from replace products list title",
    id: "event products title draft reissued"
  },
  fulfillmentRefunded: {
    defaultMessage: "Products refunded",
    description: "refunded products list title",
    id: "event products list title refunded"
  },
  fulfillmentReplaced: {
    defaultMessage: "Products replaced",
    description: "replaced products list title",
    id: "event products list title replaced"
  },
  fulfillmentReturned: {
    defaultMessage: "Products returned",
    description: "returned products list title",
    id: "event products list title returned"
  }
});

export const titles = defineMessages({
  draftCreatedFromReplace: {
    defaultMessage: "Draft was reissued from order ",
    description: "draft created from replace event title",
    id: "event title draft reissued"
  },
  fulfillmentRefunded: {
    defaultMessage: "Products were refunded by ",
    description: "refunded event title",
    id: "event title refunded"
  },
  fulfillmentReplaced: {
    defaultMessage: "Products were replaced by ",
    description: "replaced event title",
    id: "event title replaced"
  },
  fulfillmentReturned: {
    defaultMessage: "Products were returned by",
    description: "returned event title",
    id: "event title returned"
  },
  orderMarkedAsPaid: {
    defaultMessage: "Order was marked as paid by",
    description: "order marked as paid event title",
    id: "event title marked as paid"
  }
});

export const messages = defineMessages({
  by: {
    defaultMessage: "by",
    description: "by preposition",
    id: "by preposition"
  },
  refundedAmount: {
    defaultMessage: "Refunded amount",
    description: "amount title",
    id: "amount title"
  },
  refundedShipment: {
    defaultMessage: "Shipment was refunded",
    description: "shipment refund title",
    id: "shipment refund title"
  },
  transactionReference: {
    defaultMessage: "Transaction reference",
    description: "transaction reference subtitle",
    id: "transaction reference subtitle"
  }
});

interface ExtendedTimelineEventProps {
  event: OrderDetails_order_events;
  orderCurrency: string;
}

const ExtendedTimelineEvent: React.FC<ExtendedTimelineEventProps> = ({
  event,
  orderCurrency
}) => {
  const {
    id,
    date,
    type,
    user,
    lines,
    amount,
    transactionReference,
    shippingCostsIncluded,
    relatedOrder
  } = event;
  const classes = useStyles({});
  const intl = useIntl();

  const eventTypeInCamelCase = camelCase(type);

  const employeeName = `${user.firstName} ${user.lastName}`;

  const titleElements = {
    by: { text: intl.formatMessage(messages.by) },
    employeeName: {
      link: staffMemberDetailsUrl(user.id),
      text: employeeName.trim() ? employeeName : user.email
    },
    orderNumber: {
      link: orderUrl(relatedOrder?.id),
      text: `#${relatedOrder?.number}`
    },
    title: { text: intl.formatMessage(titles[eventTypeInCamelCase]) }
  };

  const selectTitleElements = () => {
    const { title, by, employeeName, orderNumber } = titleElements;

    switch (type) {
      case OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE: {
        return [title, orderNumber, by, employeeName];
      }
      default: {
        return [title, employeeName];
      }
    }
  };

  return (
    <TimelineEvent date={date} titleElements={selectTitleElements()} key={id}>
      {lines && (
        <>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.eventSubtitle}
          >
            {intl.formatMessage(productTitles[eventTypeInCamelCase])}
          </Typography>
          <table>
            <tbody>
              {lines.map(({ orderLine, quantity, itemName }, i) => (
                <tr key={`${itemName}-${i}`}>
                  <td className={classes.linesTableCell}>
                    {orderLine?.productName || itemName}
                  </td>
                  <td className={classes.linesTableCell}>
                    <Typography variant="caption" color="textSecondary">
                      {orderLine?.variantName}
                    </Typography>
                  </td>
                  <td className={classes.linesTableCell}>
                    <Typography variant="caption" color="textSecondary">
                      {`qty: ${quantity}`}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(amount || amount === 0) && (
            <>
              <Typography
                variant="caption"
                color="textSecondary"
                className={classNames(classes.eventSubtitle, classes.topSpacer)}
              >
                {intl.formatMessage(messages.refundedAmount)}
              </Typography>
              <Money
                money={{
                  amount,
                  currency: orderCurrency
                }}
              />
            </>
          )}
          {shippingCostsIncluded && (
            <Typography>
              {intl.formatMessage(messages.refundedShipment)}
            </Typography>
          )}
        </>
      )}

      {!!transactionReference && (
        <>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classNames(classes.eventSubtitle)}
          >
            {intl.formatMessage(messages.transactionReference)}
          </Typography>
          <Typography>{transactionReference}</Typography>
        </>
      )}
    </TimelineEvent>
  );
};

export default ExtendedTimelineEvent;
