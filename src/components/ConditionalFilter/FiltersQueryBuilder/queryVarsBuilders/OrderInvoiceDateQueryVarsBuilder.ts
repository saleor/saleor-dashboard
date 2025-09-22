import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsDateUtils } from "../dateUtils";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

type OrderInvoiceDateQueryVars = {
  invoices?: Array<{ createdAt?: { gte?: string; lte?: string } }>;
};

/** Returns invoice date filter query, it's a array with single property `createdAt` */
export class OrderInvoiceDateQueryVarsBuilder extends BaseMappableQueryVarsBuilder<OrderInvoiceDateQueryVars> {
  private static readonly FIELD_NAME = "invoicesCreatedAt";

  canHandle(element: FilterElement): boolean {
    const fieldName = element.value.value || element.value.label || "";

    return fieldName === OrderInvoiceDateQueryVarsBuilder.FIELD_NAME;
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(): string {
    return "invoices";
  }

  protected getConditionValue(
    element: FilterElement,
  ): OrderInvoiceDateQueryVars[keyof OrderInvoiceDateQueryVars] | undefined {
    const { value: selectedValue, conditionValue } = element.condition.selected;

    if (!conditionValue) {
      return undefined;
    }

    const { label } = conditionValue;
    const filter = QueryVarsDateUtils.buildDateFilter(selectedValue, label);

    if (filter) {
      return [{ createdAt: filter }];
    }

    return undefined;
  }
}
