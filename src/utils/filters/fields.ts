import { IFilterElement, FieldType } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { MinMax, FetchMoreProps, SearchPageProps } from "@saleor/types";

export function createPriceField<T extends string>(
  name: T,
  label: string,
  defaultValue: MinMax
): IFilterElement<T> {
  return {
    active: false,
    label,
    multiple: defaultValue.min !== defaultValue.max,
    name,
    type: FieldType.price,
    value: [defaultValue.min, defaultValue.max]
  };
}

export function createDateField<T extends string>(
  name: T,
  label: string,
  defaultValue: MinMax
): IFilterElement<T> {
  return {
    active: false,
    label,
    multiple: defaultValue.min !== defaultValue.max,
    name,
    type: FieldType.date,
    value: [defaultValue.min, defaultValue.max]
  };
}

export function createNumberField<T extends string>(
  name: T,
  label: string,
  defaultValue: MinMax
): IFilterElement<T> {
  return {
    active: false,
    label,
    multiple: true,
    name,
    type: FieldType.number,
    value: [defaultValue.min, defaultValue.max]
  };
}

export function createOptionsField<T extends string>(
  name: T,
  label: string,
  defaultValue: string[],
  multiple: boolean,
  options: MultiAutocompleteChoiceType[]
): IFilterElement<T> {
  return {
    active: false,
    label,
    multiple,
    name,
    options,
    type: FieldType.options,
    value: defaultValue
  };
}

export function createAutocompleteField<T extends string>(
  name: T,
  label: string,
  defaultValue: string[],
  displayValues: MultiAutocompleteChoiceType[],
  multiple: boolean,
  options: MultiAutocompleteChoiceType[],
  opts: FetchMoreProps & SearchPageProps
): IFilterElement<T> {
  return {
    ...opts,
    active: false,
    displayValues,
    label,
    multiple,
    name,
    options,
    type: FieldType.autocomplete,
    value: defaultValue
  };
}

export function createTextField<T extends string>(
  name: T,
  label: string,
  defaultValue: string
): IFilterElement<T> {
  return {
    active: false,
    label,
    multiple: false,
    name,
    type: FieldType.text,
    value: [defaultValue]
  };
}

export function createBooleanField<T extends string>(
  name: T,
  label: string,
  defaultValue: boolean,
  labels: Record<"positive" | "negative", string>
): IFilterElement<T> {
  return {
    active: false,
    label,
    multiple: false,
    name,
    options: [
      {
        label: labels.positive,
        value: true.toString()
      },
      {
        label: labels.negative,
        value: false.toString()
      }
    ],
    type: FieldType.boolean,
    value: [defaultValue.toString()]
  };
}
