import { ConditionType } from "@dashboard/discounts/types";

export const initialDiscountConditionType: Array<{
  label: string;
  value: ConditionType;
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
    value: "categorie",
  },
  {
    label: "Variants",
    value: "variant",
  },
];
