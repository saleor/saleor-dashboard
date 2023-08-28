import { DocumentNode } from "graphql";
import { useEffect } from "react";

import makeQuery from "./makeQuery";

export function makeFetchAll<TData, TVariables>(
  query: DocumentNode,
  accessKey: string,
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
        const nextPage = result.data[accessKey]?.pageInfo?.hasNextPage;
        const after = result.data[accessKey]?.pageInfo?.endCursor;

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
