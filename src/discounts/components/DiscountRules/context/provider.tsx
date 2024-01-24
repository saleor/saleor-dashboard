import { PromotionTypeEnum } from "@dashboard/graphql";
import React, { ReactNode } from "react";

import { useConditionLeftOptions } from "../hooks/useConditionLeftOptions";
import { useCondtionTypes } from "../hooks/useConditionTypes";
import { useCondtionRightOptions } from "../hooks/useCondtionRightOptions";
import { discountRulesContext } from "./context";

export const DiscountRulesContextProvider = ({
  discountType,
  children,
}: {
  children: ReactNode;
  discountType: PromotionTypeEnum;
}) => {
  const [channel, setChannel] = React.useState<string | null>(null);

  const { options: conditionLeftOptions, getConditionByValue } =
    useConditionLeftOptions(discountType);

  const { getConditionTypesOptions, getConditionInputTypeByLabel } =
    useCondtionTypes();

  const { getFetchProps } = useCondtionRightOptions(channel);

  return (
    <discountRulesContext.Provider
      value={{
        conditionLeftOptions,
        discountType,
        getConditionTypesOptions,
        getConditionInputTypeByLabel,
        getConditionByValue,
        getFetchProps,
        setChannel,
      }}
    >
      {children}
    </discountRulesContext.Provider>
  );
};
