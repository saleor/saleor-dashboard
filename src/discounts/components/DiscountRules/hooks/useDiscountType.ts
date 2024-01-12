import { DiscountType } from "@dashboard/discounts/types";
import { useEffect, useState } from "react";

export const useDiscountType = (discountTypeFromAPI: DiscountType) => {
  const [discountType, setDiscountType] =
    useState<DiscountType>(discountTypeFromAPI);

  useEffect(() => {
    if (!discountType) {
      setDiscountType(discountTypeFromAPI);
    }
  }, [discountTypeFromAPI]);

  const setDiscountTypeHandler = (discountType: DiscountType) => {
    setDiscountType(discountType);
  };

  return {
    discountType,
    setDiscountType: setDiscountTypeHandler,
  };
};
