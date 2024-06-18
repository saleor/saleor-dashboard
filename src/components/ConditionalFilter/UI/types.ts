import { Option, RangeValue } from "@saleor/macaw-ui-next";

export type DisabledScope = "left" | "right" | "condition";

export type RightOperatorOption = Option & {
  slug: string;
};

export type LeftOperatorOption = Option & {
  type: string;
};

export type ConditionOption<T extends string> = Option & {
  type: T;
};

export interface Error {
  row: number;
  leftText?: string;
  conditionText?: string;
  rightText?: string;
}

type ConditionOptionTypes = ConditionOption<
  | "text"
  | "number"
  | "multiselect"
  | "bulkselect"
  | "combobox"
  | "select"
  | "number.range"
  | "date"
  | "datetime"
  | "date.range"
  | "datetime.range"
>;

export interface Row {
  value: { label: string; value: string; type: string } | null;
  loading?: boolean;
  constraint?: {
    dependsOn: string[];
    disabled?: DisabledScope[];
    removable?: boolean;
  };
  condition: {
    loading?: boolean;
    options: ConditionOptionTypes[];
    selected: SelectedOperator;
  };
}

export type SelectedOperator =
  | InputOperator
  | MultiselectOperator
  | BulkselectOperator
  | ComboboxOperator
  | SelectOperator
  | NumberRangeOperator
  | DateOperator
  | DateTimeOperator
  | DateRangeOperator
  | DateTimeRangeOperator;

export interface InputOperator {
  value: string | RightOperatorOption;
  conditionValue: ConditionOption<"text" | "number"> | null;
}

export interface MultiselectOperator {
  value: RightOperatorOption[];
  conditionValue: ConditionOption<"multiselect"> | null;
  options: RightOperatorOption[];
  loading?: boolean;
}

export interface BulkselectOperator {
  value: RightOperatorOption[];
  conditionValue: ConditionOption<"bulkselect"> | null;
  options: RightOperatorOption[];
  loading?: boolean;
}

export interface ComboboxOperator {
  value: RightOperatorOption;
  conditionValue: ConditionOption<"combobox"> | null;
  options: RightOperatorOption[];
  loading?: boolean;
}

export interface SelectOperator {
  value: RightOperatorOption;
  conditionValue: ConditionOption<"select"> | null;
  options: RightOperatorOption[];
}

export interface NumberRangeOperator {
  value: RangeValue;
  conditionValue: ConditionOption<"number.range"> | null;
}

export interface DateOperator {
  value: string;
  conditionValue: ConditionOption<"date"> | null;
}

export interface DateTimeOperator {
  value: string;
  conditionValue: ConditionOption<"datetime"> | null;
}

export interface DateRangeOperator {
  value: RangeValue;
  conditionValue: ConditionOption<"date.range"> | null;
}

export interface DateTimeRangeOperator {
  value: RangeValue;
  conditionValue: ConditionOption<"datetime.range"> | null;
}

export interface FilterEvent extends Event {
  detail?:
    | RowAddData
    | RowRemoveData
    | LeftOperatorChangeData
    | LeftOperatorFocusData
    | LeftOperatorBlurData
    | LeftOperatorInputValueChangeData
    | ConditionChangeData
    | ConditionFocusData
    | ConditionBlurData
    | RightOperatorChangeData
    | RightOperatorFocusData
    | RightOperatorBlurData
    | RightOperatorInputValueChangeData;
}

export interface RowAddData {
  type: "row.add";
  rowType: string;
}

export interface RowRemoveData {
  type: "row.remove";
  path: `${number}`;
  index: number;
}

export interface LeftOperatorChangeData {
  type: "leftOperator.onChange";
  path: `${number}`;
  index: number;
  value: LeftOperatorOption;
  rowType: string;
}

export interface LeftOperatorFocusData {
  type: "leftOperator.onFocus";
  path: `${number}`;
  index: number;
}

export interface LeftOperatorBlurData {
  type: "leftOperator.onBlur";
  path: `${number}`;
  index: number;
}

export interface LeftOperatorInputValueChangeData {
  type: "leftOperator.onInputValueChange";
  path: `${number}`;
  index: number;
  value: string;
}

export interface ConditionChangeData {
  type: "condition.onChange";
  path: `${number}.condition.selected`;
  index: number;
  value: ConditionOptionTypes;
}

export interface ConditionFocusData {
  type: "condition.onFocus";
  path: `${number}.condition.selected`;
  index: number;
}

export interface ConditionBlurData {
  type: "condition.onBlur";
  path: `${number}.condition.selected`;
  index: number;
}

export interface RightOperatorChangeData {
  type: "rightOperator.onChange";
  path: `${number}.condition.selected.value`;
  index: number;
  value: string | RightOperatorOption[] | RightOperatorOption | RangeValue;
}

export interface RightOperatorFocusData {
  type: "rightOperator.onFocus";
  path: `${number}.condition.selected.value`;
  index: number;
}

export interface RightOperatorBlurData {
  type: "rightOperator.onBlur";
  path: `${number}.condition.selected.value`;
  index: number;
}

export interface RightOperatorInputValueChangeData {
  type: "rightOperator.onInputValueChange";
  path: `${number}.condition.selected.value`;
  index: number;
  value: string;
}
