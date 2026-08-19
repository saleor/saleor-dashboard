import { type Handler, NoopValuesHandler } from "../../API/Handler";
import { type FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

/** `promotionType` maps to PromotionWhereInput.type */
export class PromotionTypeQueryVarsBuilder extends BaseMappableQueryVarsBuilder<{
  type?: unknown;
}> {
  protected readonly queryField = "type";

  canHandle(element: FilterElement): boolean {
    return element.value.value === "promotionType";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(): string {
    return this.queryField;
  }
}
