import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";

import { DiscountType } from "../types";

export const catalogConditionOptions: Array<{
  label: string;
  value: CatalogConditions;
}> = [
  {
    label: "Products",
    value: "product",
  },
  {
    label: "Collections",
    value: "collection",
  },
  {
    label: "Categories",
    value: "category",
  },
  {
    label: "Variants",
    value: "variant",
  },
];

export const orderConditionOptions: Array<{
  label: string;
  value: OrderConditions;
}> = [
  {
    label: "Subtotal price",
    value: "subtotal",
  },
  {
    label: "Total price",
    value: "total",
  },
];

export const useConditionLeftOptions = (discountType: DiscountType) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (discountType === "catalog") {
      setOptions(catalogConditionOptions);
    } else {
      setOptions(orderConditionOptions);
    }
  }, [discountType]);

  return {
    options,
  };
};
