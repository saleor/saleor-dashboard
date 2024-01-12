import { DiscountType } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";
import { createContext } from "react";

import { FetchOptions } from "../hooks/useCondtionRightOptions";

export const discountRulesContext = createContext<{
  conditionLeftOptions: Option[];
  discountType: DiscountType;
  getConditionTypesOptions: (type: string) => Option[];
  getConditionInputTypeByLabel: (name: string, type: string) => string | null;
  getFetchProps: (type: string) => FetchOptions;
} | null>(null);
