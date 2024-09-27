import { ConditionValue } from "./FilterElement/ConditionValue";

const CONTROL_DEFAULTS = {
  text: "",
  number: "",
  "number.range": ["", ""] as [string, string],
  multiselect: [] as ConditionValue,
  select: "",
  combobox: "",
  date: "",
  datetime: "",
  "date.range": ["", ""] as [string, string],
  "datetime.range": ["", ""] as [string, string],
};

export const getDefaultByControlName = (name: string): ConditionValue =>
  CONTROL_DEFAULTS[name as keyof typeof CONTROL_DEFAULTS];
