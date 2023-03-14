import {
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { capitalize } from "@dashboard/misc";
import { toggle } from "@dashboard/utils/lists";
import {
  DocumentNode,
  FieldNode,
  InlineFragmentNode,
  ObjectFieldNode,
  OperationDefinitionNode,
  parse,
  print,
  SelectionNode,
  visit,
} from "graphql";
import isEmpty from "lodash/isEmpty";
import React, { Dispatch, SetStateAction } from "react";

import { WebhookFormData } from "./components/WebhookDetailsPage";
import { IntrospectionNode } from "./components/WebhookDetailsPage/utils";
import { filterSelectedAsyncEvents } from "./utils";

interface CreateSyncEventsSelectHandler {
  change: (event: ChangeEvent, cb?: () => void) => void;
  data: WebhookFormData;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  availableEvents: IntrospectionNode[];
}

export const createSyncEventsSelectHandler =
  ({
    change,
    data,
    query,
    setQuery,
    availableEvents,
  }: CreateSyncEventsSelectHandler) =>
  (event: ChangeEvent) => {
    const { syncEvents, asyncEvents } = data;
    const events = toggle(event.target.value, syncEvents, (a, b) => a === b);

    // Clear asyncEvents
    if (!isEmpty(asyncEvents)) {
      setQuery("");

      change({
        target: {
          name: "asyncEvents",
          value: [],
        },
      });
    }

    change({
      target: {
        name: "syncEvents",
        value: events,
      },
    });

    handleQuery({ events, query, setQuery, availableEvents });
  };

interface CreateAsyncEventsSelectHandler {
  change: (event: ChangeEvent, cb?: () => void) => void;
  data: WebhookFormData;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  availableEvents: IntrospectionNode[];
}

export const createAsyncEventsSelectHandler =
  ({
    change,
    data,
    query,
    setQuery,
    availableEvents,
  }: CreateAsyncEventsSelectHandler) =>
  (event: ChangeEvent) => {
    const { syncEvents, asyncEvents } = data;
    const events = toggle(event.target.value, asyncEvents, (a, b) => a === b);
    const filteredEvents = filterSelectedAsyncEvents(events);

    // Clear syncEvents
    if (!isEmpty(syncEvents)) {
      setQuery("");

      change({
        target: {
          name: "syncEvents",
          value: [],
        },
      });
    }

    change({
      target: {
        name: "asyncEvents",
        value: filteredEvents,
      },
    });

    handleQuery({ events: filteredEvents, query, setQuery, availableEvents });
  };

const enumToEventName = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map(chunk => capitalize(chunk))
    .join("");

interface HandleQuery {
  events: WebhookEventTypeAsyncEnum[] | WebhookEventTypeSyncEnum[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  availableEvents: IntrospectionNode[];
}

const handleQuery = ({
  events,
  query,
  setQuery,
  availableEvents,
}: HandleQuery) => {
  const availableEventNames = availableEvents.map(({ name }) => name);
  const eventsNames: string[] = events
    .map(event => enumToEventName(event))
    .filter(eventName => availableEventNames.includes(eventName));

  if (eventsNames.length > 0 && query.length === 0) {
    setQuery(
      print(
        parse(
          `subscription { event { ... on ${eventsNames[0]} { __typename } } }`,
        ),
      ),
    );
  }

  if (query.length > 0) {
    try {
      const ast = parse(query);

      const editedAst: DocumentNode = visit(ast, {
        SelectionSet(node, _key, parent) {
          if ((parent as ObjectFieldNode).name?.value === "event") {
            const queryEvents = node.selections.map(
              selection =>
                (selection as InlineFragmentNode).typeCondition.name.value,
            );

            const eventsToRemove = queryEvents.filter(
              event => !eventsNames.includes(event),
            );

            const selections = [...node.selections].filter(
              selection =>
                !eventsToRemove.includes(
                  (selection as InlineFragmentNode).typeCondition.name.value,
                ),
            );

            eventsNames.forEach(event => {
              if (!queryEvents.includes(event)) {
                const eventFragment = createEventInlineFragment(event);
                selections.push(eventFragment);
              }
            });

            if (!selections.length) {
              return null;
            }

            return {
              ...node,
              selections,
            };
          }
        },
      });

      setQuery(isEmptyQuery(editedAst) ? "" : print(editedAst));
    } catch (e) {
      console.error(e);
    }
  }
};

const createEventInlineFragment = (event: string): SelectionNode => ({
  kind: "InlineFragment",
  typeCondition: {
    kind: "NamedType",
    name: {
      kind: "Name",
      value: event,
    },
  },
  selectionSet: {
    kind: "SelectionSet",
    selections: [
      { kind: "Field", name: { kind: "Name", value: "__typename" } },
    ],
  },
});

const isEmptyQuery = (ast: DocumentNode): boolean => {
  let empty = false;

  visit(ast, {
    SelectionSet(node, _key, parent) {
      if ((parent as OperationDefinitionNode).operation === "subscription") {
        const event = node.selections.filter(
          selection => (selection as FieldNode).name?.value === "event",
        )[0] as FieldNode;
        if (!event.selectionSet) {
          empty = true;
        }
      }
    },
  });

  return empty;
};
