import { useApolloClient } from "@apollo/client";
import { AttributeFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
  AttributeTypeEnum,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { EnumValuesHandler } from "../../Handler";
import { createInitialAttributeState } from "../helpers";
import { InitialOrderAPIResponse } from "../types";
import { InitialAttributeStateResponse } from "./InitialAttirbuteState";

export interface InitialAttributeAPIState {
  data: InitialAttributeStateResponse;
  loading: boolean;
  fetchQueries: (params: AttributeFetchingParams) => Promise<void>;
}

export const useInitialAttributeState = (): InitialAttributeAPIState => {
  const client = useApolloClient();
  const intl = useIntl();
  const [data, setData] = useState<InitialAttributeStateResponse>(
    InitialAttributeStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const queriesToRun: Array<Promise<InitialOrderAPIResponse>> = [];

  const fetchQueries = async ({ channels, attributeTypes }: AttributeFetchingParams) => {
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

    setData(new InitialAttributeStateResponse(initialState.channels, initialState.attributeTypes));
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
