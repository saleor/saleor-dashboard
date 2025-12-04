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
  theme => ({
    row: {
      "&&&:hover": {
        backgroundColor: vars.colors.background.default1Hovered,
      },
    },
    linkedHighlight: {
      backgroundColor: vars.colors.background.default1Hovered,
    },
    colAvatar: {
      width: "32px",
      paddingRight: "0 !important",
    },
    colSmall: {
      [theme.breakpoints.down("md")]: {
        width: "1%",
        whiteSpace: "nowrap",
      },
    },
    colStatus: {
      [theme.breakpoints.up("md")]: {
        width: "100px",
      },
    },
    colAmount: {
      whiteSpace: "nowrap",
    },
    colMessage: {
      minWidth: "120px",
      maxWidth: "200px",
      wordBreak: "break-word",
      whiteSpace: "normal",
    },
    colPspReference: {
      minWidth: "10px",
      maxWidth: "150px",
    },
    colDate: {
      whiteSpace: "nowrap",
    },
    colLast: {
      [theme.breakpoints.up("md")]: {
        "&&&": {
          paddingRight: "24px",
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
      <TableCell className={clsx(classes.colSmall, classes.colStatus)}>
        <EventStatus status={status} />
      </TableCell>
      <TableCell className={classes.colAmount}>
        {shouldShowAmount(event) && (
          <Text size={2}>
            <Money money={event.amount} />
          </Text>
        )}
      </TableCell>
      <TableCell className={clsx(classes.colSmall, classes.colMessage)}>
        <EventType type={type} message={event.message} />
      </TableCell>
      <TableCell className={clsx(classes.colSmall, classes.colPspReference)}>
        {event.pspReference && (
          <PspReference reference={event.pspReference} url={event.externalUrl} />
        )}
      </TableCell>
      <TableCell className={clsx(classes.colDate, classes.colLast)}>
        <EventTime date={event.createdAt} />
      </TableCell>
    </TableRow>
  );
};
