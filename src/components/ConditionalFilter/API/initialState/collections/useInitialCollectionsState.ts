import { useApolloClient } from "@apollo/client";
import { CollectionFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetChannelOperandsDocument,
  _GetChannelOperandsQuery,
  _GetChannelOperandsQueryVariables,
  CollectionPublished,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { EnumValuesHandler } from "../../Handler";
import { createInitialCollectionState } from "../helpers";
import { InitialCollectionAPIResponse } from "../types";
import { InitialCollectionStateResponse } from "./InitialCollectionState";

export interface InitialCollectionAPIState {
  data: InitialCollectionStateResponse;
  loading: boolean;
  fetchQueries: (params: CollectionFetchingParams) => Promise<void>;
}

const mapToOptions = (data: string[], type: "ids" | "slugs") =>
  data.map(el => ({
    type,
    label: el,
    value: el,
    slug: el,
  }));

export const useInitialCollectionState = (): InitialCollectionAPIState => {
  const client = useApolloClient();
  const intl = useIntl();

  const [data, setData] = useState<InitialCollectionStateResponse>(
    InitialCollectionStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const queriesToRun: Array<Promise<InitialCollectionAPIResponse>> = [];

  const fetchQueries = async ({ channel, ids, slugs }: CollectionFetchingParams) => {
    if (channel?.length > 0) {
      queriesToRun.push(
        client.query<_GetChannelOperandsQuery, _GetChannelOperandsQueryVariables>({
          query: _GetChannelOperandsDocument,
        }),
      );
    }

    const publishedInit = new EnumValuesHandler(CollectionPublished, "published", intl);

    const data = await Promise.all(queriesToRun);
    const initialState = {
      ...createInitialCollectionState(data, channel),
      published: await publishedInit.fetch(),
      slugs: mapToOptions(slugs, "slugs"),
      ids: mapToOptions(ids, "ids"),
    };

    setData(
      new InitialCollectionStateResponse(
        initialState.channel,
        initialState.published,
        initialState.ids,
        initialState.metadata,
        initialState.slugs,
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
