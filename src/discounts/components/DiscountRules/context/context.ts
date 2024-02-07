import { ChannelFragment } from "@dashboard/graphql";
import { createContext } from "react";

export const discountRulesContext = createContext<{
  channels: ChannelFragment[];
  discountType: "catalog"; // TODO: to be replace by PromotionTypeEnum
  disabled: boolean;
} | null>(null);
