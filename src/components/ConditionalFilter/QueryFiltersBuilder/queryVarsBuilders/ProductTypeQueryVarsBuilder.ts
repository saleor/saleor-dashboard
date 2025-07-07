import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BaseMappableQueryVarsBuilder } from "./BaseMappableQueryVarsBuilder";

/** `typeOfProduct` needs to be renamed to `productType` in query */
export class ProductTypeQueryVarsBuilder extends BaseMappableQueryVarsBuilder {
  protected readonly queryField = "productType";

  public canHandle(element: FilterElement): boolean {
    return element.value.value === "typeOfProduct";
  }

  public createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  protected getQueryFieldName(_element: FilterElement): string {
    return this.queryField;
  }
}
