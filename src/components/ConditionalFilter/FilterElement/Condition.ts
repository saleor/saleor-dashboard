/* eslint-disable @typescript-eslint/member-ordering */
import { CONTROL_DEFAULTS } from "./../controlsType";
import {
  ConditionItem,
  ConditionOptions,
} from "./../staticConditions";
import { LeftOperand } from "./../useLeftOperands";
import { UrlToken } from "./../ValueProvider/UrlToken";


interface ConditionSelected {
  value: string | string[];
  conditionValue: ConditionItem;
  options?: Array<{ value: string; label: string }>;
}

export class Condition {
  private constructor(
    public options: ConditionOptions,
    public selected: ConditionSelected,
    public loading: boolean,
  ) {}

  public enableLoading() {
    this.loading = true;
  }

  public disableLoading() {
    this.loading = false;
  }

  public isLoading() {
    return this.loading;
  }

  public static createEmpty() {
    const selected = {
      value: "",
      conditionValue: { value: "", label: "", type: "" },
    };

    return new Condition(ConditionOptions.empty(), selected, false);
  }

  public static emptyFromLeftOperand(operand: LeftOperand) {
    const options = ConditionOptions.fromName(operand.type)
    const firstOption = options[0];
    const defaults = CONTROL_DEFAULTS[firstOption.type];
    const selected: ConditionSelected = {
      conditionValue: firstOption,
      value: defaults.value,
    };

    return new Condition(options, selected, false);
  }

  public static fromUrlToken(token: UrlToken, response: unknown) {
    if (ConditionOptions.isStaticName(token.name)) {
      const staticOptions = ConditionOptions.fromStaticElementName(token.name)
      const selectedOption = staticOptions.findByLabel(token.conditionKind)
      
      const options = response[token.name].filter(({ slug }) =>
        token.value.includes(slug),
      );
      const selected: ConditionSelected = {
        conditionValue: selectedOption,
        value: token.value,
        options,
      };

      return new Condition(staticOptions, selected, false);
    }

    if (token.isAttribute() && response.attribute) {
      const attr = response.attribute[token.name];
      const options = ConditionOptions.fromAtributeType(attr.inputType)
      console.log("attribute handling", attr);

      // return new Condition(staticOptions, selected, false)
    }

    return null;
  }
}