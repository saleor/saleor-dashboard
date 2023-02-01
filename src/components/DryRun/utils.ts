import { AsyncWebhookTypes } from "@dashboard/custom-apps/components/WebhookEvents";
import { InlineFragmentNode, ObjectFieldNode, parse, visit } from "graphql";
import uniq from "lodash/uniq";

import { ExcludedDocumentMap } from "../DryRunItemsList/utils";

const getEventsFromQuery = (query: string) => {
  if (query.length === 0) {
    return [];
  }

  try {
    const ast = parse(query);
    const events: string[] = [];

    visit(ast, {
      SelectionSet(node, _key, parent) {
        if ((parent as ObjectFieldNode).name?.value === "event") {
          const queryEvents = node.selections.map(
            selection =>
              (selection as InlineFragmentNode).typeCondition.name.value,
          );

          queryEvents.map(event => events.push(event));
        }
      },
    });

    return events;
  } catch {
    return [];
  }
};

export const getObjects = (query: string, available = true) => {
  const queryEvents = getEventsFromQuery(query);

  return uniq(
    queryEvents.map(event => {
      const object = event.split(/(?=[A-Z])/).slice(0, -1);
      if (
        Object.keys(AsyncWebhookTypes)
          .filter(object =>
            available
              ? !Object.keys(ExcludedDocumentMap).includes(object.toUpperCase())
              : Object.keys(ExcludedDocumentMap).includes(object.toUpperCase()),
          )
          .includes(object.join("_").toUpperCase())
      ) {
        return object.join(" ");
      }

      return event
        .split(/(?=[A-Z])/)
        .slice(0, -2)
        .join(" ");
    }),
  ).filter(object => object.length > 0);
};
