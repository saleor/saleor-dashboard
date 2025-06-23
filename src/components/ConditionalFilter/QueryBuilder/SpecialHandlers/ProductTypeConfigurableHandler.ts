import { ProductTypeConfigurable, ProductTypeFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";
import { mapStaticQueryPartToLegacyVariables } from "../utils";

export class ProductTypeConfigurableHandler implements SpecialHandler<ProductTypeFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "configurable" || element.value.type === "typeOfProduct";
  }

  handle(
    result: ProductTypeFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): void {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);
    const value = mapStaticQueryPartToLegacyVariables(queryPart);

    if (element.value.type === "typeOfProduct") {
      result.productType = value;

      return;
    }

    if (element.value.type === "configurable") {
      result.configurable =
        value === true ? ProductTypeConfigurable.CONFIGURABLE : ProductTypeConfigurable.SIMPLE;

      return;
    }
  }
}
