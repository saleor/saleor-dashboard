import { useEffect, useState } from "react";

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}

export interface PaginationState {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
}

export function useLocalPaginationState(
  paginateBy: number
): [PaginationState, (paginationState: PaginationState) => void] {
  const [state, setState] = useState<PaginationState>({
    first: paginateBy
  });

  const setPaginationState = (paginationState: PaginationState) => {
    if (paginationState.after) {
      setState({
        after: paginationState.after,
        first: paginateBy
      });
    } else if (paginationState.before) {
      setState({
        before: paginationState.before,
        last: paginateBy
      });
    } else {
      setState({
        first: paginateBy
      });
    }
  };

  useEffect(() => {
    setPaginationState(state);
  }, [paginateBy]);

  return [state, setPaginationState];
}

function useLocalPaginator(
  setPaginationState: (paginationState: PaginationState) => void
) {
  function paginate(pageInfo: PageInfo, paginationState: PaginationState) {
    const loadNextPage = () =>
      setPaginationState({
        ...paginationState,
        after: pageInfo.endCursor,
        before: undefined
      });

    const loadPreviousPage = () =>
      setPaginationState({
        ...paginationState,
        after: undefined,
        before: pageInfo.startCursor
      });

    const newPageInfo = pageInfo
      ? {
          ...pageInfo,
          hasNextPage: !!paginationState.before || pageInfo.hasNextPage,
          hasPreviousPage: !!paginationState.after || pageInfo.hasPreviousPage
        }
      : undefined;

    return {
      loadNextPage,
      loadPreviousPage,
      pageInfo: newPageInfo
    };
  }
  return paginate;
}
export default useLocalPaginator;
