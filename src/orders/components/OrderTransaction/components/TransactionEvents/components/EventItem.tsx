import Money from "@dashboard/components/Money";
import {
  TransactionEventFragment,
  TransactionEventTypeEnum,
} from "@dashboard/graphql";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";

import { mapTransactionEvent } from "../../../utils";
import { EventCreatedBy } from "./EventCreatedBy";
import { EventStatus } from "./EventStatus";
import { EventTime } from "./EventTime";
import { EventType } from "./EventType";
import { PspReference } from "./PspReference";

interface EventItemProps {
  event: TransactionEventFragment | TransactionFakeEvent;
  onHover: (pspReference: string) => void;
  hoveredPspReference: string;
  hasCreatedBy: boolean;
}

const useStyles = makeStyles(
  theme => ({
    cardContent: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    row: {
      "&&:hover": {
        backgroundColor: theme.palette.saleor.active[5],
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
    colMessage: {
      minWidth: "200px",
      maxWidth: "250px",
      wordBreak: "break-word",
      whiteSpace: "normal",
    },
    colPspReference: {
      minWidth: "10px",
      maxWidth: "150px",
    },
    spacer: {
      minWidth: "150px",
      maxWidth: "150px",
    },
    colDate: {
      width: "25%",
      whiteSpace: "nowrap",
    },
    colCreatedBy: {
      width: "20%",
    },
    colLast: {
      // Align with card
      [theme.breakpoints.up("md")]: {
        "&&&": {
          paddingRight: "32px",
          textAlign: "right",
        },
      },
      [theme.breakpoints.down("md")]: {
        whiteSpace: "nowrap",
      },
      "&$colDate": {
        width: "35%",
      },
    },
  }),
  { name: "OrderTransactionEvents-EventItem" },
);

const eventsWithoutAmount = new Set([
  TransactionEventTypeEnum.CANCEL_SUCCESS,
  TransactionEventTypeEnum.CANCEL_REQUEST,
  TransactionEventTypeEnum.CANCEL_FAILURE,
]);

const shouldShowAmount = (
  event: TransactionEventFragment | TransactionFakeEvent,
) => {
  if (!event || !event.amount?.currency) {
    return false;
  }

  if (
    event.__typename === "TransactionEvent" &&
    event.type &&
    eventsWithoutAmount.has(event.type)
  ) {
    return false;
  }

  return true;
};

export const EventItem: React.FC<EventItemProps> = ({
  event,
  onHover,
  hoveredPspReference,
  hasCreatedBy,
}) => {
  const classes = useStyles();
  const { type, status } = mapTransactionEvent(event);

  const isHovered =
    event.pspReference && event.pspReference === hoveredPspReference;

  return (
    <TableRow
      onMouseOver={() => onHover(event.pspReference)}
      className={clsx(classes.row, isHovered && classes.hover)}
      data-ishovered={isHovered}
    >
      <TableCell className={clsx(classes.colSmall, classes.colStatus)}>
        <EventStatus status={status} />
      </TableCell>
      <TableCell>
        {shouldShowAmount(event) && <Money money={event.amount} />}
      </TableCell>
      <TableCell className={clsx(classes.colSmall, classes.colMessage)}>
        <EventType type={type} message={event.message} />
      </TableCell>
      <TableCell className={clsx(classes.colSmall, classes.colPspReference)}>
        {event.pspReference ? (
          <PspReference
            reference={event.pspReference}
            url={event.externalUrl}
          />
        ) : (
          <div className={classes.spacer} />
        )}
      </TableCell>
      <TableCell
        className={clsx(classes.colDate, !hasCreatedBy && classes.colLast)}
      >
        <EventTime date={event.createdAt} />
      </TableCell>
      {hasCreatedBy && (
        <TableCell className={clsx(classes.colCreatedBy, classes.colLast)}>
          <EventCreatedBy createdBy={event.createdBy} />
        </TableCell>
      )}
    </TableRow>
  );
};
