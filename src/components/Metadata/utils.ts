import { type ChangeEvent } from "@dashboard/hooks/useForm";

import { type EventData, EventDataAction, EventDataField } from "./types";

export const nameSeparator = ":";
export const nameInputPrefix = EventDataField.name;
export const valueInputPrefix = EventDataField.value;

export function parseEventData(event: ChangeEvent<string>): EventData {
  let action: EventDataAction = EventDataAction.update;
  let field: EventDataField | null = null;
  let fieldIndex: number | null = null;
  let value: string = "";

  if (event.target.name.includes(EventDataField.name)) {
    action = EventDataAction.update;
    field = EventDataField.name;
    fieldIndex = parseInt(event.target.name.split(nameSeparator)[1], 10);
    value = event.target.value;
  }

  if (event.target.name.includes(EventDataField.value)) {
    action = EventDataAction.update;
    field = EventDataField.value;
    fieldIndex = parseInt(event.target.name.split(nameSeparator)[1], 10);
    value = event.target.value;
  }

  if (event.target.name === EventDataAction.add) {
    action = EventDataAction.add;
  }

  if (event.target.name === EventDataAction.delete) {
    action = EventDataAction.delete;
    fieldIndex = parseInt(event.target.value, 10);
  }

  return {
    action,
    field,
    fieldIndex,
    value,
  };
}

export function getDataKey(isPrivate: boolean) {
  return isPrivate ? "privateMetadata" : "metadata";
}

export const getMetadataTitle = (isPrivate: boolean) =>
  isPrivate
    ? {
        id: "ETHnjq",
        defaultMessage: "Private Metadata",
        description: "header",
      }
    : {
        id: "VcI+Zh",
        defaultMessage: "Metadata",
        description: "header",
      };
