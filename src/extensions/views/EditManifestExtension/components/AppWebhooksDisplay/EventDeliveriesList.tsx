import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { messages as parentMessages } from "../../messages";
import { EventDeliveryItem } from "./EventDeliveryItem";

type App = NonNullable<AppWebhookDeliveriesQuery["app"]>;
type Webhook = NonNullable<App["webhooks"]>[0];
type WebhookEventDelivery = NonNullable<Webhook["eventDeliveries"]>["edges"][0];

export type EventDelivery = WebhookEventDelivery;

interface EventDeliveriesListProps {
  eventDeliveries: EventDelivery[];
}

export const EventDeliveriesList: React.FC<EventDeliveriesListProps> = ({ eventDeliveries }) => {
  const intl = useIntl();

  // Only keep deliveries with at least one attempt
  const filteredDeliveries = useMemo(
    () => eventDeliveries.filter(ed => (ed.node.attempts?.edges?.length ?? 0) > 0),
    [eventDeliveries],
  );

  if (filteredDeliveries.length === 0) {
    return (
      <Box padding={4} textAlign="center">
        {intl.formatMessage(parentMessages.failedDeliveriesLogsNoLongerAvailable)}
      </Box>
    );
  }

  return (
    <>
      {filteredDeliveries.map((ed, index) => {
        const { createdAt, id } = ed.node;
        const attempts = ed.node.attempts?.edges?.map(({ node }) => node) ?? [];
        const attemptsCount = attempts.length;
        const hasMore = index < filteredDeliveries.length - 1;

        return (
          <EventDeliveryItem
            key={id}
            deliveryId={id}
            createdAt={createdAt}
            status={ed.node.status}
            attemptsCount={attemptsCount}
            attempts={attempts}
            hasMore={hasMore}
          />
        );
      })}
    </>
  );
};
