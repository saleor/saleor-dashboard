// @ts-strict-ignore
import { useCallback, useEffect, useState } from "react";

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
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
  // Must be stable: callers put this in effect deps (e.g. reset-on-id-change).
  // A new function every render + setState({}) in that effect = render loop,
  // which starves Glide's scroll paints and makes horizontal scrolling jump.
  const setPaginationState = useCallback(
    (paginationState: PaginationState) => {
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
        setState(prev =>
          prev.after === undefined &&
          prev.before === undefined &&
          prev.first === paginateBy &&
          prev.last === undefined
            ? prev
            : { first: paginateBy },
        );
      }
    },
    [paginateBy],
  );

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
  const [paginationState, setPaginationState] = useLocalPaginationState(paginateBy);
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

export interface LocalPagination {
  loadNextPage: () => void;
  loadPreviousPage: () => void;
  paginatorType: "click";
  pageInfo?: PageInfo;
}

function useLocalPaginator(setPaginationState: (paginationState: PaginationState) => void) {
  function paginate(
    pageInfo: PageInfo | undefined,
    paginationState: PaginationState,
  ): LocalPagination {
    const loadNextPage = () =>
      setPaginationState({
        ...paginationState,
        after: pageInfo?.endCursor,
        before: undefined,
      });
    const loadPreviousPage = () =>
      setPaginationState({
        ...paginationState,
        after: undefined,
        before: pageInfo?.startCursor,
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
