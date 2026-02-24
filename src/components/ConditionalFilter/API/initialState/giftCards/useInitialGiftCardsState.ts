import { useApolloClient } from "@apollo/client";
import { createInitialGiftCardsState } from "@dashboard/components/ConditionalFilter/API/initialState/helpers";
import { type InitialGiftCardsAPIResponse } from "@dashboard/components/ConditionalFilter/API/initialState/types";
import { type GiftCardsFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _SearchCustomersOperandsDocument,
  type _SearchCustomersOperandsQuery,
  type _SearchCustomersOperandsQueryVariables,
  _SearchProductOperandsDocument,
  type _SearchProductOperandsQuery,
  type _SearchProductOperandsQueryVariables,
  ChannelCurrenciesDocument,
  type ChannelCurrenciesQuery,
  type ChannelCurrenciesQueryVariables,
} from "@dashboard/graphql";
import { useState } from "react";

import { InitialGiftCardsStateResponse } from "./InitialGiftCardsState";

export interface InitialGiftCardsAPIState {
  data: InitialGiftCardsStateResponse;
  loading: boolean;
  fetchQueries: (params: GiftCardsFetchingParams) => Promise<void>;
}

export const useInitialGiftCardsState = () => {
  const client = useApolloClient();
  const [data, setData] = useState<InitialGiftCardsStateResponse>(
    InitialGiftCardsStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);
  const queriesToRun: Array<Promise<InitialGiftCardsAPIResponse>> = [];

  const fetchQueries = async ({ usedBy, products, currency, tags }: GiftCardsFetchingParams) => {
    if (products.length > 0) {
      queriesToRun.push(
        client.query<_SearchProductOperandsQuery, _SearchProductOperandsQueryVariables>({
          query: _SearchProductOperandsDocument,
          variables: {
            first: products.length,
            productSlugs: products,
          },
        }),
      );
    }

    if (usedBy.length > 0) {
      queriesToRun.push(
        client.query<_SearchCustomersOperandsQuery, _SearchCustomersOperandsQueryVariables>({
          query: _SearchCustomersOperandsDocument,
          variables: {
            first: usedBy.length,
            customersIds: usedBy,
          },
        }),
      );
    }

    if (currency.length > 0) {
      queriesToRun.push(
        client.query<ChannelCurrenciesQuery, ChannelCurrenciesQueryVariables>({
          query: ChannelCurrenciesDocument,
          variables: {},
        }),
      );
    }

    const data = await Promise.all(queriesToRun);
    const initialState = createInitialGiftCardsState(data, tags);

    setData(
      new InitialGiftCardsStateResponse(
        initialState.currency,
        initialState.products,
        initialState.isActive,
        initialState.tags,
        initialState.usedBy,
      ),
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
