import { FetchMoreProps, SearchPageProps } from "@saleor/types";
import { MessageDescriptor } from "react-intl";

import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import { FilterReducerAction } from "./reducer";

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
  group?: T;
  label: string;
  name: T;
  type?: FieldType;
  required?: boolean;
  multipleFields?: IFilterElement[];
  id?: string;
  dependencies?: string[];
}

export interface FilterBaseFieldProps<T extends string = string> {
  filterField: IFilterElement<T>;
  onFilterPropertyChange: React.Dispatch<FilterReducerAction<T>>;
}

export type FilterErrors = string[];

export type FilterErrorMessages<T extends string> = Record<
  T,
  MessageDescriptor
>;

export type IFilter<T extends string = string> = Array<IFilterElement<T>>;

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
