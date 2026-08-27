import { getDefaultByControlName } from "../controlsType";
import { type ConditionItem } from "./ConditionOptions";
import { type ConditionValue, isItemOption, isItemOptionArray, isTuple } from "./ConditionValue";

const optionsFromSelectedValue = (value: ConditionValue): ConditionValue[] => {
  if (isItemOption(value)) {
    return [value];
  }

  if (isItemOptionArray(value)) {
    return value;
  }

  return [];
};

export class ConditionSelected {
  public constructor(
    public value: ConditionValue,
    public conditionValue: ConditionItem | null,
    public options: ConditionValue[],
    public loading: boolean,
  ) {}

  public isEmpty() {
    return (
      this.value === "" ||
      (isItemOptionArray(this.value) && this.value.length === 0) ||
      (isTuple(this.value) && this.value.every(el => el === ""))
    );
  }

  public static empty() {
    return new ConditionSelected("", null, [], false);
  }

  public static fromConditionItem(conditionItem: ConditionItem) {
    return new ConditionSelected(
      getDefaultByControlName(conditionItem.type),
      conditionItem,
      [],
      false,
    );
  }

  public static fromConditionItemAndValue(conditionItem: ConditionItem, value: ConditionValue) {
    return new ConditionSelected(value, conditionItem, optionsFromSelectedValue(value), false);
  }

  public enableLoading() {
    this.loading = true;
  }

  public disableLoading() {
    this.loading = false;
  }

  public isLoading() {
    return this.loading;
  }

  public setValue(value: ConditionValue) {
    this.value = value;
  }

  public setOptions(options: ConditionValue[]) {
    this.options = options;
  }
}
