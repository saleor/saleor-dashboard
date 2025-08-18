import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsDateUtils } from "../dateUtils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

export type OrderInvoiceDateQueryVars = {
  invoices?: Array<{ createdAt?: { gte?: string; lte?: string } }>;
};

export class OrderInvoiceDateQueryVarsBuilder extends BaseMappableQueryVarsBuilder<OrderInvoiceDateQueryVars> {
  private static readonly FIELD_NAME = "invoicesCreatedAt";

  public canHandle(element: FilterElement): boolean {
    const fieldName = element.value.value || element.value.label || "";

    return fieldName === OrderInvoiceDateQueryVarsBuilder.FIELD_NAME;
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(): string {
    return "invoices";
  }
  
  protected getConditionValue(element: FilterElement): OrderInvoiceDateQueryVars[keyof OrderInvoiceDateQueryVars] | undefined {
    const { value: selectedValue, conditionValue } = element.condition.selected;
    const { label } = conditionValue;
    const filter = QueryVarsDateUtils.buildDateFilter(selectedValue, label);

    if (filter) {
      return [{ createdAt: filter }];
    }

    return undefined;
  }
}
