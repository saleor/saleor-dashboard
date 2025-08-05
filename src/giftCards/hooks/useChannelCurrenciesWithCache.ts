import { useApolloClient } from "@apollo/client";
import {
  ChannelCurrenciesDocument,
  ChannelCurrenciesQuery,
  ChannelCurrenciesQueryVariables,
  useChannelCurrenciesQuery,
} from "@dashboard/graphql";
import { useMemo } from "react";

/**
 * Custom hook that uses useChannelCurrenciesQuery only if the data isn't already in cache.
 * This helps avoid unnecessary network requests when the channel currencies data is already available.
 */
export function useChannelCurrenciesWithCache() {
  const client = useApolloClient();

  const cachedData = useMemo(() => {
    try {
      return client.readQuery<ChannelCurrenciesQuery, ChannelCurrenciesQueryVariables>({
        query: ChannelCurrenciesDocument,
        variables: {},
      });
    } catch {
      // Query not in cache or cache miss
      return null;
    }
  }, [client]);

  const shouldSkip = cachedData !== null;

  const queryResult = useChannelCurrenciesQuery({
    skip: shouldSkip,
  });

  if (shouldSkip && cachedData) {
    return {
      loadingChannelCurrencies: false,
      channelCurrencies: cachedData.shop.channelCurrencies,
    };
  }

  return {
    loadingChannelCurrencies: queryResult.loading,
    channelCurrencies: queryResult.data?.shop.channelCurrencies ?? [],
  };
}
