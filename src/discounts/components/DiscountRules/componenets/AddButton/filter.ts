import { MenuItem } from "@dashboard/components/SubMenu";
import { PromotionTypeEnum } from "@dashboard/graphql";

export const byDiscountType =
  (discountType: PromotionTypeEnum) =>
  (menuItem: MenuItem): boolean => {
    if (!discountType) {
      return true;
    }

    if (discountType === menuItem.id) {
      return true;
    }

    return false;
  };
