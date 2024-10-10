import { productListPath } from "@dashboard/products/urls";
import { stringify } from "qs";
import { useMemo } from "react";
import urljoin from "url-join";

import { FilterElement } from "../ConditionalFilter/FilterElement";
import { prepareStructure } from "../ConditionalFilter/ValueProvider/utils";
import { TypeBaseData } from "./types";

export interface ProductTypeBaseData extends TypeBaseData {
  slug: string;
}

interface ViewProductsProps {
  productTypeBaseData: ProductTypeBaseData[] | undefined;
}

const baseDataToCondition = (baseData: ProductTypeBaseData) => ({
  label: baseData.name,
  slug: baseData.slug,
  value: baseData.id,
});

export const useViewProducts = ({ productTypeBaseData }: ViewProductsProps) => {
  const viewProductsUrl = useMemo(() => {
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

  return viewProductsUrl;
};
