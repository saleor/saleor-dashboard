import { FetchMoreProps, SearchPageProps } from "@saleor/types";
import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";

export enum FieldType {
  autocomplete,
  boolean,
  date,
  dateTime,
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
  extends IFilterElementMutableData,
    Partial<FetchMoreProps & SearchPageProps> {
  autocomplete?: boolean;
  displayValues?: MultiAutocompleteChoiceType[];
  label: string;
  name: T;
  type: FieldType;
}

export type IFilter<T extends string = string> = Array<IFilterElement<T>>;

export enum FilterType {
  MULTIPLE = "MULTIPLE",
  SINGULAR = "SINGULAR"
}
