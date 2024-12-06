import { useAppWebhookDeliveriesQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { Accordion, Box, BoxProps, Chip, Skeleton, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { EventDeliveriesList } from "./EventDeliveriesList";

interface AppWebhooksDisplayProps extends BoxProps {
  appId: string;
}

const Wrapper = (boxProps: BoxProps) => {
  const intl = useIntl();

  return (
    <Box {...boxProps}>
      <Text size={5} fontWeight="bold" marginBottom={4} as={"h2"}>
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

export const AppWebhooksDisplay = ({ appId, ...boxProps }: AppWebhooksDisplayProps) => {
  const { formatMessage } = useIntl();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { data: webhooksData, loading } = useAppWebhookDeliveriesQuery({
    variables: { appId },
    skip: !hasManagedAppsPermission,
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
        <Accordion __marginLeft="-24px" __width="calc(100% + 48px)">
          {webhooksData.app.webhooks.map((wh, index) => {
            const isLastWebhook = index === (webhooksData?.app?.webhooks ?? []).length - 1;
            const events = [...wh.asyncEvents, ...wh.syncEvents].flatMap(e => e.name).join(", ");
            const eventDeliveries = wh.eventDeliveries?.edges ?? [];

            return (
              <Box
                key={wh.id}
                padding={4}
                paddingLeft={6}
                borderBottomWidth={isLastWebhook ? 0 : 1}
                borderColor="default1"
                borderBottomStyle="solid"
              >
                <Box>
                  <Box display="flex" gap={2} alignItems="center" marginBottom={2}>
                    <Text>{wh.name}</Text>
                    {!wh.isActive && <DisabledWebhookChip />}
                  </Box>
                  <Text size={1}>{events}</Text>
                </Box>
                {eventDeliveries.length > 0 && (
                  <Accordion.Item
                    value={wh.id}
                    marginTop={6}
                    borderColor="default1"
                    borderWidth={1}
                    borderStyle="solid"
                    paddingY={2}
                    borderRadius={4}
                  >
                    <Accordion.Trigger alignItems="center" paddingX={4}>
                      <Text size={4} fontWeight="bold" as="h2">
                        {formatMessage({
                          defaultMessage: "Pending & failed deliveries (last 10)",
                          id: "SRMNCS",
                        })}
                      </Text>
                      <Accordion.TriggerButton />
                    </Accordion.Trigger>
                    <Accordion.Content marginTop={6}>
                      <EventDeliveriesList eventDeliveries={eventDeliveries} />
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
