import { useApolloClient } from "@apollo/client";
import { createInitialCustomerState } from "@dashboard/components/ConditionalFilter/API/initialState/helpers";
import { type InitialCustomerAPIResponse } from "@dashboard/components/ConditionalFilter/API/initialState/types";
import { type CustomerFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _SearchCustomerTypesOperandsDocument,
  type _SearchCustomerTypesOperandsQuery,
  type _SearchCustomerTypesOperandsQueryVariables,
} from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";

import { loadAttributeFilterState } from "../loadAttributeFilterState";
import { InitialCustomerStateResponse } from "./InitialCustomerState";

export interface InitialCustomerAPIState {
  data: InitialCustomerStateResponse;
  loading: boolean;
  fetchQueries: (params: CustomerFetchingParams) => Promise<void>;
}

export const useInitialCustomerState = (): InitialCustomerAPIState => {
  const client = useApolloClient();
  const notify = useNotifier();
  const intl = useIntl();
  const [data, setData] = useState<InitialCustomerStateResponse>(
    InitialCustomerStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const fetchQueries = useCallback(
    async ({ customerType, attribute, attributeReference }: CustomerFetchingParams) => {
      setLoading(true);

      try {
        const queriesToRun: Array<Promise<InitialCustomerAPIResponse>> = [];

        if (customerType.length > 0) {
          queriesToRun.push(
            client.query<
              _SearchCustomerTypesOperandsQuery,
              _SearchCustomerTypesOperandsQueryVariables
            >({
              query: _SearchCustomerTypesOperandsDocument,
              variables: {
                first: Math.max(customerType.length, 1),
                customerTypesSlugs: customerType,
              },
            }),
          );
        }

        const [queryResults, attributeMap] = await Promise.all([
          Promise.all(queriesToRun),
          loadAttributeFilterState(client, attribute, attributeReference),
        ]);
        const initialState = createInitialCustomerState(queryResults);

        setData(new InitialCustomerStateResponse(initialState.customerType, attributeMap));
      } catch (error) {
        console.error("Failed to fetch customer filter initial data:", error);
        notify({
          status: "error",
          text: intl.formatMessage({
            id: "aHIrs/",
            defaultMessage: "Failed to load filter data. Please refresh page to try again.",
          }),
        });
      } finally {
        setLoading(false);
      }
    },
    [client, intl, notify],
  );

  return {
    data,
    loading,
    fetchQueries,
  };
};
