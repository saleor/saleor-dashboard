import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";

import { EventDeliveryItem } from "./EventDeliveryItem";

type App = NonNullable<AppWebhookDeliveriesQuery["app"]>;
type Webhook = NonNullable<App["webhooks"]>[0];
type WebhookEventDelivery = NonNullable<Webhook["eventDeliveries"]>["edges"][0];

export type EventDelivery = WebhookEventDelivery;

interface EventDeliveriesListProps {
  eventDeliveries: EventDelivery[];
}

export const EventDeliveriesList = ({ eventDeliveries }: EventDeliveriesListProps) => (
  <>
    {eventDeliveries.map((ed, index) => {
      const { createdAt, id } = ed.node;
      const attempts = ed.node.attempts?.edges?.map(({ node }) => node) ?? [];
      const attemptsCount = attempts.length;
      const lastAttemptDate = attempts[attemptsCount - 1]?.createdAt;
      const hasMore = index < eventDeliveries.length - 1;

      return (
        <EventDeliveryItem
          key={id}
          dataTestId={id}
          createdAt={createdAt}
          status={ed.node.status}
          attemptsCount={attemptsCount}
          attempts={attempts}
          lastAttemptDate={lastAttemptDate}
          hasMore={hasMore}
        />
      );
    })}
  </>
);
