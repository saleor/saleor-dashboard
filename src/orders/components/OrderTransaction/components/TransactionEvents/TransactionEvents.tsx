// @ts-strict-ignore
import { TransactionEventFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { vars } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { EventItem } from "./components";
import { messages } from "./messages";

interface OrderTransactionEventsProps {
  events: TransactionEventFragment[] | TransactionFakeEvent[];
}

const useStyles = makeStyles(
  theme => ({
    table: {
      "&& td": {
        paddingLeft: vars.spacing[3],
        paddingRight: vars.spacing[3],
        paddingTop: vars.spacing[3],
        paddingBottom: vars.spacing[3],
        "&:first-child": {
          paddingLeft: "48px",
        },
      },
      "&& tr:last-child td": {
        borderBottom: "none",
      },
    },
    noEvent: {
      color: theme.palette.saleor.main[2],
      paddingLeft: "48px !important",
    },
  }),
  {
    name: "OrderTransactionEvents",
  },
);

export const TransactionEvents = ({ events }: OrderTransactionEventsProps) => {
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
            key={transactionEvent.id}
            event={transactionEvent}
            onHover={setHoveredPspReference}
            hoveredPspReference={hoveredPspReference}
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
