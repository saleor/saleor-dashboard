import { PromotionTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";

import { useCatalogConditionNames } from "./useCatalogConditionNames";
import { useOrderConditionNames } from "./useOrderConditionNames";

export const useConditionNames = (
  discountType: PromotionTypeEnum,
): Option[] => {
  const catalogOptions = useCatalogConditionNames();
  const orderOptions = useOrderConditionNames();

  if (discountType === PromotionTypeEnum.CATALOGUE) {
    return catalogOptions;
  }

  if (discountType === PromotionTypeEnum.ORDER) {
    return orderOptions;
  }

  return [];
};
