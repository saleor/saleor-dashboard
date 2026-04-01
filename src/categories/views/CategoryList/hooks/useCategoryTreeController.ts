import { type ApolloClient } from "@apollo/client";
import { type CategoryFragment } from "@dashboard/graphql";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { serializeExpandedIds } from "../expandedIdsStorage";
import {
  fetchCategoryChildrenNetworkOnly,
  readCategoryChildrenFromCache,
} from "../services/categoryChildrenQueries";
import { type CategoryListRow } from "../types";
import { buildDepthByCategoryId, buildVisibleRows } from "../utils/categoryTree";

const DEFAULT_SUBCATEGORIES_PAGE_SIZE = 50;
const MIN_SUBCATEGORIES_PAGE_SIZE = 1;
const MAX_SUBCATEGORIES_PAGE_SIZE = 200;

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
  visibleCategories: CategoryFragment[];
  subcategoryPageSize: number;
  hasExpandedSubcategories: boolean;
  isCategoryExpanded: (categoryId: string) => boolean;
  isCategoryChildrenLoading: (categoryId: string) => boolean;
  getCategoryDepth: (categoryId: string) => number;
  toggleExpanded: (categoryId: string) => Promise<void>;
  handleSubcategoryPageSizeChange: (nextPageSize: number) => void;
  handleCollapseAllSubcategories: () => void;
  getCachedChildrenByParentId: (parentId: string) => CategoryFragment[];
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
  const [subcategoryPageSize, setSubcategoryPageSize] = useState(DEFAULT_SUBCATEGORIES_PAGE_SIZE);
  const hasRestoredExpandedIdsRef = useRef(false);

  const getCachedChildrenByParentId = useCallback(
    (parentId: string): CategoryFragment[] =>
      readCategoryChildrenFromCache(client, parentId, subcategoryPageSize),
    [client, subcategoryPageSize],
  );

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

  useEffect(() => {
    setLoadedChildrenIds(new Set());
    setLoadingChildrenIds(new Set());
    clearRowSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPathname]);

  const handleSubcategoryPageSizeChange = useCallback(
    (nextPageSize: number): void => {
      const normalizedPageSize = Math.min(
        MAX_SUBCATEGORIES_PAGE_SIZE,
        Math.max(MIN_SUBCATEGORIES_PAGE_SIZE, nextPageSize),
      );

      if (normalizedPageSize === subcategoryPageSize) {
        return;
      }

      setSubcategoryPageSize(normalizedPageSize);
      setLoadedChildrenIds(new Set());
      setExpandedIds(new Set());
      setLoadingChildrenIds(new Set());
      clearRowSelection();
    },
    [clearRowSelection, subcategoryPageSize],
  );

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

        setCategoryChildrenLoading(categoryId, true);

        try {
          const response = await fetchCategoryChildrenNetworkOnly(
            client,
            categoryId,
            subcategoryPageSize,
          );

          if (!response?.category) {
            setExpandedIds(prev => {
              const next = new Set(prev);

              next.delete(categoryId);

              return next;
            });

            return;
          }

          setLoadedChildrenIds(prev => {
            const next = new Set(prev);

            next.add(categoryId);

            return next;
          });
        } catch {
          setExpandedIds(prev => {
            const next = new Set(prev);

            next.delete(categoryId);

            return next;
          });
        } finally {
          setCategoryChildrenLoading(categoryId, false);
        }
      }),
    );
  }, [client, expandedIds, loadingChildrenIds, setCategoryChildrenLoading, subcategoryPageSize]);
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
        setCategoryChildrenLoading(categoryId, true);

        let hasCachedData = false;

        try {
          const cachedChildren = readCategoryChildrenFromCache(
            client,
            categoryId,
            subcategoryPageSize,
          );

          if (cachedChildren.length > 0) {
            setLoadedChildrenIds(prev => {
              const next = new Set(prev);

              next.add(categoryId);

              return next;
            });
            hasCachedData = true;
          }

          try {
            await fetchCategoryChildrenNetworkOnly(client, categoryId, subcategoryPageSize);

            setLoadedChildrenIds(prev => {
              const next = new Set(prev);

              next.add(categoryId);

              return next;
            });
          } catch (networkError) {
            if (!hasCachedData) {
              throw networkError;
            }
          }
        } catch {
          // noop
        } finally {
          setCategoryChildrenLoading(categoryId, false);
        }
      }

      setExpandedIds(prev => {
        const next = new Set(prev);

        next.add(categoryId);

        return next;
      });
    },
    [
      expandedIds,
      loadedChildrenIds,
      loadingChildrenIds,
      client,
      subcategoryPageSize,
      setCategoryChildrenLoading,
    ],
  );

  const handleCollapseAllSubcategories = useCallback((): void => {
    setExpandedIds(new Set());
    setLoadingChildrenIds(new Set());
    clearRowSelection();
  }, [clearRowSelection]);

  const visibleRows = useMemo(
    () => buildVisibleRows(categories, expandedIds, getCachedChildrenByParentId),
    [categories, expandedIds, getCachedChildrenByParentId],
  );
  const visibleCategories = useMemo(() => visibleRows.map(row => row.category), [visibleRows]);
  const depthByCategoryId = useMemo(() => buildDepthByCategoryId(visibleRows), [visibleRows]);

  const isCategoryExpanded = useCallback(
    (categoryId: string): boolean => expandedIds.has(categoryId),
    [expandedIds],
  );
  const isCategoryChildrenLoading = useCallback(
    (categoryId: string): boolean => loadingChildrenIds.has(categoryId),
    [loadingChildrenIds],
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
    },
    [],
  );

  return {
    visibleRows,
    visibleCategories,
    subcategoryPageSize,
    hasExpandedSubcategories: expandedIds.size > 0,
    isCategoryExpanded,
    isCategoryChildrenLoading,
    getCategoryDepth,
    toggleExpanded,
    handleSubcategoryPageSizeChange,
    handleCollapseAllSubcategories,
    getCachedChildrenByParentId,
    pruneTreeStateAfterDelete,
  };
};
