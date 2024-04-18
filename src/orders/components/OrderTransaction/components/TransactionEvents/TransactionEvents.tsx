// @ts-strict-ignore
import { TransactionEventFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { EventItem } from "./components";
import { messages } from "./messages";

export interface OrderTransactionEventsProps {
  events: TransactionEventFragment[] | TransactionFakeEvent[];
}

const useStyles = makeStyles(
  theme => ({
    table: {
      "&& td": {
        paddingLeft: vars.spacing[4],
        paddingRight: vars.spacing[4],
        "&:first-child": {
          paddingLeft: vars.spacing[9],
        },
      },
    },
    noEvent: {
      color: theme.palette.saleor.main[2],
    },
  }),
  {
    name: "OrderTransactionEvents",
  },
);
const isFakeEventsList = (
  events: TransactionEventFragment[] | TransactionFakeEvent[],
): events is TransactionFakeEvent[] => events[0]?.__typename === "TransactionFakeEvent";

export const TransactionEvents: React.FC<OrderTransactionEventsProps> = ({ events }) => {
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
            key={transactionEvent.id}
            event={transactionEvent}
            onHover={setHoveredPspReference}
            hoveredPspReference={hoveredPspReference}
            hasCreatedBy={hasCreatedBy}
          />
        ),
        () => (
          <TableRow>
            <TableCell className={classes.noEvent}>
              <FormattedMessage {...messages.noEvents} />
            </TableCell>
          </TableRow>
        ),
      )}
    </ResponsiveTable>
  );
};
