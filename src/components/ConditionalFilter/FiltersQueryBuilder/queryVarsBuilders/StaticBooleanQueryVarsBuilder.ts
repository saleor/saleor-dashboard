import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { BooleanValuesHandler, Handler } from "../../API/Handler";
import { FilterElement } from "../../FilterElement";
import { QueryVarsBuilderUtils } from "../utils";
import { BothApiQueryVarsBuilder, FilterQuery } from "./types";

const SUPPORTED_STATIC_BOOLEAN_FILTERS = new Set([
  "isPublished",
  "hasCategory",
  "hasVariants",
  "isAvailable",
  "isVisibleInListing",
  "giftCard",
  "isActive",
  "isClickAndCollect",
  "isGiftCardUsed",
  "isGiftCardBought",
  "hasInvoices",
  "hasFulfillments",
] as const);

type SupportedStaticBooleanKeys =
  typeof SUPPORTED_STATIC_BOOLEAN_FILTERS extends Set<infer T> ? T : never;

type StaticBooleanFilterQueryPart = Partial<Record<SupportedStaticBooleanKeys, boolean>>;

export class StaticBooleanQueryVarsBuilder
  implements BothApiQueryVarsBuilder<StaticBooleanFilterQueryPart>
{
  canHandle(element: FilterElement): boolean {
    return SUPPORTED_STATIC_BOOLEAN_FILTERS.has(element.value.value as SupportedStaticBooleanKeys);
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

  updateWhereQueryVariables(query: Readonly<FilterQuery>, element: FilterElement) {
    const fieldName = element.value.value;
    const booleanValue = QueryVarsBuilderUtils.getBooleanValueFromElement(element);

    return { ...query, [fieldName as SupportedStaticBooleanKeys]: booleanValue };
  }

  updateFilterQueryVariables(query: Readonly<FilterQuery>, element: FilterElement) {
    const whereQuery = this.updateWhereQueryVariables(query, element);
    const fieldName = element.value.value;

    return {
      ...query,
      [fieldName as SupportedStaticBooleanKeys]: whereQuery[fieldName], // Boolean values don't need legacy mapping
    };
  }
}
