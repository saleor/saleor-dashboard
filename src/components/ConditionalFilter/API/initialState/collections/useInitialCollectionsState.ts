import { useApolloClient } from "@apollo/client";
import { CollectionFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
} from "@dashboard/graphql";
import { useState } from "react";

import { createInitialCollectionState } from "../helpers";
import { InitialCollectionAPIResponse } from "../types";
import { InitialCollectionStateResponse } from "./InitialCollectionState";

export interface InitialCollectionAPIState {
  data: InitialCollectionStateResponse;
  loading: boolean;
  fetchQueries: (params: CollectionFetchingParams) => Promise<void>;
}

export const useInitialCollectionState = (): InitialCollectionAPIState => {
  const client = useApolloClient();

  const [data, setData] = useState<InitialCollectionStateResponse>(
    InitialCollectionStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const queriesToRun: Array<Promise<InitialCollectionAPIResponse>> = [];

  const fetchQueries = async ({ channel }: CollectionFetchingParams) => {
    if (channel?.length > 0) {
      queriesToRun.push(
        client.query<_GetLegacyChannelOperandsQuery, _GetLegacyChannelOperandsQueryVariables>({
          query: _GetLegacyChannelOperandsDocument,
        }),
      );
    }

    if (queriesToRun.length === 0) {
      setLoading(false);

      return;
    }

    const data = await Promise.all(queriesToRun);

    const initialState = createInitialCollectionState(data, channel);

    const collectionResponse = new InitialCollectionStateResponse(initialState.channel);

    setData(collectionResponse);
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
