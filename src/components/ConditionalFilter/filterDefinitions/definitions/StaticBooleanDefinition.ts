import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { BooleanValuesHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { BothApiFilterDefinition, FilterQuery } from "../types";
import { getBooleanValueFromElement } from "../utils";

export class StaticBooleanDefinition implements BothApiFilterDefinition<FilterQuery> {
  canHandle(element: FilterElement): boolean {
    return [
      "isPublished",
      "hasCategory",
      "hasVariants",
      "isAvailable",
      "isVisibleInListing",
      "giftCard",
      "isActive",
    ].includes(element.value.value);
  }

  createOptionFetcher(): Handler {
    return new BooleanValuesHandler([
      {
        label: "Yes",
        value: "true",
        type: AttributeInputTypeEnum.BOOLEAN,
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        type: AttributeInputTypeEnum.BOOLEAN,
        slug: "false",
      },
    ]);
  }

  updateWhereQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const fieldName = element.value.value;
    const booleanValue = getBooleanValueFromElement(element);

    return { ...query, [fieldName]: booleanValue };
  }

  updateFilterQuery(query: Readonly<FilterQuery>, element: FilterElement): FilterQuery {
    const whereQuery = this.updateWhereQuery(query, element);
    const fieldName = element.value.value;

    return {
      ...query,
      [fieldName]: whereQuery[fieldName], // Boolean values don't need legacy mapping
    };
  }
}
