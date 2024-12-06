import { DateTime } from "@dashboard/components/Date";
import { EventDeliveryAttemptFragment, EventDeliveryStatusEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { AppWebhooksAttemptDetails } from "./AppWebhooksAttemptDetails";
import { EventDeliveryStatusChip } from "./EventDeliveriesStatus";

interface EventDeliveryItemProps {
  createdAt: string;
  attemptsCount: number;
  status: EventDeliveryStatusEnum;
  attempts: EventDeliveryAttemptFragment[];
  lastAttemptDate: string;
  hasMore: boolean;
  dataTestId?: string;
}

const MAX_ATTEMPTS = 6;

export const EventDeliveryItem = ({
  createdAt,
  status,
  attemptsCount,
  attempts,
  lastAttemptDate,
  hasMore,
  dataTestId,
}: EventDeliveryItemProps) => {
  const intl = useIntl();

  return (
    <Box key={createdAt} marginBottom={hasMore ? 4 : undefined} data-test-id={dataTestId}>
      <Box display="grid" __gridTemplateColumns="1fr 1fr" paddingX={4}>
        <Text as="p" size={4} fontWeight="bold">
          <DateTime plain date={createdAt} />
        </Text>
        <Box marginLeft="auto">
          <EventDeliveryStatusChip status={status} />
        </Box>
      </Box>
      {attempts.length > 0 && (
        <Box marginBottom={2} paddingX={4}>
          <Text>
            {intl.formatMessage({
              defaultMessage: "Attempts:",
              id: "OFTsI1",
            })}{" "}
            <Text size={4} fontWeight="bold">
              {attemptsCount} / {MAX_ATTEMPTS}
            </Text>
          </Text>
          <Text as="p">
            {intl.formatMessage({
              defaultMessage: "Last delivery attempt:",
              id: "EY/jqC",
            })}{" "}
            <DateTime plain date={lastAttemptDate} />
          </Text>
        </Box>
      )}

      <Box
        borderStyle="solid"
        borderWidth={1}
        borderColor={{
          default: "default1",
          hover: "default1Hovered",
        }}
        margin={4}
        padding={2}
        borderRadius={4}
      >
        {attempts.map(attempt => (
          <AppWebhooksAttemptDetails attempt={attempt} key={`attempt-details-${attempt.id}`} />
        ))}
      </Box>
    </Box>
  );
};
