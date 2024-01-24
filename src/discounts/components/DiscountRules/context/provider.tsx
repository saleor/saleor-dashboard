import { PromotionTypeEnum } from "@dashboard/graphql";
import React, { ReactNode } from "react";

import { useConditionNameOptions } from "../hooks/useConditionNameOptions";
import { useCondtionTypes } from "../hooks/useConditionTypes";
import { useCondtionValuesOptions } from "../hooks/useCondtionValues";
import { discountRulesContext } from "./context";

export const DiscountRulesContextProvider = ({
  discountType,
  children,
}: {
  children: ReactNode;
  discountType: PromotionTypeEnum;
}) => {
  const [channel, setChannel] = React.useState<string | null>(null);

  const { conditionNameOptions, getConditionNameOptionByValue } =
    useConditionNameOptions(discountType);

  const { getConditionTypesOptions, getConditionTypeByLabel } =
    useCondtionTypes();

  const { getConditionValuesFetchProps } = useCondtionValuesOptions(channel);

  return (
    <discountRulesContext.Provider
      value={{
        discountType,
        conditionNameOptions,
        getConditionTypesOptions,
        getConditionTypeByLabel,
        getConditionNameOptionByValue,
        getConditionValuesFetchProps,
        setChannel,
      }}
    >
      {children}
    </discountRulesContext.Provider>
  );
};
