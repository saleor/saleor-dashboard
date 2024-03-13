import { DateTime } from "@dashboard/components/Date";
import {
  EventDeliveryStatusEnum,
  useAppWebhookDeliveriesQuery,
} from "@dashboard/graphql";
import {
  Accordion,
  Box,
  BoxProps,
  Chip,
  Skeleton,
  Text,
  ThemeTokensValues,
} from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface AppWebhooksDisplayProps extends BoxProps {
  appId: string;
}

const Wrapper = (boxProps: BoxProps) => {
  const intl = useIntl();

  return (
    <Box {...boxProps}>
      <Text variant={"heading"} marginBottom={4} as={"h2"}>
        {intl.formatMessage({
          defaultMessage: "App Webhooks",
          id: "eQ7bCN",
        })}
      </Text>
      <Text>
        {intl.formatMessage({
          defaultMessage:
            "All webhooks registered by this app. In case of failed webhook delivery, list of attempts is displayed.",
          id: "Xy48q5",
        })}
      </Text>
      <Box marginTop={6}>{boxProps.children}</Box>
    </Box>
  );
};

const mapDeliveryStatusToTextColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["text"] => {
  switch (status) {
    case EventDeliveryStatusEnum.FAILED:
      return "critical1";
    case EventDeliveryStatusEnum.PENDING:
      return "accent1";
    case EventDeliveryStatusEnum.SUCCESS:
      return "success1";
  }
};

const mapDeliveryStatusToBackgroundColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["background"] => {
  switch (status) {
    case EventDeliveryStatusEnum.FAILED:
      return "default2";
    case EventDeliveryStatusEnum.PENDING:
      return "default1";
    case EventDeliveryStatusEnum.SUCCESS:
      return "accent1";
  }
};

const DeliveryStatusDisplay = ({
  status,
}: {
  status: EventDeliveryStatusEnum;
}) => {
  const { formatMessage } = useIntl();

  switch (status) {
    case EventDeliveryStatusEnum.FAILED:
      return <>{formatMessage({ defaultMessage: "Failed", id: "vXCeIi" })}</>;
    case EventDeliveryStatusEnum.PENDING:
      return <>{formatMessage({ defaultMessage: "Pending", id: "eKEL/g" })}</>;
    case EventDeliveryStatusEnum.SUCCESS:
      return <>{formatMessage({ defaultMessage: "Success", id: "xrKHS6" })} </>;
    default:
      throw new Error("Invalid EventDeliveryStatusEnum value");
  }
};

const StatusChip = ({ status }: { status: EventDeliveryStatusEnum }) => {
  return (
    <Chip backgroundColor={mapDeliveryStatusToBackgroundColor(status)}>
      <Text color={mapDeliveryStatusToTextColor(status)}>
        <DeliveryStatusDisplay status={status} />
      </Text>
    </Chip>
  );
};

const DisabledWebhookChip = () => {
  const { formatMessage } = useIntl();

  return (
    <Chip backgroundColor="default1">
      <Text color="default1">
        {formatMessage({
          defaultMessage: "Disabled",
          id: "tthToS",
        })}
      </Text>
    </Chip>
  );
};

/**
 * Refresh webhooks deliveries every 5 seconds
 */
const REFRESH_INTERVAL = 5000;

export const AppWebhooksDisplay = ({
  appId,
  ...boxProps
}: AppWebhooksDisplayProps) => {
  const { formatMessage } = useIntl();

  const { data: webhooksData, loading } = useAppWebhookDeliveriesQuery({
    variables: { appId },
    pollInterval: REFRESH_INTERVAL,
  });

  if (loading) {
    return (
      <Wrapper {...boxProps}>
        <Skeleton height={8} marginBottom={4} />
        <Skeleton height={8} marginBottom={4} />
        <Skeleton height={8} />
      </Wrapper>
    );
  }

  if (webhooksData?.app?.webhooks) {
    return (
      <Wrapper {...boxProps}>
        <Accordion>
          {webhooksData.app.webhooks.map((wh, index) => {
            const isLastWebhook =
              index === (webhooksData?.app?.webhooks ?? []).length - 1;

            const events = [...wh.asyncEvents, ...wh.syncEvents]
              .flatMap(e => e.name)
              .join(", ");

            const eventDeliveries = wh.eventDeliveries?.edges ?? [];

            return (
              <Box
                key={wh.id}
                padding={4}
                borderBottomWidth={isLastWebhook ? 0 : 1}
                borderColor="default1"
                borderBottomStyle="solid"
              >
                <Box>
                  <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                    marginBottom={2}
                  >
                    <Text>{wh.name}</Text>
                    {!wh.isActive && <DisabledWebhookChip />}
                  </Box>
                  <Text variant="caption" size="small">
                    {events}
                  </Text>
                </Box>
                {eventDeliveries.length > 0 && (
                  <Accordion.Item
                    value={wh.id}
                    marginTop={6}
                    borderColor="default1"
                    borderWidth={1}
                    borderStyle="solid"
                    paddingY={2}
                    paddingX={4}
                    borderRadius={4}
                  >
                    <Accordion.Trigger alignItems="center">
                      <Text variant="button" as="h2">
                        {formatMessage({
                          defaultMessage:
                            "Pending & failed deliveries (last 10)",
                          id: "SRMNCS",
                        })}
                      </Text>
                      <Accordion.TriggerButton />
                    </Accordion.Trigger>
                    <Accordion.Content marginTop={6}>
                      {eventDeliveries.map(ed => {
                        const { createdAt } = ed.node;
                        const attempts = ed.node.attempts?.edges ?? [];

                        const attemptsCount = attempts.length;
                        const lastAttemptDate =
                          attempts[attemptsCount - 1]?.node.createdAt;

                        return (
                          <Box key={createdAt} marginBottom={4}>
                            <Box
                              paddingLeft={0}
                              display="grid"
                              __gridTemplateColumns={"1fr 1fr"}
                            >
                              <Text as="p" typeSize={4} fontWeight="bold">
                                <DateTime plain date={createdAt} />
                              </Text>
                              <Box marginLeft="auto">
                                <StatusChip status={ed.node.status} />
                              </Box>
                            </Box>
                            {attempts.length > 0 && (
                              <Box>
                                <Text>
                                  {formatMessage({
                                    defaultMessage: "Attempts:",
                                    id: "OFTsI1",
                                  })}{" "}
                                  <Text typeSize={4} fontWeight="bold">
                                    {attemptsCount} / 6
                                  </Text>
                                </Text>
                                <Text as="p">
                                  {formatMessage({
                                    defaultMessage: "Last delivery attempt:",
                                    id: "EY/jqC",
                                  })}{" "}
                                  <DateTime plain date={lastAttemptDate} />
                                </Text>
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Accordion.Content>
                  </Accordion.Item>
                )}
              </Box>
            );
          })}
        </Accordion>
      </Wrapper>
    );
  }

  return null;
};
