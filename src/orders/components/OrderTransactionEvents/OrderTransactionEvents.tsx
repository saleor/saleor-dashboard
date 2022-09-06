import { TableCell, TableRow } from "@material-ui/core";
import { TransactionEventFragment } from "@saleor/graphql";
import useLocale from "@saleor/hooks/useLocale";
import { makeStyles, ResponsiveTable } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import classnames from "classnames";
import React, { useState } from "react";

import EventStatus from "./EventStatus";
import PspReference from "./PspReference";

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
  theme => ({
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    table: {
      "& td": {
        // Gap = 24px
        paddingLeft: "12px",
        paddingRight: "12px",
        "&:first-child": {
          // Override for Material first td
          paddingRight: "12px !important",
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
        paddingRight: "32px !important",
        width: "35%",
        textAlign: "right",
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
  const [hoveredPspRef, setHoveredPspRef] = useState(null);

  return (
    <ResponsiveTable
      className={classes.table}
      onMouseLeave={() => setHoveredPspRef(null)}
      flexBreakpoint="lg"
    >
      {renderCollection(events, transactionEvent => (
        <TableRow
          onMouseOver={() =>
            setHoveredPspRef(transactionEvent.reference || null)
          }
          className={classnames(
            transactionEvent.reference === hoveredPspRef && classes.hover,
          )}
        >
          <TableCell
            className={classnames(classes.colSmall, classes.colStatus)}
          >
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
              className={classnames(classes.colSmall, classes.colPspReference)}
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

export default OrderTransactionEvents;
