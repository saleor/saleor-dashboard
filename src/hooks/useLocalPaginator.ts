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

/**
 * Local pagination state.
 * @param paginateBy Number of items per page.
 * @returns Pagination state and setter.
 */
export function useLocalPaginationState(
  paginateBy: number,
): [PaginationState, (paginationState: PaginationState) => void] {
  const [state, setState] = useState<PaginationState>({
    first: paginateBy,
  });

  const setPaginationState = (paginationState: PaginationState) => {
    if (paginationState.after) {
      setState({
        after: paginationState.after,
        first: paginateBy,
      });
    } else if (paginationState.before) {
      setState({
        before: paginationState.before,
        last: paginateBy,
      });
    } else {
      setState({
        first: paginateBy,
      });
    }
  };

  useEffect(() => {
    setState({ first: paginateBy });
  }, [paginateBy]);

  return [state, setPaginationState];
}

/**
 * Local pagination state persisted as long as section is not changed.
 * @param paginateBy Number of items per page.
 * @param section Section name. When changed, pagination state is reset.
 * @returns Pagination state and setter.
 */
export function useSectionLocalPaginationState(
  paginateBy: number,
  section: string,
): [PaginationState, (paginationState: PaginationState) => void] {
  const [paginationSection, setPaginationSection] = useState(section);
  const [paginationState, setPaginationState] = useLocalPaginationState(
    paginateBy,
  );

  const fallbackPaginationState = {
    first: paginateBy,
  };

  useEffect(() => {
    if (section !== paginationSection) {
      setPaginationState({});
    }
  }, [section]);

  useEffect(() => {
    if (section !== paginationSection) {
      setPaginationSection(section);
    }
  }, [paginationState]);

  return [
    section === paginationSection ? paginationState : fallbackPaginationState,
    setPaginationState,
  ];
}

function useLocalPaginator(
  setPaginationState: (paginationState: PaginationState) => void,
) {
  function paginate(pageInfo: PageInfo, paginationState: PaginationState) {
    const loadNextPage = () =>
      setPaginationState({
        ...paginationState,
        after: pageInfo.endCursor,
        before: undefined,
      });

    const loadPreviousPage = () =>
      setPaginationState({
        ...paginationState,
        after: undefined,
        before: pageInfo.startCursor,
      });

    const newPageInfo = pageInfo
      ? {
          ...pageInfo,
          hasNextPage: !!paginationState.before || pageInfo.hasNextPage,
          hasPreviousPage: !!paginationState.after || pageInfo.hasPreviousPage,
        }
      : undefined;

    return {
      loadNextPage,
      loadPreviousPage,
      paginatorType: "click" as const,
      pageInfo: newPageInfo,
    };
  }
  return paginate;
}
export default useLocalPaginator;
