// @ts-strict-ignore
import { capitalize } from "@dashboard/misc";
import { transactionEventTypeMap } from "@dashboard/orders/messages";
import { TransactionEventType } from "@dashboard/orders/types";
import { Box, Text, Tooltip } from "@saleor/macaw-ui-next";
import { Info } from "lucide-react";
import { useIntl } from "react-intl";

import styles from "./EventType.module.css";

interface EventTypeProps {
  type: TransactionEventType;
  message: string | undefined;
}

export const EventType = ({ type, message }: EventTypeProps) => {
  const intl = useIntl();
  const mapEventToMessage = transactionEventTypeMap[type];
  const displayType = capitalize(
    mapEventToMessage ? intl.formatMessage(mapEventToMessage) : message || type,
  );

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Text size={2} className={styles.lineClamp}>
        {displayType}
      </Text>
      {displayType !== message && message && (
        <Tooltip>
          <Tooltip.Trigger>
            <Box display="flex" cursor="pointer" padding={1} flexShrink="0">
              <Info size={16} />
            </Box>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Arrow />
            <Box __maxWidth="500px">
              <Text size={2}>{message}</Text>
            </Box>
          </Tooltip.Content>
        </Tooltip>
      )}
    </Box>
  );
};
