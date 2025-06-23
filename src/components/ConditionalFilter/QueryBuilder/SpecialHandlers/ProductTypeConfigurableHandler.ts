import { ProductTypeConfigurable, ProductTypeFilterInput } from "@dashboard/graphql";

import { FilterStrategyResolver } from "../../API/strategies";
import { FilterElement } from "../../FilterElement";
import { SpecialHandler } from "../types";

export class ProductTypeConfigurableHandler implements SpecialHandler<ProductTypeFilterInput> {
  canHandle(element: FilterElement): boolean {
    return element.value.type === "typeOfProduct" || element.value.type === "configurable";
  }

  handle(
    result: ProductTypeFilterInput,
    element: FilterElement,
    resolver: FilterStrategyResolver,
  ): boolean {
    const strategy = resolver.resolve(element);
    const queryPart = strategy.buildQueryPart(element);

    if (element.value.type === "typeOfProduct") {
      result.productType = queryPart as any;

      return true;
    }

    if (element.value.type === "configurable") {
      result.configurable =
        queryPart === true ? ProductTypeConfigurable.CONFIGURABLE : ProductTypeConfigurable.SIMPLE;

      return true;
    }

    return false;
  }
}
