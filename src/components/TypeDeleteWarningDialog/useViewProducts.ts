import { useFlag } from "@dashboard/featureFlags";
import { productListPath } from "@dashboard/products/urls";
import { stringify } from "qs";
import { useMemo } from "react";
import urljoin from "url-join";

import { FilterElement } from "../ConditionalFilter/FilterElement";
import { prepareStructure } from "../ConditionalFilter/ValueProvider/utils";
import { TypeBaseData } from "./types";

interface ViewProductsProps {
  productTypeBaseData: TypeBaseData[] | undefined;
  defaultNavigationLink: string;
}

const baseDataToCondition = (baseData: TypeBaseData) => ({
  label: baseData.name,
  slug: baseData.slug,
  value: baseData.id,
});

export const useViewProducts = ({
  defaultNavigationLink,
  productTypeBaseData,
}: ViewProductsProps) => {
  const { enabled: productFiltersFlagEnabled } = useFlag("product_filters");

  // TODO: Remove this when the feature flag is removed
  const legacyViewProductsUrl = defaultNavigationLink;

  const newViewProductsUrl = useMemo(() => {
    if (!productTypeBaseData) {
      return null;
    }

    const productFilterElement = FilterElement.createStaticBySlug("productType");

    const condition =
      productTypeBaseData.length > 1
        ? productFilterElement.condition.options[1]
        : productFilterElement.condition.options[0]; // "in" or "is"

    productFilterElement.updateCondition(condition);

    productFilterElement.updateRightOperator(productTypeBaseData.map(baseDataToCondition));

    const url = stringify({
      ...prepareStructure([productFilterElement]),
    });

    return urljoin(productListPath, `?${url}`);
  }, [productTypeBaseData]);

  return productFiltersFlagEnabled ? newViewProductsUrl : legacyViewProductsUrl;
};
