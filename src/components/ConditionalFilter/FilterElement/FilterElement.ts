/* eslint-disable @typescript-eslint/member-ordering */
import { Condition } from "./Condition";
import { ConditionItem } from "./../staticConditions";
import { LeftOperand } from "./../useLeftOperands";
import { UrlToken } from "./../ValueProvider/UrlToken";
import { InitialStateResponse } from "../API/InitialStateResponse";

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

  public static fromUrlToken(token: UrlToken, response: InitialStateResponse) {
    if (token.isStatic()) {
      return new FilterElement(
        { value: token.name, label: token.name, type: "s" },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    if (token.isAttribute()) {
      const attribute = response.attributeByName(token.name)
      // const label = response.attribute && response.attribute[token.name].label
      
      console.log("test", attribute)
      // if (!label) return null

      return new FilterElement(
        { value: token.name, label: "load from api", type: "a" },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    return null;
  }
}
