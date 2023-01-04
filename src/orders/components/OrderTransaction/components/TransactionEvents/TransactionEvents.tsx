import { TransactionEventFragment } from "@saleor/graphql";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import { TransactionFakeEvent } from "@saleor/orders/types";
import React, { useState } from "react";

import { EventItem } from "./components";

export interface OrderTransactionEventsProps {
  events: TransactionEventFragment[] | TransactionFakeEvent[];
}

const useStyles = makeStyles(
  {
    table: {
      "&& td": {
        // Gap = 24px
        paddingLeft: "12px",
        paddingRight: "12px",
        "&:first-child": {
          // Override for Material first td
          paddingRight: "12px",
        },
      },
    },
  },
  {
    name: "OrderTransactionEvents",
  },
);

const isFakeEventsList = (
  events: TransactionEventFragment[] | TransactionFakeEvent[],
): events is TransactionFakeEvent[] =>
  events[0].__typename === "TransactionFakeEvent";

export const TransactionEvents: React.FC<OrderTransactionEventsProps> = ({
  events,
}) => {
  const classes = useStyles();
  const [hoveredPspReference, setHoveredPspReference] = useState(null);

  const hasCreatedBy = React.useMemo(() => {
    if (isFakeEventsList(events)) {
      return false;
    }
    return !!events.find(event => !!event.createdBy);
  }, [events]);

  return (
    <ResponsiveTable
      className={classes.table}
      onMouseLeave={() => setHoveredPspReference(null)}
      flexBreakpoint="lg"
    >
      {renderCollection<TransactionFakeEvent | TransactionEventFragment>(
        events,
        transactionEvent => (
          <EventItem
            event={transactionEvent}
            onHover={setHoveredPspReference}
            hoveredPspReference={hoveredPspReference}
            hasCreatedBy={hasCreatedBy}
          />
        ),
      )}
    </ResponsiveTable>
  );
};
