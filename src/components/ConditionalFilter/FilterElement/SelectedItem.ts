import { ConditionOptions } from "../staticConditions";

interface ConditionSelected {
  value: string | ConditionSelectedValue | ConditionSelectedValue[];
  conditionValue: ConditionItem;
  options?: Array<{ value: string; label: string }>;
}


export class SelectedItem {
  private constructor(
    public value: any,
    public conditionValue: any,
    public options: any
  ) {}


  public static fromOptions (options: ConditionOptions) {
    const selected: ConditionSelected = {
      conditionValue: options.first(),
      value: token.value,
      options: attribute.choices
    };

  }

}