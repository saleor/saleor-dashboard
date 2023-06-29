import { getDefaultByControlName } from "../controlsType";
import { ConditionItem } from "./ConditionOptions";

export interface ItemOption {
  label: string;
  value: string;
  slug?: string;
}

export type ConditionOption =
  | ItemOption
  | ItemOption[]
  | string
  | string[]
  | [string, string];

export class ConditionSelected {
  private constructor(
    public value: ConditionOption,
    public conditionValue: ConditionItem | null,
    public options: ConditionOption[],
    public loading: boolean,
  ) {}

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

  public static fromConditionItemAndValue(
    conditionItem: ConditionItem,
    value: ConditionOption,
  ) {
    return new ConditionSelected(value, conditionItem, [], false);
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

  public setValue(value: ConditionOption) {
    this.value = value;
  }

  public setOptions(options: ConditionOption[]) {
    this.options = options;

    if (this.conditionValue) {
      this.value = getDefaultByControlName(this.conditionValue.type);
    }
  }
}
