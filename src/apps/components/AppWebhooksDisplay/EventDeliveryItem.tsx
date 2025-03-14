import EventTime from "@dashboard/components/EventTime";
import { EventDeliveryAttemptFragment, EventDeliveryStatusEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { AppWebhooksAttemptDetails } from "./AppWebhooksAttemptDetails";
import { EventDeliveryStatusChip } from "./EventDeliveriesStatus";

interface EventDeliveryItemProps {
  createdAt: string;
  attemptsCount: number;
  status: EventDeliveryStatusEnum;
  attempts: EventDeliveryAttemptFragment[];
  hasMore: boolean;
  deliveryId: string;
}

const MAX_ATTEMPTS = 6;

export const EventDeliveryItem: React.FC<EventDeliveryItemProps> = ({
  createdAt,
  status,
  attemptsCount,
  attempts,
  hasMore,
  deliveryId,
}) => {
  const intl = useIntl();

  return (
    <Box
      key={createdAt}
      marginBottom={hasMore ? 4 : undefined}
      data-test-id={deliveryId}
      position="relative"
    >
      <Box marginLeft="auto" position="absolute" right={4} top={0}>
        <EventDeliveryStatusChip status={status} />
      </Box>
      {attempts.length > 0 && (
        <Box as="table" marginBottom={2} paddingLeft={4} style={{ borderSpacing: "8px 0" }}>
          <tr>
            <td>
              <Text>
                {intl.formatMessage({
                  defaultMessage: "Delivery start:",
                  id: "fKLe7r",
                })}
              </Text>
            </td>
            <td>
              <Text size={4} fontWeight="bold">
                <EventTime date={createdAt} showSeconds />
              </Text>
            </td>
          </tr>

          <tr>
            <td>
              <Text>
                {intl.formatMessage({
                  defaultMessage: "Attempts:",
                  id: "OFTsI1",
                })}
              </Text>
            </td>
            <td>
              <Text size={4} fontWeight="bold">
                {attemptsCount} / {MAX_ATTEMPTS}
              </Text>
            </td>
          </tr>

          <tr>
            <td>
              <Text>
                {intl.formatMessage({
                  defaultMessage: "ID:",
                  id: "tmcdrp",
                })}
              </Text>
            </td>

            <td>
              <Text size={4} fontWeight="bold">
                {deliveryId}
              </Text>
            </td>
          </tr>
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
