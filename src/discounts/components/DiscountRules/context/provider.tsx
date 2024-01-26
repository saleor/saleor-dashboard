import { ChannelFragment, PromotionTypeEnum } from "@dashboard/graphql";
import React, { ReactNode } from "react";

import { discountRulesContext } from "./context";

export const DiscountRulesContextProvider = ({
  discountType,
  channels,
  children,
}: {
  children: ReactNode;
  channels: ChannelFragment[];
  discountType: PromotionTypeEnum;
}) => {
  return (
    <discountRulesContext.Provider
      value={{
        discountType,
        channels,
      }}
    >
      {children}
    </discountRulesContext.Provider>
  );
};
