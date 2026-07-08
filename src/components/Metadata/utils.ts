import { type MetadataInput } from "@dashboard/graphql";
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

/** Maps metadata form errors to the key field row they apply to. */
export const getMetadataKeyFieldErrors = (
  data: MetadataInput[],
  formError: string | undefined,
): Record<number, string> => {
  if (!formError) {
    return {};
  }

  const errors: Record<number, string> = {};
  const keys = data.map(entry => entry.key);

  if (keys.some(key => key === "")) {
    data.forEach((entry, index) => {
      if (entry.key === "") {
        errors[index] = formError;
      }
    });

    return errors;
  }

  const firstIndexByKey = new Map<string, number>();

  keys.forEach((key, index) => {
    if (key === "") {
      return;
    }

    const firstIndex = firstIndexByKey.get(key);

    if (firstIndex === undefined) {
      firstIndexByKey.set(key, index);

      return;
    }

    errors[index] = formError;

    if (!(firstIndex in errors)) {
      errors[firstIndex] = formError;
    }
  });

  return errors;
};
