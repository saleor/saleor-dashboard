import { type ChannelFragment, type PromotionTypeEnum } from "@dashboard/graphql";
import { type ReactNode } from "react";

import { discountRulesContext } from "./context";

export const DiscountRulesContextProvider = ({
  discountType,
  channels,
  disabled,
  children,
}: {
  children: ReactNode;
  channels: ChannelFragment[];
  discountType: PromotionTypeEnum;
  disabled: boolean;
}) => {
  return (
    <discountRulesContext.Provider
      value={{
        discountType,
        channels,
        disabled,
      }}
    >
      {children}
    </discountRulesContext.Provider>
  );
};
