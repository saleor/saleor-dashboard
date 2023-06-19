/* eslint-disable @typescript-eslint/member-ordering */
import { InitialStateResponse } from "../API/InitialStateResponse";
import { ConditionItem, ConditionOptions } from "./../staticConditions";
import { LeftOperand } from "./../useLeftOperands";
import { CONDITIONS, UrlEntry, UrlToken } from "./../ValueProvider/UrlToken";
import { Condition, ConditionSelected, ConditionSelectedValue } from "./Condition";

interface ExpressionValue {
  value: string;
  label: string;
  type: string;
}

const createStaticEntry = (rawEntry: string | ConditionSelectedValue | ConditionSelectedValue[]) => {
  if (typeof rawEntry === "string") return rawEntry
  
  if (Array.isArray(rawEntry)) {
    return rawEntry.map((el) => el.slug)
  }

  return rawEntry.slug
}

const createAttributeEntry = (rawEntry: string | ConditionSelectedValue | ConditionSelectedValue[]) => {
  if (typeof rawEntry === "string") return rawEntry
  
  if (Array.isArray(rawEntry)) {
    return rawEntry.map((el) => el.value)
  }

  return rawEntry.slug
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

  public updateLeftLoadingState(loading: boolean) {
    this.loading = loading;
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

  public updateRightLoadingState(loading: boolean) {
    this.condition.selected.loading = loading;
  }

  public isEmpty() {
    return this.value.type === "e";
  }

  public isStatic() {
    return ConditionOptions.isStaticName(this.value.type);
  }

  public isAttribute() {
    return ConditionOptions.isAttributeInputType(this.value.type);
  }

  public asUrlEntry(): UrlEntry {
    const conditionIndex = CONDITIONS.findIndex(el => el === this.condition.selected.conditionValue.label)
    
    if (this.isAttribute()) {  
      return {
        [`a${conditionIndex}.${this.value.value}`]: createAttributeEntry(this.condition.selected.value)
      }
    }

    return {
      [`s${conditionIndex}.${this.value.value}`]: createStaticEntry(this.condition.selected.value)
    }
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
        {
          value: token.name,
          label: attribute.label,
          type: attribute.inputType,
        },
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    return null;
  }
}
