import { MetadataInput } from "@saleor/graphql";

export enum EventDataAction {
  add = "add",
  delete = "delete",
  update = "update",
}
export enum EventDataField {
  name = "name",
  value = "value",
}
export interface EventData {
  action: EventDataAction;
  field: EventDataField | null;
  fieldIndex: number | null;
  value: string;
}
export interface MetadataFormData {
  metadata: MetadataInput[];
  privateMetadata: MetadataInput[];
}
