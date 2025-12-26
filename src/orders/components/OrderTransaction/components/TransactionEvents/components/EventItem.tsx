import Money from "@dashboard/components/Money";
import { TransactionEventFragment, TransactionEventTypeEnum } from "@dashboard/graphql";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Text, vars } from "@saleor/macaw-ui-next";
import clsx from "clsx";

import { mapTransactionEvent } from "../../../utils";
import { EventAvatar } from "./EventAvatar";
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
  () => ({
    row: {
      "&&&:hover": {
        backgroundColor: vars.colors.background.default2,
      },
    },
    linkedHighlight: {
      backgroundColor: vars.colors.background.default2,
    },
    colAvatar: {
      "&&&": {
        width: 40,
        paddingRight: 0,
      },
    },
    colStatus: {
      width: 100,
      minWidth: 100,
      maxWidth: 100,
      whiteSpace: "nowrap",
    },
    colAmount: {
      "&&&": {
        width: 100,
        whiteSpace: "nowrap",
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
      },
    },
    colMessage: {},
    colPspReference: {
      textAlign: "right",
    },
    colDate: {
      "&&&": {
        width: 220,
        minWidth: 220,
        maxWidth: 220,
        whiteSpace: "nowrap",
        textAlign: "right",
        paddingRight: 24,
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

const shouldShowAmount = (event: TransactionEventFragment | TransactionFakeEvent) => {
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

export const EventItem = ({ event, onHover, hoveredPspReference }: EventItemProps) => {
  const classes = useStyles();
  const { type, status } = mapTransactionEvent(event);
  const isHovered = event.pspReference && event.pspReference === hoveredPspReference;
  const createdBy = event.__typename === "TransactionEvent" ? event.createdBy : null;

  return (
    <TableRow
      onMouseOver={() => onHover(event.pspReference)}
      className={clsx(classes.row, isHovered && classes.linkedHighlight)}
      data-ishovered={isHovered}
    >
      <TableCell className={classes.colAvatar}>
        <EventAvatar createdBy={createdBy} />
      </TableCell>
      <TableCell className={classes.colStatus}>
        <EventStatus status={status} />
      </TableCell>
      <TableCell className={classes.colMessage}>
        <EventType type={type} message={event.message} />
      </TableCell>
      <TableCell className={classes.colPspReference}>
        {event.pspReference && (
          <PspReference reference={event.pspReference} url={event.externalUrl} />
        )}
      </TableCell>
      <TableCell className={classes.colAmount}>
        {shouldShowAmount(event) ? (
          <Text size={2}>
            <Money money={event.amount} />
          </Text>
        ) : (
          <Text size={2} color="default2">
            —
          </Text>
        )}
      </TableCell>
      <TableCell className={classes.colDate}>
        <EventTime date={event.createdAt} />
      </TableCell>
    </TableRow>
  );
};
