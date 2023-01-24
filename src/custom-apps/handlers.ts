import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { capitalize } from "@dashboard/misc";
import { toggle } from "@dashboard/utils/lists";
import {
  InlineFragmentNode,
  ObjectFieldNode,
  parse,
  print,
  visit,
} from "graphql";

import { filterSelectedAsyncEvents } from "./utils";

export const createSyncEventsSelectHandler =
  (
    change: (event: ChangeEvent, cb?: () => void) => void,
    syncEvents: WebhookEventTypeSyncEnum[],
    setQuery: React.Dispatch<React.SetStateAction<string>>,
  ) =>
  (event: ChangeEvent) => {
    const events = toggle(event.target.value, syncEvents, (a, b) => a === b);

    // Clear query
    setQuery("");

    // Clear asyncEvents
    change({
      target: {
        name: "asyncEvents",
        value: [],
      },
    });

    change({
      target: {
        name: "syncEvents",
        value: events,
      },
    });
  };

export const createAsyncEventsSelectHandler =
  (
    change: (event: ChangeEvent, cb?: () => void) => void,
    asyncEvents: WebhookEventTypeAsyncEnum[],
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
  ) =>
  (event: ChangeEvent) => {
    const events = toggle(event.target.value, asyncEvents, (a, b) => a === b);
    const filteredEvents = filterSelectedAsyncEvents(events);

    // Clear syncEvents
    change({
      target: {
        name: "syncEvents",
        value: [],
      },
    });

    change({
      target: {
        name: "asyncEvents",
        value: filteredEvents,
      },
    });

    handleQuery(filteredEvents, query, setQuery);
  };

const handleQuery = (
  events: WebhookEventTypeAsyncEnum[],
  query: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (events.length > 0 && query.length === 0) {
    const event = events[0]
      .toLowerCase()
      .split("_")
      .map(chunk => capitalize(chunk))
      .join("");
    setQuery(
      print(parse(`subscription { event { ... on ${event} { __typename } } }`)),
    );
  }

  if (query.length > 0) {
    const ast = parse(query);

    visit(ast, {
      SelectionSet(node, _key, parent) {
        if ((parent as ObjectFieldNode).name?.value === "event") {
          const queryEvents = node.selections.map(
            selection =>
              (selection as InlineFragmentNode).typeCondition.name.value,
          );
          const newEvents = events
            .map(event =>
              event
                .toLowerCase()
                .split("_")
                .map(chunk => capitalize(chunk))
                .join(""),
            )
            .filter(event => !queryEvents.includes(event));

          if (newEvents.length > 0) {
            // TODO modify AST

            const inserted = query.replace(/\n/g, " ").replace(
              "   } } ",
              newEvents
                .map(event => ` ... on ${event} { __typename }`)
                .join("")
                .concat("   } } "),
            );
            setQuery(print(parse(inserted)));
          }
        }

        return undefined;
      },
    });
  }
};
