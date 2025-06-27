import { ProductTypeConfigurable } from "@dashboard/graphql";

import { Handler, NoopValuesHandler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { isItemOption } from "../../FilterElement/ConditionValue";
import { BothApiFilterDefinition } from "../types";

export class ProductTypeConfigurableDefinition implements BothApiFilterDefinition<any> {
  canHandle(element: FilterElement): boolean {
    return element.value.value === "configurable" || element.value.value === "typeOfProduct";
  }

  createOptionFetcher(): Handler {
    return new NoopValuesHandler([]);
  }

  updateWhereQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;

    if (element.value.value === "typeOfProduct") {
      let productTypeValue;

      if (isItemOption(selectedValue)) {
        productTypeValue = selectedValue.value;
      } else {
        productTypeValue = selectedValue;
      }

      return { ...query, productType: { eq: productTypeValue } };
    }

    if (element.value.value === "configurable") {
      let configurableValue: ProductTypeConfigurable;

      if (isItemOption(selectedValue)) {
        configurableValue = selectedValue.value as ProductTypeConfigurable;
      } else {
        configurableValue = selectedValue as ProductTypeConfigurable;
      }

      return { ...query, configurable: { eq: configurableValue } };
    }

    return query;
  }

  updateFilterQuery(query: Readonly<any>, element: FilterElement): any {
    const { value: selectedValue } = element.condition.selected;

    if (element.value.value === "typeOfProduct") {
      let productTypeValue;

      if (isItemOption(selectedValue)) {
        productTypeValue = selectedValue.value;
      } else {
        productTypeValue = selectedValue;
      }

      return { ...query, productType: productTypeValue };
    }

    if (element.value.value === "configurable") {
      let configurableValue: ProductTypeConfigurable;

      if (isItemOption(selectedValue)) {
        configurableValue = selectedValue.value as ProductTypeConfigurable;
      } else {
        configurableValue = selectedValue as ProductTypeConfigurable;
      }

      return { ...query, configurable: configurableValue };
    }

    return query;
  }
}
