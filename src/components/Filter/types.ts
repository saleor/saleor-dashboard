import { FetchMoreProps } from "@saleor/types";
import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";

export enum FieldType {
  date,
  number,
  price,
  options,
  text
}

export interface IFilterElementMutableData<T extends string = string> {
  active: boolean;
  multiple: boolean;
  options?: MultiAutocompleteChoiceType[];
  value: T[];
}
export interface IFilterElement<T extends string = string>
  extends Partial<FetchMoreProps>,
    IFilterElementMutableData {
  autocomplete?: boolean;
  label: string;
  name: T;
  type: FieldType;
}

export type IFilter<T extends string = string> = Array<IFilterElement<T>>;

export enum FilterType {
  MULTIPLE = "MULTIPLE",
  SINGULAR = "SINGULAR"
}
