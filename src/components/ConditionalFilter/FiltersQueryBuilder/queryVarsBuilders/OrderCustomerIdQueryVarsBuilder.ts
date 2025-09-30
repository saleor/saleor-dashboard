import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

type OrderCustomerFilterQueryPart = {
  user?: { eq: string };
};

export class OrderCustomerIdQueryVarsBuilder extends BaseMappableQueryVarsBuilder<OrderCustomerFilterQueryPart> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "customer";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(): string {
    return "user";
  }
}
