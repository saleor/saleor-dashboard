/* eslint-disable @typescript-eslint/member-ordering */
import { CONTROL_DEFAULTS } from "./controlsType";
import {
  ATTRIBUTE_INPUT_TYPE_CONDITIONS,
  STATIC_CONDITIONS,
} from "./staticConditions";
import { UrlToken } from "./ValueProvider/UrlToken";

interface ConditionOption {
  type: string;
  label: string;
  value: string;
}

interface ConditionSelected {
  value: string | string[];
  conditionValue: ConditionOption;
  options?: Array<{ value: string; label: string }>;
}

class Condition {
  private constructor(
    public options: ConditionOption[],
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

    return new Condition([], selected, false);
  }

  public static emptyFromName(operandName: ConditionOption) {
    let options: ConditionOption[] = [];
    if (typeof STATIC_CONDITIONS[operandName.value] === "undefined") {
      options = ATTRIBUTE_INPUT_TYPE_CONDITIONS[operandName.type];
    } else {
      options = STATIC_CONDITIONS[operandName.value];
    }
    const firstOption = options[0];
    const defaults = CONTROL_DEFAULTS[firstOption.type];
    const selected: ConditionSelected = {
      conditionValue: firstOption,
      value: defaults.value,
    };

    return new Condition(options, selected, false);
  }

  public static fromUrlToken(token: UrlToken, response: unknown) {
    if (token.isStatic()) {
      const staticOptions = STATIC_CONDITIONS[token.name];
      const selectedOption = staticOptions.find(
        el => el.label === token.conditionKind,
      );

      const options = response[token.name].filter(({ slug }) =>
        token.value.includes(slug),
      );
      const selected: ConditionSelected = {
        conditionValue: selectedOption.value,
        value: token.value,
        options,
      };

      return new Condition(staticOptions, selected, false);
    }

    if (token.isAttribute() && response.attribute) {
      const attr = response.attribute[token.name];
      const options = ATTRIBUTE_INPUT_TYPE_CONDITIONS[attr.inputType];
      console.log("attribute handling", attr);

      // return new Condition(staticOptions, selected, false)
    }

    return null;
  }
}

interface ExpressionValue {
  value: string;
  label: string;
  type: string;
}

export class FilterElement {
  private constructor(
    public value: ExpressionValue,
    public condition: Condition,
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

  public updateLeftOperator(leftOperator: ConditionOption) {
    this.value = {
      value: leftOperator.value,
      label: leftOperator.label,
      type: leftOperator.type,
    };
    this.condition = Condition.emptyFromName(leftOperator);
  }

  public updateCondition(conditionValue: ConditionOption) {
    this.condition.selected.conditionValue = conditionValue;
  }

  public updateRightOperator(value: string | string[]) {
    this.condition.selected.value = value;
  }

  public updateRightOptions(options: any) {
    this.condition.selected.options = options;
  }

  public isEmpty() {
    return this.value.type === "e";
  }

  public isStatic() {
    return this.value.type === "s";
  }

  public isAttribute() {
    return this.value.type === "a";
  }

  public static fromValueEntry(valueEntry: any) {
    return new FilterElement(valueEntry.value, valueEntry.condition, false);
  }

  public static createEmpty() {
    return new FilterElement(
      { value: "", label: "", type: "s" },
      Condition.createEmpty(),
      false,
    );
  }

  public static fromUrlToken(token: UrlToken, response: unknown) {
    if (token.isStatic()) {
      return new FilterElement(
        { value: token.name, label: token.name, type: "s" },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    if (token.isAttribute()) {
      return new FilterElement(
        { value: token.name, label: "from api", type: "a" },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    return null;
  }
}
