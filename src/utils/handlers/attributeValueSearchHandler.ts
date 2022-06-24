import {
  SearchAttributeValuesQuery,
  SearchAttributeValuesQueryVariables,
} from "@saleor/graphql";
import { UseSearchResult } from "@saleor/hooks/makeSearch";
import useAttributeValueSearch from "@saleor/searches/useAttributeValueSearch";
import { useEffect, useState } from "react";

interface AttributeValueSearchHandlerState {
  id: string | null;
  query: string;
}

export interface UseAttributeValueSearchHandler
  extends Omit<
    UseSearchResult<
      SearchAttributeValuesQuery,
      SearchAttributeValuesQueryVariables
    >,
    "search"
  > {
  reset: () => void;
  search: (query: string, id: string | null) => void;
}

function useAttributeValueSearchHandler(
  variables: SearchAttributeValuesQueryVariables,
): UseAttributeValueSearchHandler {
  const [state, setState] = useState<AttributeValueSearchHandlerState>({
    id: null,
    query: variables.query,
  });

  const { loadMore, search, result } = useAttributeValueSearch({
    variables: {
      ...variables,
      ...state,
    },
    skip: !state.id,
  });

  const handleSearch = (query: string, id: string | null) => {
    if (query !== state.query) {
      search(query);
    }
    if (id !== state.id || query !== state.query) {
      setState({
        query,
        id,
      });
    }
  };

  const reset = () => setState(prevState => ({ ...prevState, id: null }));

  useEffect(() => {
    if (state.id) {
      search("");
    }
  }, [state.id]);

  return {
    query: state.query,
    loadMore,
    search: handleSearch,
    reset,
    result: state.id
      ? result
      : {
          ...result,
          data: undefined,
        },
  };
}

export default useAttributeValueSearchHandler;
