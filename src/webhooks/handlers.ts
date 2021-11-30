import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ChangeEvent } from "@saleor/hooks/useForm";
import {
  WebhookEventTypeAsync,
  WebhookEventTypeSync
} from "@saleor/types/globalTypes";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";

import { mapAsyncEventsToChoices, mapSyncEventsToChoices } from "./utils";

export const createSyncEventsSelectHandler = (
  change: (event: ChangeEvent, cb?: () => void) => void,
  syncEvents: WebhookEventTypeSync[],
  syncEventsChoices: MultiAutocompleteChoiceType[]
) =>
  createMultiAutocompleteSelectHandler(
    event => change(event),
    syncEvents =>
      change({
        target: {
          name: "syncEvents",
          value: syncEvents.map(event => event.value)
        }
      }),
    mapSyncEventsToChoices(syncEvents),
    syncEventsChoices
  );

export const createAsyncEventsSelectHandler = (
  change: (event: ChangeEvent, cb?: () => void) => void,
  asyncEvents: WebhookEventTypeAsync[],
  asyncEventsChoices: MultiAutocompleteChoiceType[]
) =>
  createMultiAutocompleteSelectHandler(
    event => change(event),
    asyncEvents =>
      change({
        target: {
          name: "asyncEvents",
          value: asyncEvents.map(event => event.value)
        }
      }),
    mapAsyncEventsToChoices(asyncEvents, asyncEvents),
    asyncEventsChoices
  );
