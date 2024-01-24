import { PromotionTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import { createContext, Dispatch, SetStateAction } from "react";

import { FetchOptions } from "../hooks/useCondtionValues";

export const discountRulesContext = createContext<{
  discountType: PromotionTypeEnum;
  conditionNameOptions: Option[];
  getConditionTypesOptions: (type: string) => Option[];
  getConditionTypeByLabel: (name: string, type: string) => string | null;
  getConditionValuesFetchProps: (type: string) => FetchOptions;
  getConditionNameOptionByValue: (value: string) => Option | undefined;
  setChannel: Dispatch<SetStateAction<string | null>>;
} | null>(null);
