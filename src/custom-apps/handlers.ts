import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { toggle } from "@saleor/utils/lists";

import { filterSelectedAsyncEvents } from "./utils";

export const createSyncEventsSelectHandler = (
  change: (event: ChangeEvent, cb?: () => void) => void,
  syncEvents: WebhookEventTypeSyncEnum[],
) => (event: ChangeEvent) => {
  const events = toggle(event.target.value, syncEvents, (a, b) => a === b);

  change({
    target: {
      name: "syncEvents",
      value: events,
    },
  });
};

export const createAsyncEventsSelectHandler = (
  change: (event: ChangeEvent, cb?: () => void) => void,
  asyncEvents: WebhookEventTypeAsyncEnum[],
) => (event: ChangeEvent) => {
  const events = toggle(event.target.value, asyncEvents, (a, b) => a === b);
  const filteredEvents = filterSelectedAsyncEvents(events);

  change({
    target: {
      name: "asyncEvents",
      value: filteredEvents,
    },
  });
};
