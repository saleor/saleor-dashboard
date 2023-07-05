/* eslint-disable @typescript-eslint/member-ordering */
import { InitialStateResponse } from "../API/InitialStateResponse";
import { LeftOperand } from "./../useLeftOperands";
import { UrlEntry, UrlToken } from "./../ValueProvider/UrlToken";
import { Condition } from "./Condition";
import { ConditionItem, ConditionOptions } from "./ConditionOptions";
import { ConditionSelected } from "./ConditionSelected";
import { ConditionValue, ItemOption } from "./ConditionValue";

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
      value: leftOperand.slug,
      label: leftOperand.label,
      type: leftOperand.type,
    };
    this.condition = Condition.emptyFromLeftOperand(leftOperand);
  }

  public updateLeftLoadingState(loading: boolean) {
    this.loading = loading;
  }

  public updateCondition(conditionValue: ConditionItem) {
    this.condition.selected =
      ConditionSelected.fromConditionItem(conditionValue);
  }

  public updateRightOperator(value: ConditionValue) {
    this.condition.selected.setValue(value);
  }

  public updateRightOptions(options: ItemOption[]) {
    this.condition.selected.setOptions(options);
  }

  public updateRightLoadingState(loading: boolean) {
    if (loading) {
      this.condition.selected.enableLoading();
      return;
    }

    this.condition.selected.disableLoading();
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

  public isCollection() {
    return this.value.value === "collection";
  }

  public isCategory() {
    return this.value.value === "category";
  }

  public isProductType() {
    return this.value.value === "producttype";
  }

  public isChannel() {
    return this.value.value === "channel";
  }

  public asUrlEntry(): UrlEntry {
    if (this.isAttribute()) {
      return UrlEntry.forAttribute(this.condition.selected, this.value.value)
    }

    return UrlEntry.forStatic(this.condition.selected, this.value.value)
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
