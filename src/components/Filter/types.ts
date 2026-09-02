import { type PermissionEnum } from "@dashboard/graphql";
import { type FetchMoreProps, type KeyValue, type SearchPageProps } from "@dashboard/types";
import { type Option } from "@saleor/macaw-ui-next";

export enum FieldType {
  autocomplete = "autocomplete",
  boolean = "boolean",
  date = "date",
  dateTime = "dateTime",
  number = "number",
  price = "price",
  options = "options",
  text = "text",
  keyValue = "keyValue",
}

interface FilterElementCommonData {
  active: boolean;
  multiple: boolean;
  options?: Option[];
}

interface KeyValueFilterElementData {
  value: KeyValue[];
  type: FieldType.keyValue;
}

interface RegularFilterElementData {
  value: string[];
  type: Omit<FieldType, FieldType.keyValue>;
}

interface UnknownFilterElementData {
  value: Array<string | KeyValue>;
  type: KeyValueFilterElementData["type"] | RegularFilterElementData["type"];
}

type FilterElementCommon<K extends string = string> = {
  autocomplete?: boolean;
  displayValues?: Option[];
  group?: K;
  label: string;
  name: K;
  required?: boolean;
  id?: string;
  dependencies?: string[];
  permissions?: PermissionEnum[];
  multipleFields?: Array<FilterElement<K>>;
} & FilterElementCommonData &
  Partial<FetchMoreProps & SearchPageProps>;

export type FilterElement<K extends string = string> = FilterElementCommon<K> &
  Partial<UnknownFilterElementData>;

export type FilterElementRegular<K extends string = string> = FilterElementCommon<K> &
  RegularFilterElementData;

export type FilterElementKeyValue<K extends string = string> = FilterElementCommon<K> &
  KeyValueFilterElementData;

export type FilterElementGeneric<
  K extends string,
  T extends FieldType,
> = T extends FieldType.keyValue
  ? FilterElementKeyValue<K> & { type: T }
  : FilterElementRegular<K> & { type: T };

export type IFilter<
  K extends string = string,
  T extends FieldType | unknown = unknown,
> = T extends unknown
  ? Array<FilterElement<K>>
  : T extends FieldType.keyValue
    ? Array<FilterElementKeyValue<K>>
    : Array<FilterElementRegular<K>>;
