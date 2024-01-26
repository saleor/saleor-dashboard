import { ChannelFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import { createContext } from "react";

export const discountRulesContext = createContext<{
  channels: ChannelFragment[];
  discountType: PromotionTypeEnum;
  conditionNameOptions: Option[];
  getConditionTypesOptions: (type: string) => Option[];
  getConditionTypeByLabel: (name: string, type: string) => string | null;
  getConditionNameOptionByValue: (value: string) => Option | undefined;
} | null>(null);
