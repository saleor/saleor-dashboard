import { transactionEventTypeMap } from "@dashboard/orders/messages";
import { TransactionEventType } from "@dashboard/orders/types";
import { makeStyles, Tooltip } from "@saleor/macaw-ui";
import { Box, InfoIcon } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

interface EventTypeProps {
  type: TransactionEventType;
  message: string | undefined;
}

const useStyles = makeStyles(
  theme => ({
    tooltipWrapper: {
      padding: theme.spacing(1),
      display: "flex",
      cursor: "pointer",
    },
  }),
  { name: "EventType" },
);

export const EventType = ({ type, message }: EventTypeProps) => {
  const intl = useIntl();
  const classes = useStyles();
  const mapEventToMessage = transactionEventTypeMap[type];

  const displayType = mapEventToMessage
    ? intl.formatMessage(mapEventToMessage)
    : type ?? message;

  return (
    <Box display="flex" alignItems="center">
      {displayType}
      {type !== null && message && (
        <Tooltip title={message}>
          <div className={classes.tooltipWrapper}>
            <InfoIcon />
          </div>
        </Tooltip>
      )}
    </Box>
  );
};
