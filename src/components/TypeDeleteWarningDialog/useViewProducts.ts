import { useFlag } from "@dashboard/featureFlags";
import { productListPath } from "@dashboard/products/urls";
import { stringify } from "qs";
import urljoin from "url-join";

import { FilterElement } from "../ConditionalFilter/FilterElement";
import { TypeBaseData } from "./types";

interface ViewProductsProps {
  productTypeBaseData: TypeBaseData;
  defaultNavigationLink: string;
}

export const useViewProducts = ({
  defaultNavigationLink,
  productTypeBaseData,
}: ViewProductsProps) => {
  const { enabled: productFiltersFlagEnabled } = useFlag("product_filters");

  const handleLegacyViewProducts = () => {
    return defaultNavigationLink;
  };

  const handleViewProducts = () => {
    const { id, name, slug } = productTypeBaseData;
    const productFilterElement = FilterElement.createStaticBySlug("productType");

    productFilterElement.updateRightOperator("is");

    productFilterElement.condition.selected.setValue({
      label: name,
      slug: slug,
      value: id,
    });

    const query = [productFilterElement.asUrlEntry()];

    const url = stringify({
      ...query,
    });

    return urljoin(productListPath, `?${url}`);
  };

  const getViewProductsURL = () => {
    let url = "";

    if (productFiltersFlagEnabled) {
      url = handleViewProducts();
    } else {
      url = handleLegacyViewProducts();
    }

    return url;
  };

  return {
    getViewProductsURL,
  };
};
