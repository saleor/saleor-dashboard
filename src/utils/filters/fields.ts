import { FieldType, FilterElementGeneric } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import {
  FetchMoreProps,
  KeyValue,
  MinMax,
  SearchPageProps,
} from "@saleor/types";

export function createPriceField<K extends string = string>(
  name: K,
  label: string,
  defaultValue: MinMax,
): FilterElementGeneric<K, FieldType.price> {
  return {
    active: false,
    label,
    multiple: defaultValue.min !== defaultValue.max,
    name,
    type: FieldType.price,
    value: [defaultValue.min, defaultValue.max],
  };
}

export function createKeyValueField<K extends string = string>(
  name: K,
  label: string,
  defaultValue: KeyValue[],
): FilterElementGeneric<K, FieldType.keyValue> {
  return {
    active: false,
    label,
    multiple: false,
    name,
    type: FieldType.keyValue,
    value: defaultValue,
  };
}

export function createDateField<K extends string>(
  name: K,
  label: string,
  defaultValue: MinMax,
): FilterElementGeneric<K, FieldType.date> {
  return {
    active: false,
    label,
    multiple: defaultValue.min !== defaultValue.max,
    name,
    type: FieldType.date,
    value: [defaultValue.min, defaultValue.max],
  };
}

export function createDateTimeField<K extends string>(
  name: K,
  label: string,
  defaultValue: MinMax,
): FilterElementGeneric<K, FieldType.dateTime> {
  return {
    active: false,
    label,
    multiple: defaultValue.min !== defaultValue.max,
    name,
    type: FieldType.dateTime,
    value: [defaultValue.min, defaultValue.max],
  };
}

export function createNumberField<K extends string>(
  name: K,
  label: string,
  value: MinMax,
): FilterElementGeneric<K, FieldType.number> {
  return {
    active: false,
    label,
    multiple: value.min !== value.max,
    name,
    type: FieldType.number,
    value: [value.min, value.max],
  };
}

export function createOptionsField<K extends string>(
  name: K,
  label: string,
  defaultValue: string[],
  multiple: boolean,
  options: MultiAutocompleteChoiceType[],
): FilterElementGeneric<K, FieldType.options> {
  return {
    active: false,
    label,
    multiple,
    name,
    options,
    type: FieldType.options,
    value: defaultValue,
  };
}

export function createAutocompleteField<K extends string>(
  name: K,
  label: string,
  defaultValue: string[] = [],
  displayValues: MultiAutocompleteChoiceType[],
  multiple: boolean,
  options: MultiAutocompleteChoiceType[],
  opts: FetchMoreProps & SearchPageProps,
  id?: string,
): FilterElementGeneric<K, FieldType.autocomplete> {
  return {
    ...opts,
    active: false,
    displayValues,
    label,
    multiple,
    name,
    options,
    type: FieldType.autocomplete,
    value: defaultValue,
    id,
  };
}

export function createTextField<K extends string>(
  name: K,
  label: string,
  defaultValue: string,
): FilterElementGeneric<K, FieldType.text> {
  return {
    active: false,
    label,
    multiple: false,
    name,
    type: FieldType.text,
    value: [defaultValue],
  };
}

export function createBooleanField<K extends string>(
  name: K,
  label: string,
  defaultValue: boolean | undefined,
  labels: Record<"positive" | "negative", string>,
): FilterElementGeneric<K, FieldType.boolean> {
  return {
    active: false,
    label,
    multiple: false,
    name,
    options: [
      {
        label: labels.positive,
        value: true.toString(),
      },
      {
        label: labels.negative,
        value: false.toString(),
      },
    ],
    type: FieldType.boolean,
    value: [defaultValue?.toString()],
  };
}
