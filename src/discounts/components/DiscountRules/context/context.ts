import { ChannelFragment, PromotionTypeEnum } from "@dashboard/graphql";
import { createContext } from "react";

export const discountRulesContext = createContext<{
  channels: ChannelFragment[];
  discountType: PromotionTypeEnum;
} | null>(null);
