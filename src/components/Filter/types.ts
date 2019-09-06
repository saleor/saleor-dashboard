import { IMenu, IMenuItem } from "../../utils/menu";

export enum FieldType {
  date,
  hidden,
  number,
  price,
  range,
  rangeDate,
  rangePrice,
  select,
  text
}

export interface FilterChoice {
  label: string;
  value: string | boolean;
}

export interface FilterData {
  additionalText?: string;
  fieldLabel: string;
  options?: FilterChoice[];
  type: FieldType;
  value?: string;
}

export type IFilterItem<TKeys> = IMenuItem<FilterData, TKeys>;

export type IFilter<TKeys> = IMenu<FilterData, TKeys>;
