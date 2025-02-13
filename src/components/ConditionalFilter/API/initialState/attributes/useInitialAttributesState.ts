import { useApolloClient } from "@apollo/client";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
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

  const fetchQueries = async ({ channels, attributeTypes }: AttributesFetchingParams) => {
    if (channels.length > 0) {
      queriesToRun.push(
        client.query<_GetLegacyChannelOperandsQuery, _GetLegacyChannelOperandsQueryVariables>({
          query: _GetLegacyChannelOperandsDocument,
        }),
      );
    }

    const attributeTypeInit = new EnumValuesHandler(
      AttributeTypeEnum,
      "attributeType",
      intl,
      attributeTypes,
    );

    const data = await Promise.all(queriesToRun);

    const initialState = {
      ...createInitialAttributeState(data),
      attributeTypes: await attributeTypeInit.fetch(),
    };

    setData(new InitialAttributesStateResponse(initialState.channels, initialState.attributeTypes));
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
