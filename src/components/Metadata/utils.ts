import { ChangeEvent } from "@saleor/hooks/useForm";

import { nameSeparator } from "./MetadataCard";
import { EventData, EventDataAction, EventDataField } from "./types";

export function parseEventData(event: ChangeEvent): EventData {
  let action: EventDataAction;
  let field: EventDataField = null;
  let fieldIndex: number = null;
  let value: string = null;

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
    fieldIndex = event.target.value;
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
