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
      return "surfaceNeutralHighlight";
    case EventDeliveryStatusEnum.SUCCESS:
      return "surfaceBrandSubdued";
  }
};

const printStatus = (status: EventDeliveryStatusEnum) => {
  switch (status) {
    case EventDeliveryStatusEnum.FAILED:
      return "Failed";
    case EventDeliveryStatusEnum.PENDING:
      return "Pending";
    case EventDeliveryStatusEnum.SUCCESS:
      return "Success";
  }
};

const StatusChip = ({ status }: { status: EventDeliveryStatusEnum }) => {
  return (
    <Chip backgroundColor={mapDeliveryStatusToBackgroundColor(status)}>
      <Text color={mapDeliveryStatusToTextColor(status)}>
        {printStatus(status)}
      </Text>
    </Chip>
  );
};

const DisabledWebhookChip = () => {
  return (
    <Chip backgroundColor="surfaceNeutralHighlight">
      <Text color="textNeutralDefault">Disabled</Text>
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

  if (webhooksData?.app?.webhooks) {
    return (
      <Wrapper {...boxProps}>
        <Accordion>
          {webhooksData.app.webhooks.map(wh => {
            const events = [...wh.asyncEvents, ...wh.syncEvents]
              .flatMap(e => e.name)
              .join(", ");

            const eventDeliveries = wh.eventDeliveries?.edges ?? [];

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
                    <Box
                      display="flex"
                      gap={2}
                      alignItems="center"
                      marginBottom={2}
                    >
                      <Text variant="bodyStrong">{wh.name}</Text>
                      {wh.isActive === false && <DisabledWebhookChip />}
                    </Box>
                    <Text variant="caption">Event: {events}</Text>
                  </Box>
                </Box>
                {eventDeliveries.length > 0 && (
                  <Box marginLeft={0} marginTop={6} paddingLeft={6}>
                    <Text
                      variant="heading"
                      size="small"
                      as="h2"
                      marginBottom={6}
                    >
                      Pending & failed deliveries (last 10)
                    </Text>
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
                            <Text as="p" variant="bodyStrong">
                              <DateTime plain date={createdAt} />
                            </Text>
                            <Box marginLeft="auto">
                              <StatusChip status={ed.node.status} />
                            </Box>
                          </Box>
                          {attempts.length > 0 && (
                            <Box>
                              <Text>
                                Attempts{" "}
                                <Text variant="bodyStrong">
                                  {attemptsCount} / 6
                                </Text>
                              </Text>
                              <Text as="p">
                                Last delivery attempt:{" "}
                                <DateTime plain date={lastAttemptDate} />
                              </Text>
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
        </Accordion>
      </Wrapper>
    );
  }

  return null;
};
