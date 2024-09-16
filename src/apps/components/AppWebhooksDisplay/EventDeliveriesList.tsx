import { AppWebhookDeliveriesQuery } from "@dashboard/graphql";
import React from "react";

import { EventDeliveryItem } from "./EventDeliveryItem";

export type EventDelivery =
  AppWebhookDeliveriesQuery["app"]["webhooks"][0]["eventDeliveries"]["edges"][0];

interface EventDeliveriesListProps {
  eventDeliveries: EventDelivery[];
}

export const EventDeliveriesList: React.FC<EventDeliveriesListProps> = ({ eventDeliveries }) => (
  <>
    {eventDeliveries.map((ed, index) => {
      const { createdAt } = ed.node;
      const attempts = ed.node.attempts?.edges?.map(({ node }) => node) ?? [];
      const attemptsCount = attempts.length;
      const lastAttemptDate = attempts[attemptsCount - 1]?.createdAt;
      const hasMore = index < eventDeliveries.length - 1;

      return (
        <EventDeliveryItem
          key={createdAt}
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
