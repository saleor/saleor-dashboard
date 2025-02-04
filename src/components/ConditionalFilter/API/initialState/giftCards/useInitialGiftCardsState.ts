import { GiftCardsFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import { useState } from "react";

import { InitialGiftCardsStateResponse } from "./InitialGiftCardsState";

export interface InitialGiftCardsAPIState {
  data: InitialGiftCardsStateResponse;
  loading: boolean;
  fetchQueries: (params: GiftCardsFetchingParams) => Promise<void>;
}

export const useInitialGiftCardsState = () => {
  const [data, setData] = useState<InitialGiftCardsStateResponse>(
    InitialGiftCardsStateResponse.empty(),
  );
  const [loading, setLoading] = useState(false);

  const fetchQueries = async (data: GiftCardsFetchingParams) => {
    setData(new InitialGiftCardsStateResponse([], [], [], [], []));
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
