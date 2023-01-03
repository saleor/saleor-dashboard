import { TableCell, TableRow } from "@material-ui/core";
import Money from "@saleor/components/Money";
import { TransactionEventFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { TransactionFakeEvent } from "@saleor/orders/types";
import clsx from "clsx";
import React from "react";

import { mapTransactionEvent } from "../../../utils";
import { EventStatus } from "./EventStatus";
import { EventTime } from "./EventTime";
import { EventType } from "./EventType";
import { PspReference } from "./PspReference";

interface EventItemProps {
  event: TransactionEventFragment | TransactionFakeEvent;
  onHover: (pspReference: string) => void;
  hoveredPspReference: string;
}

const useStyles = makeStyles(
  theme => ({
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
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
  { name: "OrderTransactionEvents-EventItem" },
);

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onHover,
  hoveredPspReference,
}) => {
  const classes = useStyles();
  const { type, status } = mapTransactionEvent(event);

  return (
    <TableRow
      onMouseOver={() => onHover(event.pspReference)}
      className={clsx(
        event.pspReference === hoveredPspReference && classes.hover,
      )}
    >
      <TableCell className={clsx(classes.colSmall, classes.colStatus)}>
        <EventStatus status={status} />
      </TableCell>
      <TableCell>
        <Money money={event.amount} />
      </TableCell>
      <TableCell
        className={classes.colSmall}
        colSpan={!event.pspReference && 2}
      >
        <EventType type={type} />
      </TableCell>
      {event.pspReference && (
        <TableCell className={clsx(classes.colSmall, classes.colPspReference)}>
          <PspReference
            reference={event.pspReference}
            url={event.externalUrl}
          />
        </TableCell>
      )}
      <TableCell className={classes.colLast}>
        <EventTime date={event.createdAt} />
      </TableCell>
    </TableRow>
  );
};
