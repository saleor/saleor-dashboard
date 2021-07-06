import { SearchAttributeValuesVariables } from "@saleor/searches/types/SearchAttributeValues";
import useAttributeValueSearch from "@saleor/searches/useAttributeValueSearch";
import { useEffect, useState } from "react";

interface AttributeValueSearchHandlerState {
  id: string | null;
  query: string;
}

function createAttributeValueSearchHandler(
  variables: SearchAttributeValuesVariables
) {
  const [state, setState] = useState<AttributeValueSearchHandlerState>({
    id: null,
    query: variables.query
  });

  const { loadMore, search, result } = useAttributeValueSearch({
    variables: {
      ...variables,
      ...state
    },
    skip: !state.id
  });

  const handleSearch = (query: string, id: string | null) => {
    if (query !== state.query) {
      search(query);
    }
    if (id !== state.id || query !== state.query) {
      setState({
        query,
        id
      });
    }
  };

  useEffect(() => {
    if (state.id) {
      search("");
    }
  }, [state.id]);
  return {
    loadMore,
    search: handleSearch,
    result
  };
}

export default createAttributeValueSearchHandler;
