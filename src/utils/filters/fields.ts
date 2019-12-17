import { IFilterElement, FieldType } from "@saleor/components/Filter";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";

type MinMax = Record<"min" | "max", string>;

export function createPriceField<T extends string>(
  name: T,
  label: string,
  currencySymbol: string,
  defaultValue: MinMax
): IFilterElement<T> {
  return {
    active: false,
    currencySymbol,
    label,
    multiple: true,
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
    multiple: true,
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
