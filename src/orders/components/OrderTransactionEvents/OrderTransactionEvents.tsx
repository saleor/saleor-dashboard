import { TransactionEventFragment } from "@saleor/graphql";
import useLocale from "@saleor/hooks/useLocale";
import {
  List,
  ListItem,
  ListItemCell,
  makeStyles,
  Pill,
} from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";

import EventStatus from "./EventStatus";

export interface OrderTransactionEventsProps {
  events: TransactionEventFragment[];
}

const EventTime: React.FC<{ date: string }> = ({ date }) => {
  const { locale } = useLocale();
  const intl = new Intl.DateTimeFormat(locale, {
    timeZoneName: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return <time dateTime={date}>{intl.format(new Date(date))}</time>;
};

const useStyles = makeStyles(
  {
    first: {
      "&&": {
        paddingLeft: 0,
      },
    },
  },
  {
    name: "OrderTransactionEvents",
  },
);

const OrderTransactionEvents: React.FC<OrderTransactionEventsProps> = ({
  events,
}) => {
  const classes = useStyles();
  return (
    <List gridTemplate={["minmax(84px, auto)", "auto", "auto", "1fr"]}>
      {renderCollection(events, event => (
        <ListItem>
          <ListItemCell className={classes.first}>
            <EventStatus status={event.status} />
          </ListItemCell>
          <ListItemCell>{event.name}</ListItemCell>
          <ListItemCell>
            {event.reference && (
              <Pill outlined color="generic" label={event.reference} />
            )}
          </ListItemCell>
          <ListItemCell>
            <EventTime date={event.createdAt} />
          </ListItemCell>
        </ListItem>
      ))}
    </List>
  );
};

export default OrderTransactionEvents;
