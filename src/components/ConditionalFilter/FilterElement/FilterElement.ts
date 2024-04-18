import { InitialStateResponse } from "../API/InitialStateResponse";
import { RowType, STATIC_OPTIONS } from "../constants";
import { LeftOperand } from "../LeftOperandsProvider";
import { TokenType, UrlEntry, UrlToken } from "./../ValueProvider/UrlToken";
import { Condition } from "./Condition";
import { ConditionItem, ConditionOptions, StaticElementName } from "./ConditionOptions";
import { ConditionSelected } from "./ConditionSelected";
import { ConditionValue, ItemOption } from "./ConditionValue";
import { Constraint } from "./Constraint";

export class ExpressionValue {
  constructor(
    public value: string,
    public label: string,
    public type: string,
  ) {}

  public setLabel(label: string) {
    this.label = label;
  }

  public isEmpty() {
    return this.value.length === 0 || this.label.length === 0;
  }

  public static fromSlug(slug: string) {
    const option = STATIC_OPTIONS.find(o => o.slug === slug);

    if (!option) return ExpressionValue.emptyStatic();

    return new ExpressionValue(option.slug, option.label, option.type);
  }

  public static fromLeftOperand(leftOperand: LeftOperand) {
    return new ExpressionValue(leftOperand.slug, leftOperand.label, leftOperand.type);
  }

  public static fromUrlToken(token: UrlToken) {
    const option = STATIC_OPTIONS.find(o => o.slug === token.name);

    if (!option) {
      return new ExpressionValue(token.name, token.name, token.name);
    }

    return new ExpressionValue(token.name, option.label, token.name);
  }

  public static forAttribute(attributeName: string, response: InitialStateResponse) {
    const attribute = response.attributeByName(attributeName);

    return new ExpressionValue(attributeName, attribute.label, attribute.inputType);
  }

  public static emptyStatic() {
    return new ExpressionValue("", "", TokenType.STATIC);
  }
}

export class FilterElement {
  public constructor(
    public value: ExpressionValue,
    public condition: Condition,
    public loading: boolean,
    public constraint?: Constraint,
  ) {
    const newConstraint = Constraint.fromSlug(this.value.value);

    if (newConstraint) {
      this.constraint = newConstraint;
    }
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

  public updateLeftOperator(leftOperand: LeftOperand) {
    this.value = ExpressionValue.fromLeftOperand(leftOperand);
    this.condition = Condition.emptyFromLeftOperand(leftOperand);
  }

  public updateLeftLoadingState(loading: boolean) {
    this.loading = loading;
  }

  public updateCondition(conditionValue: ConditionItem) {
    this.condition.selected = ConditionSelected.fromConditionItem(conditionValue);
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
    return this.value.isEmpty() || this.condition.isEmpty();
  }

  public isStatic() {
    return ConditionOptions.isStaticName(this.value.type);
  }

  public isAttribute() {
    return ConditionOptions.isAttributeInputType(this.value.type);
  }

  public rowType(): RowType | null {
    if (this.isStatic()) {
      return this.value.value as RowType;
    }

    if (this.isAttribute()) {
      return "attribute";
    }

    return null;
  }

  public setConstraint(constraint: Constraint) {
    this.constraint = constraint;
  }

  public clearConstraint() {
    this.constraint = undefined;
  }

  public asUrlEntry(): UrlEntry {
    if (this.isAttribute()) {
      return UrlEntry.forAttribute(this.condition.selected, this.value.value);
    }

    return UrlEntry.forStatic(this.condition.selected, this.value.value);
  }

  public equals(element: FilterElement) {
    return this.value.value === element.value.value;
  }

  public static isCompatible(element: unknown): element is FilterElement {
    return (
      typeof element === "object" &&
      !Array.isArray(element) &&
      element !== null &&
      "value" in element
    );
  }

  public static createEmpty() {
    return new FilterElement(ExpressionValue.emptyStatic(), Condition.createEmpty(), false);
  }

  public static createStaticBySlug(slug: StaticElementName) {
    return new FilterElement(ExpressionValue.fromSlug(slug), Condition.emptyFromSlug(slug), false);
  }

  public static fromUrlToken(token: UrlToken, response: InitialStateResponse) {
    if (token.isStatic()) {
      return new FilterElement(
        ExpressionValue.fromUrlToken(token),
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    if (token.isAttribute()) {
      return new FilterElement(
        ExpressionValue.forAttribute(token.name, response),
        Condition.fromUrlToken(token, response),
        false,
      );
    }
    return FilterElement.createEmpty();
  }
}

export const hasEmptyRows = (container: FilterContainer) => {
  return container.filter(FilterElement.isCompatible).some((e: FilterElement) => e.isEmpty());
};

export type FilterContainer = Array<string | FilterElement | FilterContainer>;
