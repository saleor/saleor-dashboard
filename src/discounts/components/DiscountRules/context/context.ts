import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";
import { createContext } from "react";

import { FetchOptions } from "../hooks/useCondtionRightOptions";
import { DiscountType } from "../types";

export const discountRulesContext = createContext<{
  conditionLeftOptions: Option[];
  discountType: DiscountType;
  getConditionTypesOptions: (
    type: CatalogConditions | OrderConditions,
  ) => Option[];
  getFetchProps: (type: CatalogConditions | OrderConditions) => FetchOptions;
  setChannel: (channel: string) => void;
} | null>(null);
