import { MenuItem } from "@dashboard/components/SubMenu";
import { DiscountType } from "@dashboard/discounts/types";

export const byDiscountType =
  (discountType: DiscountType) =>
  (menuItem: MenuItem): boolean => {
    if (!discountType) {
      return true;
    }

    if (discountType === menuItem.id) {
      return true;
    }

    return false;
  };
