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

export const TransactionEvents: React.FC<OrderTransactionEventsProps> = ({
  events,
}) => {
  const classes = useStyles();
  const [hoveredPspReference, setHoveredPspReference] = useState(null);

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
          />
        ),
      )}
    </ResponsiveTable>
  );
};
