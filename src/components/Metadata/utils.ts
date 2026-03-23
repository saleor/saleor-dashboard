import { type ChangeEvent } from "@dashboard/hooks/useForm";

import { type EventData, EventDataAction, EventDataField } from "./types";

export const nameSeparator = ":";
export const nameInputPrefix = EventDataField.name;
export const valueInputPrefix = EventDataField.value;

export function parseEventData(event: ChangeEvent<string>): EventData {
  if (event.target.name.includes(EventDataField.name)) {
    return {
      action: EventDataAction.update,
      field: EventDataField.name,
      fieldIndex: parseInt(event.target.name.split(nameSeparator)[1], 10),
      value: event.target.value,
    };
  }

  if (event.target.name.includes(EventDataField.value)) {
    return {
      action: EventDataAction.update,
      field: EventDataField.value,
      fieldIndex: parseInt(event.target.name.split(nameSeparator)[1], 10),
      value: event.target.value,
    };
  }

  if (event.target.name === EventDataAction.add) {
    return {
      action: EventDataAction.add,
      field: null,
      fieldIndex: null,
      value: "",
    };
  }

  if (event.target.name === EventDataAction.delete) {
    return {
      action: EventDataAction.delete,
      field: null,
      fieldIndex: parseInt(event.target.value, 10),
      value: "",
    };
  }

  throw new Error(`Invalid metadata event action: "${event.target.name}"`);
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
