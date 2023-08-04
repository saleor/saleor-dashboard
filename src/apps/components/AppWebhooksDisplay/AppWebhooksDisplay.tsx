import { DateTime } from "@dashboard/components/Date";
import {
  EventDeliveryStatusEnum,
  useAppWebhookDeliveriesQuery,
} from "@dashboard/graphql";
import {
  Box,
  BoxProps,
  Chip,
  Text,
  ThemeTokensValues,
} from "@saleor/macaw-ui/next";
import React from "react";

interface AppWebhooksDisplayProps extends BoxProps {
  appId: string;
}

const Wrapper = (boxProps: BoxProps) => {
  return (
    <Box {...boxProps}>
      <Text variant={"heading"} marginBottom={4} as={"h2"}>
        App Webhooks
      </Text>
      <Text>
        All webhooks registered by this app. In case of failed webhook delivery,
        list of attempts is displayed.
      </Text>
      <Box marginTop={6}>{boxProps.children}</Box>
    </Box>
  );
};

const mapDeliveryStatusToTextColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["foreground"] => {
  switch (status) {
    case EventDeliveryStatusEnum.FAILED:
      return "textCriticalDefault";
    case EventDeliveryStatusEnum.PENDING:
      return "textBrandDefault";
    case EventDeliveryStatusEnum.SUCCESS:
      return "text1Decorative";
  }
};

const mapDeliveryStatusToBackgroundColor = (
  status: EventDeliveryStatusEnum,
): keyof ThemeTokensValues["colors"]["background"] => {
  switch (status) {
    case EventDeliveryStatusEnum.FAILED:
      return "surfaceCriticalSubdued";
    case EventDeliveryStatusEnum.PENDING:
      return "surfaceNeutralDepressed";
    case EventDeliveryStatusEnum.SUCCESS:
      return "surfaceBrandSubdued";
  }
};

const StatusChip = ({ status }: { status: EventDeliveryStatusEnum }) => {
  return (
    <Chip backgroundColor={mapDeliveryStatusToBackgroundColor(status)}>
      <Text color={mapDeliveryStatusToTextColor(status)}>{status}</Text>
    </Chip>
  );
};

export const AppWebhooksDisplay = ({
  appId,
  ...boxProps
}: AppWebhooksDisplayProps) => {
  const { data: webhooksData, loading } = useAppWebhookDeliveriesQuery({
    variables: { appId },
  });

  if (loading) {
    return <Wrapper {...boxProps}>Loading</Wrapper>;
  }

  if (webhooksData) {
    return (
      <Wrapper {...boxProps}>
        <Box>
          {webhooksData.app.webhooks.map(wh => {
            const events = [...wh.asyncEvents, ...wh.syncEvents]
              .flatMap(e => e.name)
              .join(", ");

            const eventDeliveries = wh.eventDeliveries.edges;

            return (
              <Box
                key={wh.id}
                padding={4}
                borderBottomWidth={1}
                borderColor="neutralHighlight"
                borderBottomStyle="solid"
              >
                <Box
                  display={"grid"}
                  __gridTemplateColumns="1fr 1fr"
                  alignItems="center"
                >
                  <Box>
                    <Text marginBottom={2} variant="bodyStrong" as="p">
                      {wh.name}
                    </Text>
                    <Text variant="caption">Event: {events}</Text>
                  </Box>

                  <Box marginLeft="auto">
                    <Text
                      color={
                        wh.isActive
                          ? "textNeutralDefault"
                          : "textNeutralSubdued"
                      }
                    >
                      {wh.isActive ? "Active" : "Disabled"}
                    </Text>
                  </Box>
                </Box>
                {eventDeliveries.length > 0 && (
                  <Box
                    marginLeft={0}
                    marginTop={6}
                    borderLeftStyle={"solid"}
                    borderLeftWidth={1}
                    borderColor="neutralHighlight"
                    paddingLeft={6}
                  >
                    <Text variant="heading" size="small" as="h2">
                      Deliveries
                    </Text>
                    {eventDeliveries.map(ed => {
                      const { createdAt, status } = ed.node;
                      const attempts = ed.node.attempts.edges;

                      return (
                        <Box key={createdAt} marginBottom={6}>
                          <Box
                            paddingTop={4}
                            padding={6}
                            paddingLeft={0}
                            display="grid"
                            __gridTemplateColumns={"1fr 1fr"}
                          >
                            <Text>
                              Event triggered at{" "}
                              <DateTime plain date={createdAt} />
                            </Text>
                          </Box>
                          {attempts.length > 0 && (
                            <Box
                              borderLeftStyle={"solid"}
                              borderLeftWidth={1}
                              borderColor="neutralHighlight"
                              paddingLeft={6}
                            >
                              <Text
                                variant="heading"
                                size="small"
                                marginBottom={4}
                                as="h2"
                              >
                                Attempts
                              </Text>
                              {attempts.map(attempt => {
                                const { createdAt, status } = attempt.node;

                                return (
                                  <Box
                                    key={createdAt}
                                    display="flex"
                                    gap={4}
                                    paddingY={1}
                                  >
                                    <Text>
                                      <DateTime plain date={createdAt} />
                                    </Text>
                                    <StatusChip status={status} />
                                  </Box>
                                );
                              })}
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Wrapper>
    );
  }
};
