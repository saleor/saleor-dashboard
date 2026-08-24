import {
  type SearchAttributeValuesQuery,
  type SearchAttributeValuesQueryVariables,
} from "@dashboard/graphql";
import { type UseSearchResult } from "@dashboard/hooks/makeSearch";
import useAttributeValueSearch from "@dashboard/searches/useAttributeValueSearch";
import { type FetchMoreProps } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useCallback, useEffect, useRef, useState } from "react";

interface AttributeValueSearchHandlerState {
  id: string | null;
  query: string;
}

export type AttributeValueChoice = NonNullable<
  NonNullable<NonNullable<SearchAttributeValuesQuery["attribute"]>["choices"]>["edges"]
>[number]["node"];

interface UseAttributeValueSearchHandler
  extends Omit<
    UseSearchResult<SearchAttributeValuesQuery, SearchAttributeValuesQueryVariables>,
    "search"
  > {
  getChoices: (attributeId: string) => AttributeValueChoice[];
  getFetchMore: (attributeId: string) => FetchMoreProps;
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
  const [choicesById, setChoicesById] = useState<Record<string, AttributeValueChoice[]>>({});
  const [hasMoreById, setHasMoreById] = useState<Record<string, boolean>>({});
  const lastCacheSignatureRef = useRef<string | null>(null);
  const { loadMore, search, result } = useAttributeValueSearch({
    variables: {
      ...variables,
      ...state,
    },
    skip: !state.id,
  });

  const handleSearch = (query: string, id: string | null) => {
    if (query === "" || query !== state.query) {
      search(query);
    }

    if (id !== state.id || query !== state.query) {
      setState({
        query,
        id,
      });
    }
  };

  const activeAttributeId = state.id;
  const resultAttributeId = result.data?.attribute?.id;
  const cacheSignature =
    activeAttributeId && resultAttributeId === activeAttributeId
      ? `${activeAttributeId}:${state.query}:${result.data?.attribute?.choices?.pageInfo?.endCursor ?? ""}:${result.data?.attribute?.choices?.edges?.length ?? 0}`
      : null;

  // Adjust cache during render when this field's payload changes. Do not use
  // previousData for another attribute — that would leak Color into Size.
  if (activeAttributeId && cacheSignature && cacheSignature !== lastCacheSignatureRef.current) {
    lastCacheSignatureRef.current = cacheSignature;
    setChoicesById(previous => ({
      ...previous,
      [activeAttributeId]: mapEdgesToItems(result.data?.attribute?.choices) ?? [],
    }));
    setHasMoreById(previous => ({
      ...previous,
      [activeAttributeId]: !!result.data?.attribute?.choices?.pageInfo?.hasNextPage,
    }));
  }

  useEffect(
    function searchWhenAttributeChanges() {
      if (state.id) {
        search("");
      }
    },
    [state.id],
  );

  const getChoices = useCallback(
    (attributeId: string): AttributeValueChoice[] => choicesById[attributeId] ?? [],
    [choicesById],
  );

  const getFetchMore = useCallback(
    (attributeId: string): FetchMoreProps => ({
      hasMore: !!hasMoreById[attributeId],
      loading: state.id === attributeId && !!result.loading,
      onFetchMore: loadMore,
    }),
    [hasMoreById, loadMore, result.loading, state.id],
  );

  return {
    getChoices,
    getFetchMore,
    query: state.query,
    loadMore,
    search: handleSearch,
    // Blur must not drop cached choices. Each dropdown reads getChoices(id).
    reset: () => undefined,
    result,
  };
}

export default useAttributeValueSearchHandler;
