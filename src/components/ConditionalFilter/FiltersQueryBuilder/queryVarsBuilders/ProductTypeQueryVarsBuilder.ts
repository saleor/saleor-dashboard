import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

type ProductTypeFilterQueryPart = {
  productType?: string;
};

/** `typeOfProduct` needs to be renamed to `productType` in query */
export class ProductTypeQueryVarsBuilder extends BaseMappableQueryVarsBuilder<ProductTypeFilterQueryPart> {
  protected readonly queryField = "productType";

  canHandle(element: FilterElement): boolean {
    return element.value.value === "typeOfProduct";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(): string {
    return this.queryField;
  }
}
