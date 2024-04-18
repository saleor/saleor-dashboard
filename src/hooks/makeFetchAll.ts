import { PageInfoFragment } from "@dashboard/graphql";
import { DocumentNode } from "graphql";
import { useEffect } from "react";

import makeQuery from "./makeQuery";

interface QueryHookOptions<TVariables> {
  skip?: boolean;
  variables?: TVariables;
  displayLoader?: boolean;
}

export function makeFetchAll<TData, TVariables>(
  query: DocumentNode,
  accessKey: keyof TData,
  mergeFn: (
    previousQueryResult: TData,
    options: {
      fetchMoreResult?: TData;
    },
  ) => TData,
) {
  return (opts: QueryHookOptions<TVariables>) => {
    const useQuery = makeQuery<TData, TVariables>(query);
    const result = useQuery({
      ...opts,
    });
    useEffect(() => {
      if (result.data) {
        const data = result.data[accessKey] as { pageInfo?: PageInfoFragment };
        const nextPage = data?.pageInfo?.hasNextPage;
        const after = data?.pageInfo?.endCursor;

        if (nextPage && after !== null) {
          result.fetchMore({
            updateQuery: mergeFn,
            variables: { after },
          });
        }
      }
    }, [result.data]);

    return result;
  };
}
