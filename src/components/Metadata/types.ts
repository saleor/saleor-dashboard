export type MetadataItem = Record<"key" | "value", string>;

export enum EventDataAction {
  add = "add",
  delete = "delete",
  update = "update"
}
export enum EventDataField {
  name = "name",
  value = "value"
}
export interface EventData {
  action: EventDataAction;
  field: EventDataField | null;
  fieldIndex: number | null;
  value: string;
}
