import { useApolloClient } from "@apollo/client";
import { createInitialCustomerState } from "@dashboard/components/ConditionalFilter/API/initialState/helpers";
import { type InitialCustomerAPIResponse } from "@dashboard/components/ConditionalFilter/API/initialState/types";
import { type CustomerFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _SearchCustomerTypesOperandsDocument,
  type _SearchCustomerTypesOperandsQuery,
  type _SearchCustomerTypesOperandsQueryVariables,
} from "@dashboard/graphql";
import { useState } from "react";

import { InitialCustomerStateResponse } from "./InitialCustomerState";

export interface InitialCustomerAPIState {
  data: InitialCustomerStateResponse;
  loading: boolean;
  fetchQueries: (params: CustomerFetchingParams) => Promise<void>;
}

export const useInitialCustomerState = () => {
  const client = useApolloClient();
  const [data, setData] = useState<InitialCustomerStateResponse>(
    InitialCustomerStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);
  const queriesToRun: Array<Promise<InitialCustomerAPIResponse>> = [];

  const fetchQueries = async ({ customerType }: CustomerFetchingParams) => {
    if (customerType.length > 0) {
      queriesToRun.push(
        client.query<_SearchCustomerTypesOperandsQuery, _SearchCustomerTypesOperandsQueryVariables>(
          {
            query: _SearchCustomerTypesOperandsDocument,
            variables: {
              first: Math.max(customerType.length, 1),
              customerTypesSlugs: customerType,
            },
          },
        ),
      );
    }

    const data = await Promise.all(queriesToRun);
    const initialState = createInitialCustomerState(data);

    setData(new InitialCustomerStateResponse(initialState.customerType));
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
