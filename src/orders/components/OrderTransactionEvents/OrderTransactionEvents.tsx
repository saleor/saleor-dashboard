import { TableCell, TableRow } from "@material-ui/core";
import EventTime from "@saleor/components/EventTime";
import { TransactionEventFragment } from "@saleor/graphql";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import classnames from "classnames";
import React, { useState } from "react";

import EventStatus from "./EventStatus";
import PspReference from "./PspReference";

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

const OrderTransactionEvents: React.FC<OrderTransactionEventsProps> = ({
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
            setHoveredPspReference(transactionEvent.pspReference || null)
          }
          className={classnames(
            transactionEvent.pspReference === hoveredPspReference &&
              classes.hover,
          )}
        >
          <TableCell
            className={classnames(classes.colSmall, classes.colStatus)}
          >
            <EventStatus status={transactionEvent.status} />
          </TableCell>
          <TableCell
            className={classes.colSmall}
            colSpan={!transactionEvent.pspReference && 2}
          >
            {transactionEvent.name}
          </TableCell>
          {transactionEvent.pspReference && (
            <TableCell
              className={classnames(classes.colSmall, classes.colPspReference)}
            >
              <PspReference reference={transactionEvent.pspReference} />
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

export default OrderTransactionEvents;
