import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { errorTracker } from "@dashboard/services/errorTracking";

import { InitialProductStateResponse } from "../API/initialState/product/InitialProductStateResponse";
import { RowType, STATIC_OPTIONS } from "../constants";
import { LeftOperand } from "../LeftOperandsProvider";
import { InitialResponseType } from "../types";
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
    public entityType: AttributeEntityTypeEnum | null = null,
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
    return new ExpressionValue(
      leftOperand.slug,
      leftOperand.label,
      leftOperand.type,
      leftOperand.entityType,
    );
  }

  public static fromUrlToken(token: UrlToken) {
    const option = STATIC_OPTIONS.find(o => o.slug === token.name);

    if (!option) {
      return new ExpressionValue(token.name, token.name, token.name);
    }

    return new ExpressionValue(token.name, option.label, token.name);
  }

  public static forAttribute(attributeName: string, response: InitialProductStateResponse) {
    const attribute = response.attributeByName(attributeName);

    if (!attribute) {
      const error = new Error(
        `Attribute "${attributeName}" not found when creating ExpressionValue. This may indicate a deleted attribute or invalid URL.`,
      );

      console.error(error.message);
      errorTracker.captureException(error);

      return ExpressionValue.emptyStatic();
    }

    return new ExpressionValue(
      attributeName,
      attribute.label,
      attribute.inputType,
      attribute.entityType,
    );
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
    public selectedAttribute: ExpressionValue | null = null,
    public availableAttributesList: LeftOperand[] = [],
    public attributeLoading = false,
  ) {
    this.updateConstraint();
  }

  private updateConstraint() {
    if (this.isAttribute) {
      if (this.selectedAttribute) {
        // Attribute is selected, so no constraint on value input
        this.constraint = undefined;
      } else {
        // "Attribute" is selected, but not a specific one. Disable value input.
        this.constraint = new Constraint([], ["right"]);
      }
    } else {
      // Not an attribute filter, use static constraints from config
      this.constraint = Constraint.fromSlug(this.value.value) || undefined;
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
    this.selectedAttribute = null;
    this.updateConstraint();
  }

  public updateSelectedAttribute(leftOperand: LeftOperand) {
    this.selectedAttribute = ExpressionValue.fromLeftOperand(leftOperand);
    this.condition = Condition.emptyFromLeftOperand(leftOperand);
    this.updateConstraint();
  }

  public updateAvailableAttributesList(options: LeftOperand[]) {
    this.availableAttributesList = options;
  }

  public updateAttributeLoadingState(loading: boolean) {
    this.attributeLoading = loading;
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

  public get isAttribute() {
    return this.value.value === "attribute";
  }

  public isAttributeValueInputDisabled() {
    return this.isAttribute && !this.selectedAttribute;
  }

  public rowType(): RowType | null {
    if (this.isStatic() || this.isAttribute) {
      return this.value.value as RowType;
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
    if (this.isAttribute && this.selectedAttribute) {
      if (
        this.selectedAttribute.type === "REFERENCE" ||
        this.selectedAttribute.type === "SINGLE_REFERENCE"
      ) {
        return UrlEntry.forReferenceAttribute(
          this.condition.selected,
          this.selectedAttribute.value,
        );
      }

      return UrlEntry.forAttribute(this.condition.selected, this.selectedAttribute.value);
    }

    return UrlEntry.forStatic(this.condition.selected, this.value.value);
  }

  public equals(element: FilterElement) {
    return this.value.value === element.value.value;
  }

  public static isFilterElement(element: unknown): element is FilterElement {
    return (
      typeof element === "object" &&
      !Array.isArray(element) &&
      element !== null &&
      "value" in element
    );
  }

  public static createEmpty() {
    return new FilterElement(
      ExpressionValue.emptyStatic(),
      Condition.createEmpty(),
      false,
      undefined,
    );
  }

  public static createStaticBySlug(slug: StaticElementName) {
    return new FilterElement(
      ExpressionValue.fromSlug(slug),
      Condition.emptyFromSlug(slug),
      false,
      undefined,
    );
  }

  public static fromUrlToken(token: UrlToken, response: InitialResponseType) {
    if (token.isStatic()) {
      return new FilterElement(
        ExpressionValue.fromUrlToken(token),
        Condition.fromUrlToken(token, response),
        false,
      );
    }

    if (token.isAttribute()) {
      const attribute = (response as InitialProductStateResponse).attributeByName(token.name);

      if (!attribute) {
        const error = new Error(
          `Attribute "${token.name}" not found when creating FilterElement from URL token. This may indicate a deleted attribute or invalid URL parameter.`,
        );

        console.error(error.message, { token, response });
        errorTracker.captureException(error);

        return FilterElement.createEmpty();
      }

      return new FilterElement(
        ExpressionValue.fromSlug("attribute"),
        Condition.fromUrlToken(token, response),
        false,
        undefined,
        ExpressionValue.forAttribute(token.name, response as InitialProductStateResponse),
      );
    }

    return FilterElement.createEmpty();
  }
}

export const hasEmptyRows = (container: FilterContainer) => {
  return container.filter(FilterElement.isFilterElement).some((e: FilterElement) => e.isEmpty());
};

export type FilterContainer = Array<string | FilterElement | FilterContainer>;
