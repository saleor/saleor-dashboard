// @ts-strict-ignore
import { capitalize } from "@dashboard/misc";
import { transactionEventTypeMap } from "@dashboard/orders/messages";
import { TransactionEventType } from "@dashboard/orders/types";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, InfoIcon, Tooltip } from "@saleor/macaw-ui-next";
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
  const displayType = capitalize(
    mapEventToMessage ? intl.formatMessage(mapEventToMessage) : message || type,
  );

  return (
    <Box display="flex" alignItems="center">
      {displayType}
      {displayType !== message && message && (
        <Tooltip>
          <Tooltip.Trigger>
            <div className={classes.tooltipWrapper}>
              <InfoIcon />
            </div>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Arrow />
            {message}
          </Tooltip.Content>
        </Tooltip>
      )}
    </Box>
  );
};
