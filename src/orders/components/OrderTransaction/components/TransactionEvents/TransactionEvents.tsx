import { TableCell, TableRow } from "@material-ui/core";
import EventTime from "@saleor/components/EventTime";
import { TransactionEventFragment } from "@saleor/graphql";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import clsx from "clsx";
import React, { useState } from "react";

import { EventStatus, PspReference } from "./components";

export interface OrderTransactionEventsProps {
  events: TransactionEventFragment[];
}

const useStyles = makeStyles(
  theme => ({
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
    },
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
    hover: {
      backgroundColor: theme.palette.saleor.active[5],
    },
    colSmall: {
      [theme.breakpoints.down("md")]: {
        // Take as little space as possible on mobile
        width: "1%",
        whiteSpace: "nowrap",
      },
    },
    colStatus: {
      [theme.breakpoints.up("md")]: {
        // Max text with "Success"
        width: "126px",
      },
    },
    colPspReference: {
      [theme.breakpoints.up("md")]: {
        width: "250px",
      },
    },
    colLast: {
      // Align with card
      [theme.breakpoints.up("md")]: {
        "&&&": {
          paddingRight: "32px",
          width: "35%",
          textAlign: "right",
        },
      },
      [theme.breakpoints.down("md")]: {
        whiteSpace: "nowrap",
      },
    },
  }),
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
      {renderCollection(events, transactionEvent => (
        <TableRow
          onMouseOver={() =>
            setHoveredPspReference(transactionEvent.reference || null)
          }
          className={clsx(
            transactionEvent.reference === hoveredPspReference && classes.hover,
          )}
        >
          <TableCell className={clsx(classes.colSmall, classes.colStatus)}>
            <EventStatus status={transactionEvent.status} />
          </TableCell>
          <TableCell
            className={classes.colSmall}
            colSpan={!transactionEvent.reference && 2}
          >
            {transactionEvent.name}
          </TableCell>
          {transactionEvent.reference && (
            <TableCell
              className={clsx(classes.colSmall, classes.colPspReference)}
            >
              <PspReference reference={transactionEvent.reference} />
            </TableCell>
          )}
          <TableCell className={classes.colLast}>
            <EventTime date={transactionEvent.createdAt} />
          </TableCell>
        </TableRow>
      ))}
    </ResponsiveTable>
  );
};
