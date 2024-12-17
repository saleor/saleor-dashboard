// @ts-strict-ignore
import { getWebhookTypes } from "@dashboard/custom-apps/components/WebhookEvents/utils";
import { WebhookEventTypeAsyncEnum } from "@dashboard/graphql";
import { InlineFragmentNode, ObjectFieldNode, parse, visit } from "graphql";

import { DocumentMap, ExcludedDocumentKeys } from "../DryRunItemsList/utils";

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
            selection => (selection as InlineFragmentNode).typeCondition.name.value,
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

export const getUnavailableObjects = (query: string) => {
  const queryEvents = getEventsFromQuery(query);

  return queryEvents.reduce((acc, event) => {
    const formattedEvent = event
      .split(/(?=[A-Z])/)
      .join("_")
      .toUpperCase();

    if (checkEventPresence(formattedEvent)) {
      acc.push(event);
    }

    return acc;
  }, []);
};

const checkEventPresence = (event: string) => {
  const webhookTypes = getWebhookTypes(Object.keys(WebhookEventTypeAsyncEnum));
  const availableObjects = Object.keys(DocumentMap);
  const excludedObjects = Object.keys(webhookTypes).filter(
    object => !availableObjects.includes(object),
  );

  ExcludedDocumentKeys.forEach(
    object => !excludedObjects.includes(object) && excludedObjects.push(object),
  );

  return excludedObjects.some(object => event.startsWith(object));
};
