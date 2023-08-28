import { PageInfoFragment } from "@dashboard/graphql";
import { DocumentNode } from "graphql";
import { useEffect } from "react";

import makeQuery from "./makeQuery";

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
  return (variables: TVariables) => {
    const useQuery = makeQuery<TData, TVariables>(query);

    const result = useQuery({
      displayLoader: true,
      variables,
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
