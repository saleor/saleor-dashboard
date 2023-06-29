// @ts-strict-ignore
import { ConditionOption } from "./FilterElement/ConditionSelected";

export const CONTROL_DEFAULTS = {
  text: "",
  number: "",
  "number.range": [] as unknown as [string, string],
  multiselect: [] as ConditionOption[],
  select: "",
  combobox: "",
};

export const getDefaultByControlName = (name: string): ConditionOption =>
  CONTROL_DEFAULTS[name];
