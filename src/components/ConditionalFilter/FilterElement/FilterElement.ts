/* eslint-disable @typescript-eslint/member-ordering */
import { InitialStateResponse } from "../API/InitialStateResponse";
import { ConditionItem, ConditionOptions } from "./../staticConditions";
import { LeftOperand } from "./../useLeftOperands";
import { UrlToken } from "./../ValueProvider/UrlToken";
import { Condition } from "./Condition";

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

  public updateLeftOperator(leftOperand: LeftOperand) {
    this.value = {
      value: leftOperand.value,
      label: leftOperand.label,
      type: leftOperand.type,
    };
    this.condition = Condition.emptyFromLeftOperand(leftOperand);
  }

  public updateCondition(conditionValue: ConditionItem) {
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
    return ConditionOptions.isStaticName(this.value.type)
  }

  public isAttribute() {
    return ConditionOptions.isAttributeInputType(this.value.type)
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

  public static fromUrlToken(token: UrlToken, response: InitialStateResponse) {
    if (token.isStatic()) {
      return new FilterElement(
        { value: token.name, label: token.name, type: token.name },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    if (token.isAttribute()) {
      const attribute = response.attributeByName(token.name);

      return new FilterElement(
        { value: token.name, label: attribute.label, type: attribute.inputType },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    return null;
  }
}
