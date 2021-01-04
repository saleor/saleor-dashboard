import { makeStyles, Typography } from "@material-ui/core";
import Money from "@saleor/components/Money";
import { TimelineEvent } from "@saleor/components/Timeline";
import { staffMemberDetailsUrl } from "@saleor/staff/urls";
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
  fulfillmentRefunded: {
    defaultMessage: "Products refunded",
    description: "event products list title",
    id: "event products list title refunded"
  },
  fulfillmentReplaced: {
    defaultMessage: "Products replaced",
    description: "event products list title",
    id: "event products list title replaced"
  },
  fulfillmentReturned: {
    defaultMessage: "Products returned",
    description: "event products list title",
    id: "event products list title returned"
  }
});

export const titles = defineMessages({
  fulfillmentRefunded: {
    defaultMessage: "Products were refunded by ",
    description: "event title",
    id: "event title refunded"
  },
  fulfillmentReplaced: {
    defaultMessage: "Products were replaced by ",
    description: "event title",
    id: "event title replaced"
  },
  fulfillmentReturned: {
    defaultMessage: "Products were returned by",
    description: "event title",
    id: "event title returned"
  }
});

export const messages = defineMessages({
  refundedAmount: {
    defaultMessage: "Refunded amount",
    description: "amount title"
  },
  refundedShipment: {
    defaultMessage: "Shipment was refunded",
    description: "shipment refund title"
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
  const { id, date, type, user, lines, amount, shippingCostsIncluded } = event;
  const classes = useStyles({});
  const intl = useIntl();

  const eventTypeInCamelCase = camelCase(type);

  const employeeName = `${user.firstName} ${user.lastName}`;

  const titleElements = [
    { text: intl.formatMessage(titles[eventTypeInCamelCase]) },
    { link: staffMemberDetailsUrl(user.id), text: employeeName }
  ];

  return (
    <TimelineEvent date={date} titleElements={titleElements} key={id}>
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
              {event.lines.map(line => (
                <tr key={line.orderLine.id}>
                  <td className={classes.linesTableCell}>
                    {line.orderLine.productName}
                  </td>
                  <td className={classes.linesTableCell}>
                    <Typography variant="caption" color="textSecondary">
                      {line.orderLine.variantName}
                    </Typography>
                  </td>
                  <td className={classes.linesTableCell}>
                    <Typography variant="caption" color="textSecondary">
                      {`qty: ${line.quantity}`}
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
                  amount: event.amount,
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
    </TimelineEvent>
  );
};

export default ExtendedTimelineEvent;
