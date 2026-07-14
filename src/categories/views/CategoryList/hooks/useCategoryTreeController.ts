import { type ApolloClient } from "@apollo/client";
import { type CategoryFragment } from "@dashboard/graphql";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { serializeExpandedIds } from "../expandedIdsStorage";
import {
  type CategoryChildrenPageResult,
  fetchCategoryChildrenPage,
  readCategoryChildrenPageFromCache,
} from "../services/categoryChildrenQueries";
import { type CategoryListRow } from "../types";
import { buildDepthByCategoryId, buildVisibleRows } from "../utils/categoryTree";

interface ChildrenPaginationState {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface UseCategoryTreeControllerArgs {
  client: ApolloClient<object>;
  categories: CategoryFragment[];
  locationPathname: string;
  clearRowSelection: () => void;
  storedExpandedIds: string[];
  setStoredExpandedIds: (ids: string[]) => void;
}

interface UseCategoryTreeController {
  visibleRows: CategoryListRow[];
  hasExpandedSubcategories: boolean;
  isCategoryExpanded: (categoryId: string) => boolean;
  isCategoryChildrenLoading: (categoryId: string) => boolean;
  isLoadingMoreSubcategories: (parentId: string) => boolean;
  getCategoryDepth: (categoryId: string) => number;
  toggleExpanded: (categoryId: string) => Promise<void>;
  loadMoreSubcategories: (parentId: string) => Promise<void>;
  handleCollapseAllSubcategories: () => void;
  getCachedChildrenByParentId: (parentId: string) => CategoryFragment[];
  refreshParentChildren: (parentIds: string[]) => Promise<void>;
  pruneTreeStateAfterDelete: (
    deletedIdsWithDescendants: Set<string>,
    parentIdsToInvalidate: Set<string>,
  ) => void;
}

export const useCategoryTreeController = ({
  client,
  categories,
  locationPathname,
  clearRowSelection,
  storedExpandedIds,
  setStoredExpandedIds,
}: UseCategoryTreeControllerArgs): UseCategoryTreeController => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(storedExpandedIds));
  const [loadingChildrenIds, setLoadingChildrenIds] = useState<Set<string>>(() => new Set());
  const [loadedChildrenIds, setLoadedChildrenIds] = useState<Set<string>>(() => new Set());
  const [childrenByParentId, setChildrenByParentId] = useState<Record<string, CategoryFragment[]>>(
    {},
  );
  const [childrenPaginationByParentId, setChildrenPaginationByParentId] = useState<
    Record<string, ChildrenPaginationState>
  >({});
  const hasRestoredExpandedIdsRef = useRef(false);

  const setCategoryChildrenLoading = useCallback((categoryId: string, loading: boolean): void => {
    setLoadingChildrenIds(prev => {
      const next = new Set(prev);

      if (loading) {
        next.add(categoryId);
      } else {
        next.delete(categoryId);
      }

      return next;
    });
  }, []);

  const storeChildrenPage = useCallback(
    (parentId: string, page: CategoryChildrenPageResult, append = false): void => {
      setChildrenByParentId(prev => ({
        ...prev,
        [parentId]: append ? [...(prev[parentId] ?? []), ...page.children] : page.children,
      }));
      setChildrenPaginationByParentId(prev => ({
        ...prev,
        [parentId]: {
          hasNextPage: page.hasNextPage,
          endCursor: page.endCursor,
        },
      }));
      setLoadedChildrenIds(prev => {
        const next = new Set(prev);

        next.add(parentId);

        return next;
      });
    },
    [],
  );

  const getCachedChildrenByParentId = useCallback(
    (parentId: string): CategoryFragment[] => childrenByParentId[parentId] ?? [],
    [childrenByParentId],
  );

  const hasMoreChildren = useCallback(
    (parentId: string): boolean => childrenPaginationByParentId[parentId]?.hasNextPage ?? false,
    [childrenPaginationByParentId],
  );

  const getRemainingChildrenCount = useCallback(
    (parentId: string, parentCategory: CategoryFragment): number => {
      const loadedCount = childrenByParentId[parentId]?.length ?? 0;
      const totalCount = parentCategory.children?.totalCount ?? loadedCount;

      return Math.max(totalCount - loadedCount, 0);
    },
    [childrenByParentId],
  );

  const fetchAndStoreChildrenPage = useCallback(
    async (
      parentId: string,
      after: string | null = null,
      append = false,
    ): Promise<CategoryChildrenPageResult | undefined> => {
      const cachedPage = readCategoryChildrenPageFromCache(client, parentId, after);

      if (cachedPage) {
        storeChildrenPage(parentId, cachedPage, append);
      }

      setCategoryChildrenLoading(parentId, true);

      try {
        const page = await fetchCategoryChildrenPage(client, parentId, after);

        if (page) {
          storeChildrenPage(parentId, page, append);

          return page;
        }

        return cachedPage ?? undefined;
      } catch {
        return cachedPage ?? undefined;
      } finally {
        setCategoryChildrenLoading(parentId, false);
      }
    },
    [client, setCategoryChildrenLoading, storeChildrenPage],
  );

  useEffect(() => {
    setLoadedChildrenIds(new Set());
    setLoadingChildrenIds(new Set());
    setChildrenByParentId({});
    setChildrenPaginationByParentId({});
    clearRowSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPathname]);

  useEffect(() => {
    const serializedExpandedIds = serializeExpandedIds(expandedIds);

    if (!isEqual(serializedExpandedIds, storedExpandedIds)) {
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent
      setStoredExpandedIds(serializedExpandedIds);
    }
  }, [expandedIds, setStoredExpandedIds, storedExpandedIds]);

  /* eslint-disable react-you-might-not-need-an-effect/no-event-handler */
  useEffect(() => {
    if (hasRestoredExpandedIdsRef.current) {
      return;
    }

    hasRestoredExpandedIdsRef.current = true;

    const idsToRestore = [...expandedIds];

    if (idsToRestore.length === 0) {
      return;
    }

    void Promise.allSettled(
      idsToRestore.map(async categoryId => {
        if (loadingChildrenIds.has(categoryId)) {
          return;
        }

        const page = await fetchAndStoreChildrenPage(categoryId);

        if (!page) {
          setExpandedIds(prev => {
            const next = new Set(prev);

            next.delete(categoryId);

            return next;
          });
        }
      }),
    );
  }, [expandedIds, fetchAndStoreChildrenPage, loadingChildrenIds]);
  /* eslint-enable react-you-might-not-need-an-effect/no-event-handler */

  const toggleExpanded = useCallback(
    async (categoryId: string): Promise<void> => {
      const isExpanded = expandedIds.has(categoryId);

      if (isExpanded) {
        setExpandedIds(prev => {
          const next = new Set(prev);

          next.delete(categoryId);

          return next;
        });

        return;
      }

      if (!loadedChildrenIds.has(categoryId) && !loadingChildrenIds.has(categoryId)) {
        const page = await fetchAndStoreChildrenPage(categoryId);

        if (!page) {
          return;
        }
      }

      setExpandedIds(prev => {
        const next = new Set(prev);

        next.add(categoryId);

        return next;
      });
    },
    [expandedIds, fetchAndStoreChildrenPage, loadedChildrenIds, loadingChildrenIds],
  );

  const loadMoreSubcategories = useCallback(
    async (parentId: string): Promise<void> => {
      const pagination = childrenPaginationByParentId[parentId];

      if (
        !pagination?.hasNextPage ||
        (loadingChildrenIds.has(parentId) && loadedChildrenIds.has(parentId))
      ) {
        return;
      }

      await fetchAndStoreChildrenPage(parentId, pagination.endCursor, true);
    },
    [
      childrenPaginationByParentId,
      fetchAndStoreChildrenPage,
      loadedChildrenIds,
      loadingChildrenIds,
    ],
  );

  const refreshParentChildrenHandler = useCallback(
    async (parentIds: string[]): Promise<void> => {
      await Promise.allSettled(
        parentIds.map(async parentId => {
          await fetchAndStoreChildrenPage(parentId);
        }),
      );
    },
    [fetchAndStoreChildrenPage],
  );

  const handleCollapseAllSubcategories = useCallback((): void => {
    setExpandedIds(new Set());
    setLoadingChildrenIds(new Set());
    clearRowSelection();
  }, [clearRowSelection]);

  const visibleRows = useMemo(
    () =>
      buildVisibleRows(categories, expandedIds, getCachedChildrenByParentId, {
        hasMoreChildren,
        getRemainingChildrenCount,
      }),
    [
      categories,
      expandedIds,
      getCachedChildrenByParentId,
      getRemainingChildrenCount,
      hasMoreChildren,
    ],
  );

  const depthByCategoryId = useMemo(() => buildDepthByCategoryId(visibleRows), [visibleRows]);

  const isCategoryExpanded = useCallback(
    (categoryId: string): boolean => expandedIds.has(categoryId),
    [expandedIds],
  );
  const isCategoryChildrenLoading = useCallback(
    (categoryId: string): boolean =>
      loadingChildrenIds.has(categoryId) && !loadedChildrenIds.has(categoryId),
    [loadedChildrenIds, loadingChildrenIds],
  );
  const isLoadingMoreSubcategories = useCallback(
    (parentId: string): boolean =>
      loadingChildrenIds.has(parentId) && loadedChildrenIds.has(parentId),
    [loadedChildrenIds, loadingChildrenIds],
  );
  const getCategoryDepth = useCallback(
    (categoryId: string): number => depthByCategoryId[categoryId] ?? 0,
    [depthByCategoryId],
  );

  const pruneTreeStateAfterDelete = useCallback(
    (deletedIdsWithDescendants: Set<string>, parentIdsToInvalidate: Set<string>): void => {
      setExpandedIds(prev => {
        const next = new Set(prev);

        deletedIdsWithDescendants.forEach(id => next.delete(id));

        return next;
      });

      setLoadingChildrenIds(prev => {
        const next = new Set(prev);

        deletedIdsWithDescendants.forEach(id => next.delete(id));

        return next;
      });

      setLoadedChildrenIds(prev => {
        const next = new Set(prev);

        deletedIdsWithDescendants.forEach(id => next.delete(id));
        parentIdsToInvalidate.forEach(id => next.delete(id));

        return next;
      });

      setChildrenByParentId(prev => {
        const next = { ...prev };

        deletedIdsWithDescendants.forEach(id => {
          delete next[id];
        });
        parentIdsToInvalidate.forEach(id => {
          delete next[id];
        });

        return next;
      });

      setChildrenPaginationByParentId(prev => {
        const next = { ...prev };

        deletedIdsWithDescendants.forEach(id => {
          delete next[id];
        });
        parentIdsToInvalidate.forEach(id => {
          delete next[id];
        });

        return next;
      });
    },
    [],
  );

  return {
    visibleRows,
    hasExpandedSubcategories: expandedIds.size > 0,
    isCategoryExpanded,
    isCategoryChildrenLoading,
    isLoadingMoreSubcategories,
    getCategoryDepth,
    toggleExpanded,
    loadMoreSubcategories,
    handleCollapseAllSubcategories,
    getCachedChildrenByParentId,
    refreshParentChildren: refreshParentChildrenHandler,
    pruneTreeStateAfterDelete,
  };
};
