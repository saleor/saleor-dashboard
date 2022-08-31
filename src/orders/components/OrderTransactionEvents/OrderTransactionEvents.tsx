import { LocaleConsumer } from "@saleor/components/Locale";
import { TimezoneConsumer } from "@saleor/components/Timezone";
import { TransactionEventFragment } from "@saleor/graphql";
import {
  List,
  ListItem,
  ListItemCell,
  makeStyles,
  Pill,
} from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import ReactMoment from "react-moment";

import EventStatus from "./EventStatus";

export interface OrderTransactionEventsProps {
  events: TransactionEventFragment[];
}

const EventTime: React.FC<{ date: string }> = ({ date }) => (
  <TimezoneConsumer>
    {tz => (
      <LocaleConsumer>
        {({ locale }) => (
          <ReactMoment locale={locale} tz={tz} format="(zz) LLL">
            {date}
          </ReactMoment>
        )}
      </LocaleConsumer>
    )}
  </TimezoneConsumer>
);

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
            {event.reference && <Pill outlined label={event.reference} />}
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
