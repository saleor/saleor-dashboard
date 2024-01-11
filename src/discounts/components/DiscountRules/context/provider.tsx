import React, { ReactNode } from "react";

import { useConditionLeftOptions } from "../hooks/useConditionLeftOptions";
import { useCondtionTypes } from "../hooks/useConditionTypes";
import { useCondtionRightOptions } from "../hooks/useCondtionRightOptions";
import { DiscountType } from "../types";
import { discountRulesContext } from "./context";

export const DiscountRulesContextProvider = ({
  discountType,
  children,
}: {
  children: ReactNode;
  discountType: DiscountType;
}) => {
  const { options: conditionLeftOptions } =
    useConditionLeftOptions(discountType);
  const { getConditionTypesOptions, getConditionInputTypeByLabel } =
    useCondtionTypes();
  const { getFetchProps, setChannel } = useCondtionRightOptions();

  return (
    <discountRulesContext.Provider
      value={{
        conditionLeftOptions,
        discountType,
        getConditionTypesOptions,
        getConditionInputTypeByLabel,
        getFetchProps,
        setChannel,
      }}
    >
      {children}
    </discountRulesContext.Provider>
  );
};
