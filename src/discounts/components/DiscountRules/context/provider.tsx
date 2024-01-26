import { ChannelFragment, PromotionTypeEnum } from "@dashboard/graphql";
import React, { ReactNode } from "react";

import { useConditionNameOptions } from "../hooks/useConditionNameOptions";
import { useCondtionTypes } from "../hooks/useConditionTypes";
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
  const { conditionNameOptions, getConditionNameOptionByValue } =
    useConditionNameOptions(discountType);

  const { getConditionTypesOptions, getConditionTypeByLabel } =
    useCondtionTypes();

  return (
    <discountRulesContext.Provider
      value={{
        discountType,
        channels,
        conditionNameOptions,
        getConditionTypesOptions,
        getConditionTypeByLabel,
        getConditionNameOptionByValue,
      }}
    >
      {children}
    </discountRulesContext.Provider>
  );
};
