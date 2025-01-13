import {
  BulkselectOperator,
  ComboboxOperator,
  DateOperator,
  DateTimeOperator,
  DoubleTextOperator,
  InputOperator,
  MultiselectOperator,
  NumberRangeOperator,
  SelectedOperator,
  SelectOperator,
} from "./types";

export const isTextInput = (value: SelectedOperator): value is InputOperator =>
  value.conditionValue?.type === "text";

export const isNumberInput = (value: SelectedOperator): value is InputOperator =>
  value.conditionValue?.type === "number";

export const isMultiselect = (value: SelectedOperator): value is MultiselectOperator =>
  value.conditionValue?.type === "multiselect";

export const isBulkSelect = (value: SelectedOperator): value is BulkselectOperator =>
  value.conditionValue?.type === "bulkselect";

export const isCombobox = (value: SelectedOperator): value is ComboboxOperator =>
  value.conditionValue?.type === "combobox";

export const isSelect = (value: SelectedOperator): value is SelectOperator =>
  value.conditionValue?.type === "select";

export const isNumberRange = (value: SelectedOperator): value is NumberRangeOperator =>
  value.conditionValue?.type === "number.range";

export const isDate = (value: SelectedOperator): value is DateOperator =>
  value.conditionValue?.type === "date";

export const isDateTime = (value: SelectedOperator): value is DateTimeOperator =>
  value.conditionValue?.type === "datetime";

export const isDateRange = (value: SelectedOperator): value is DateOperator =>
  value.conditionValue?.type === "date.range";

export const isDateTimeRange = (value: SelectedOperator): value is DateTimeOperator =>
  value.conditionValue?.type === "datetime.range";

export const isDoubleText = (value: SelectedOperator): value is DoubleTextOperator =>
  value.conditionValue?.type === "text.double";
