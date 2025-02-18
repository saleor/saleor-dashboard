import { useApolloClient } from "@apollo/client";
import {
  _GetChannelOperandsDocument,
  _GetChannelOperandsQuery,
  _GetChannelOperandsQueryVariables,
  AttributeTypeEnum,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { AttributesFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { EnumValuesHandler } from "../../Handler";
import { createInitialAttributeState } from "../helpers";
import { InitialAttributesAPIResponse } from "../types";
import { InitialAttributesStateResponse } from "./InitialAttributesState";

export interface InitialAttributesAPIState {
  data: InitialAttributesStateResponse;
  loading: boolean;
  fetchQueries: (params: AttributesFetchingParams) => Promise<void>;
}

export const useInitialAttributesState = (): InitialAttributesAPIState => {
  const client = useApolloClient();
  const intl = useIntl();
  const [data, setData] = useState<InitialAttributesStateResponse>(
    InitialAttributesStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const queriesToRun: Array<Promise<InitialAttributesAPIResponse>> = [];

  const fetchQueries = async ({ channel, attributeType }: AttributesFetchingParams) => {
    if (channel.length > 0) {
      queriesToRun.push(
        client.query<_GetChannelOperandsQuery, _GetChannelOperandsQueryVariables>({
          query: _GetChannelOperandsDocument,
        }),
      );
    }

    const attributeTypeInit = new EnumValuesHandler(
      AttributeTypeEnum,
      "attributeType",
      intl,
      attributeType,
    );

    const data = await Promise.all(queriesToRun);

    const initialState = {
      ...createInitialAttributeState(data),
      attributeType: await attributeTypeInit.fetch(),
    };

    setData(
      new InitialAttributesStateResponse(
        initialState.channels,
        initialState.attributeType,
        initialState.filterableInStorefront,
        initialState.isVariantOnly,
        initialState.valueRequired,
        initialState.visibleInStorefront,
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
