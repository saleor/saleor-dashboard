import { PermissionEnum } from "@saleor/graphql";
import { FetchMoreProps, KeyValue, SearchPageProps } from "@saleor/types";
import { MessageDescriptor } from "react-intl";

import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import { FilterReducerAction } from "./reducer";

export enum FieldType {
  autocomplete = "autocomplete",
  boolean = "boolean",
  date = "date",
  dateTime = "dateTime",
  number = "number",
  price = "price",
  options = "options",
  text = "text",
  keyValue = "keyValue"
}

interface FilterElementCommonMutableData {
  active: boolean;
  multiple: boolean;
  options?: MultiAutocompleteChoiceType[];
}

export interface KeyValueFilterElementData {
  value: KeyValue[];
  type: FieldType.keyValue;
}

export interface RegularFilterElementData {
  value: string[];
  type: Omit<FieldType, FieldType.keyValue>;
}

export interface UnknownFilterElementData {
  value: Array<string | KeyValue>;
  type: KeyValueFilterElementData["type"] | RegularFilterElementData["type"];
}

export type FilterElementValueData =
  | RegularFilterElementData
  | KeyValueFilterElementData;

export type IFilterElementMutableData = FilterElementCommonMutableData &
  FilterElementValueData;

export type IFilterElementMutableDataGeneric<
  T extends FieldType
> = T extends FieldType.keyValue
  ? KeyValueFilterElementData & FilterElementCommonMutableData
  : RegularFilterElementData & FilterElementCommonMutableData;

export type IFilterElement<K extends string = string> = Partial<
  UnknownFilterElementData
> &
  FilterElementCommonMutableData &
  Partial<FetchMoreProps & SearchPageProps> & {
    autocomplete?: boolean;
    displayValues?: MultiAutocompleteChoiceType[];
    group?: K;
    label: string;
    name: K;
    required?: boolean;
    multipleFields?: IFilterElement[];
    id?: string;
    dependencies?: string[];
    permissions?: PermissionEnum[];
  };

export type FilterElementRegular<
  K extends string = string
> = RegularFilterElementData &
  FilterElementCommonMutableData &
  Partial<FetchMoreProps & SearchPageProps> & {
    autocomplete?: boolean;
    displayValues?: MultiAutocompleteChoiceType[];
    group?: K;
    label: string;
    name: K;
    required?: boolean;
    multipleFields?: IFilterElement[];
    id?: string;
    dependencies?: string[];
    permissions?: PermissionEnum[];
  };

export type FilterElementKeyValue<
  K extends string = string
> = KeyValueFilterElementData &
  FilterElementCommonMutableData &
  Partial<FetchMoreProps & SearchPageProps> & {
    group?: K;
    label: string;
    name: K;
    required?: boolean;
    multipleFields?: IFilterElement[];
    id?: string;
    dependencies?: string[];
    permissions?: PermissionEnum[];
  };

export type FilterElementGeneric<
  K extends string,
  T extends FieldType
> = T extends FieldType.keyValue
  ? FilterElementKeyValue<K> & { type: T }
  : FilterElementRegular<K> & { type: T };

export const isFilterDateType = <K extends string = string>(
  filter: IFilterElement<K>
): filter is FilterElementGeneric<K, FieldType.date | FieldType.dateTime> =>
  filter.type === FieldType.date || filter.type === FieldType.dateTime;

export const isFilterNumericType = <K extends string = string>(
  filter: IFilterElement<K>
): filter is FilterElementGeneric<K, FieldType.number | FieldType.price> =>
  filter.type === FieldType.number || filter.type === FieldType.price;

export const isFilterType = <T extends FieldType, K extends string = string>(
  filter: IFilterElement<K>,
  type: T
): filter is FilterElementGeneric<K, T> => filter.type === type;

export interface FilterBaseFieldProps<K extends string = string> {
  filterField: IFilterElement<K>;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<K, FieldType>>;
}

export type FilterErrors = string[];

export type FilterErrorMessages<T extends string> = Record<
  T,
  MessageDescriptor
>;

export type IFilter<
  K extends string = string,
  T extends FieldType | unknown = unknown
> = T extends unknown
  ? Array<IFilterElement<K>>
  : T extends FieldType.keyValue
  ? Array<FilterElementKeyValue<K>>
  : Array<FilterElementRegular<K>>;

export enum FilterType {
  MULTIPLE = "MULTIPLE",
  SINGULAR = "SINGULAR"
}

export enum ValidationErrorCode {
  VALUE_REQUIRED = "VALUE_REQUIRED",
  DEPENDENCIES_MISSING = "DEPENDENCIES_MISSING",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export type InvalidFilters<T extends string> = Record<T, string[]>;
