import { PromotionTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import { createContext, Dispatch, SetStateAction } from "react";

import { FetchOptions } from "../hooks/useCondtionRightOptions";

export const discountRulesContext = createContext<{
  conditionLeftOptions: Option[];
  discountType: PromotionTypeEnum;
  getConditionTypesOptions: (type: string) => Option[];
  getConditionInputTypeByLabel: (name: string, type: string) => string | null;
  getFetchProps: (type: string) => FetchOptions;
  setChannel: Dispatch<SetStateAction<string | null>>;
} | null>(null);
