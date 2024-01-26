import { ChannelFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { createContext } from "react";

export const discountRulesContext = createContext<{
  channels: ChannelFragment[];
  discountType: PromotionTypeEnum;
  disabled: boolean;
} | null>(null);
