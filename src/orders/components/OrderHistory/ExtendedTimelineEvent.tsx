// @ts-strict-ignore
import Money from "@dashboard/components/Money";
import { TimelineEvent } from "@dashboard/components/Timeline";
import { OrderEventFragment, OrderEventsEnum } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Text } from "@saleor/macaw-ui-next";
import camelCase from "lodash/camelCase";
import { defineMessages, useIntl } from "react-intl";

import ExtendedDiscountTimelineEvent from "./ExtendedDiscountTimelineEvent";
import Label from "./Label";
import {
  getOrderNumberLink,
  hasOrderLineDiscountWithNoPreviousValue,
  isTimelineEventOfDiscountType,
} from "./utils";

const useStyles = makeStyles(
  theme => ({
    eventSubtitle: {
      marginBottom: theme.spacing(0.5),
      marginTop: theme.spacing(1),
    },
    header: {
      fontWeight: 500,
      marginBottom: theme.spacing(1),
    },
    linesTableCell: {
      paddingRight: theme.spacing(3),
    },
    root: { marginTop: theme.spacing(4) },
    topSpacer: {
      marginTop: theme.spacing(3),
    },
    user: {
      marginBottom: theme.spacing(1),
    },
  }),
  { name: "OrderHistory" },
);

const productTitles = defineMessages({
  draftCreatedFromReplace: {
    id: "a1uffz",
    defaultMessage: "Products replaced",
    description: "draft created from replace products list title",
  },
  fulfillmentRefunded: {
    id: "sHON47",
    defaultMessage: "Products refunded",
    description: "refunded products list title",
  },
  fulfillmentReplaced: {
    id: "nki0o/",
    defaultMessage: "Products replaced",
    description: "replaced products list title",
  },
  fulfillmentReturned: {
    id: "L5io1l",
    defaultMessage: "Products returned",
    description: "returned products list title",
  },
});

const titles = defineMessages({
  draftCreatedFromReplace: {
    id: "H6SfJd",
    defaultMessage: "Draft was reissued from order",
    description: "draft created from replace event title",
  },
  fulfillmentRefunded: {
    id: "werrDz",
    defaultMessage: "Products were refunded",
    description: "refunded event title",
  },
  fulfillmentReplaced: {
    id: "AWGJnU",
    defaultMessage: "Products were replaced",
    description: "replaced event title",
  },
  fulfillmentReturned: {
    id: "VtlDMr",
    defaultMessage: "Products were returned",
    description: "returned event title",
  },
  orderDiscountAdded: {
    id: "IUWJKt",
    defaultMessage: "Order was discounted",
    description: "order was discounted event title",
  },
  orderDiscountAutomaticallyUpdated: {
    id: "8V1ozm",
    defaultMessage: "Order discount was updated automatically",
    description: "order discount was updated automatically event title",
  },
  orderDiscountUpdated: {
    id: "JYfMRO",
    defaultMessage: "Order discount was updated",
    description: "order discount was updated event title",
  },
  orderLineDiscountAdded: {
    id: "vV9xwl",
    defaultMessage: "{productName} discount was added",
    description: "order line discount added title",
  },
  orderLineDiscountUpdated: {
    id: "bKCoN5",
    defaultMessage: "{productName} discount was updated",
    description: "order line discount updated title",
  },
  orderMarkedAsPaid: {
    id: "TQlnsR",
    defaultMessage: "Order was marked as paid",
    description: "order marked as paid event title",
  },
});

const messages = defineMessages({
  refundedAmount: {
    id: "nngeI3",
    defaultMessage: "Refunded amount",
    description: "amount title",
  },
  refundedShipment: {
    id: "Krzyo+",
    defaultMessage: "Shipment was refunded",
    description: "shipment refund title",
  },
  transactionReference: {
    id: "XWGZLL",
    defaultMessage: "Transaction reference",
    description: "transaction reference subtitle",
  },
});

interface ExtendedTimelineEventProps {
  event: OrderEventFragment;
  orderCurrency: string;
  hasPlainDate?: boolean;
  dateNode?: React.ReactNode;
  isLastInGroup?: boolean;
}

const ExtendedTimelineEvent = ({
  event,
  orderCurrency,
  hasPlainDate,
  dateNode,
  isLastInGroup,
}: ExtendedTimelineEventProps) => {
  const { id, date, type, lines, amount, transactionReference, shippingCostsIncluded } = event;
  const classes = useStyles({});
  const intl = useIntl();
  const eventTypeInCamelCase = camelCase(type);
  const getEventTitleMessageInCamelCase = () => {
    if (hasOrderLineDiscountWithNoPreviousValue(event)) {
      return titles.orderLineDiscountAdded;
    }

    return titles[eventTypeInCamelCase];
  };
  const getTitleProps = () => {
    if (type === OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED) {
      return { productName: lines[0]?.itemName };
    }

    return {};
  };
  const titleElements = {
    orderNumber: getOrderNumberLink(event),
    title: {
      text: intl.formatMessage(getEventTitleMessageInCamelCase(), getTitleProps()),
    },
  };
  const selectTitleElements = () => {
    const { title, orderNumber } = titleElements;

    switch (type) {
      case OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE: {
        return [title, orderNumber];
      }
      default: {
        return [title];
      }
    }
  };

  if (isTimelineEventOfDiscountType(type)) {
    return (
      <ExtendedDiscountTimelineEvent
        event={event}
        titleElements={selectTitleElements()}
        isLastInGroup={isLastInGroup}
      />
    );
  }

  return (
    <TimelineEvent
      date={date}
      titleElements={selectTitleElements()}
      key={id}
      hasPlainDate={hasPlainDate}
      dateNode={dateNode}
      eventData={event}
      user={event.user}
      eventType={type}
      isLastInGroup={isLastInGroup}
    >
      {lines && (
        <>
          <Label text={intl.formatMessage(productTitles[eventTypeInCamelCase])} />
          <table>
            <tbody>
              {lines.map(({ orderLine, quantity, itemName }, i) => (
                <tr key={`${itemName}-${i}`}>
                  <td className={classes.linesTableCell}>{orderLine?.productName || itemName}</td>
                  <td className={classes.linesTableCell}>
                    <Label text={orderLine?.variantName} />
                  </td>
                  <td className={classes.linesTableCell}>
                    <Label text={`qty: ${quantity}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(amount || amount === 0) && (
            <>
              <Label text={intl.formatMessage(messages.refundedAmount)} />
              <Money
                money={{
                  amount,
                  currency: orderCurrency,
                }}
              />
            </>
          )}
          {shippingCostsIncluded && <Text>{intl.formatMessage(messages.refundedShipment)}</Text>}
        </>
      )}

      {!!transactionReference && (
        <>
          <Label text={intl.formatMessage(messages.transactionReference)} />
          <Text>{transactionReference}</Text>
        </>
      )}
    </TimelineEvent>
  );
};

export default ExtendedTimelineEvent;
