import { ChannelFragment } from "@dashboard/graphql";
import React, { ReactNode } from "react";

import { discountRulesContext } from "./context";

export const DiscountRulesContextProvider = ({
  discountType,
  channels,
  disabled,
  children,
}: {
  children: ReactNode;
  channels: ChannelFragment[];
  discountType: "catalog"; // TODO: to be replace by PromotionTypeEnum
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
