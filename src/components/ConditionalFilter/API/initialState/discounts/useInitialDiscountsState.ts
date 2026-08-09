import { DiscountStatusEnum, PromotionTypeEnum } from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { type DiscountFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { EnumValuesHandler } from "../../Handler";
import { InitialDiscountsStateResponse } from "./InitialDiscountsState";

export interface InitialDiscountAPIState {
  data: InitialDiscountsStateResponse;
  loading: boolean;
  fetchQueries: (params: DiscountFetchingParams) => Promise<void>;
}

export const useInitialDiscountsState = (): InitialDiscountAPIState => {
  const intl = useIntl();
  const [data, setData] = useState<InitialDiscountsStateResponse>(
    InitialDiscountsStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const fetchQueries = async ({ promotionStatus, promotionType }: DiscountFetchingParams) => {
    const promotionStatusInit = new EnumValuesHandler(
      DiscountStatusEnum,
      "promotionStatus",
      intl,
      promotionStatus,
    );
    const promotionTypeInit = new EnumValuesHandler(
      PromotionTypeEnum,
      "promotionType",
      intl,
      promotionType,
    );

    const initialState = {
      promotionStatus: await promotionStatusInit.fetch(),
      promotionType: await promotionTypeInit.fetch(),
    };

    setData(
      new InitialDiscountsStateResponse(initialState.promotionStatus, initialState.promotionType),
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
