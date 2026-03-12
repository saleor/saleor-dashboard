import { type ApolloClient } from "@apollo/client";
import {
  type CategoryBulkDeleteMutation,
  type CategoryFragment,
  useCategoryBulkDeleteMutation,
} from "@dashboard/graphql";
import { useCallback, useRef } from "react";

import { refetchParentChildren } from "../services/categoryChildrenQueries";
import { type CategoryListRow } from "../types";
import { buildParentByCategoryId, collectDescendantIds } from "../utils/categoryTree";

interface UseCategoryBulkDeleteControllerArgs {
  selectedRowIds: string[];
  visibleRows: CategoryListRow[];
  client: ApolloClient<object>;
  subcategoryPageSize: number;
  getCachedChildrenByParentId: (parentId: string) => CategoryFragment[];
  pruneTreeStateAfterDelete: (
    deletedIdsWithDescendants: Set<string>,
    parentIdsToInvalidate: Set<string>,
  ) => void;
  clearRowSelection: () => void;
  refetchRootCategories: () => void;
  navigateToList: () => void;
  notifyDeleted: () => void;
}

interface UseCategoryBulkDeleteController {
  categoryBulkDelete: ReturnType<typeof useCategoryBulkDeleteMutation>[0];
  categoryBulkDeleteOpts: ReturnType<typeof useCategoryBulkDeleteMutation>[1];
  handleCategoryBulkDelete: () => Promise<void>;
}

export const useCategoryBulkDeleteController = ({
  selectedRowIds,
  visibleRows,
  client,
  subcategoryPageSize,
  getCachedChildrenByParentId,
  pruneTreeStateAfterDelete,
  clearRowSelection,
  refetchRootCategories,
  navigateToList,
  notifyDeleted,
}: UseCategoryBulkDeleteControllerArgs): UseCategoryBulkDeleteController => {
  const deletingCategoryIdsRef = useRef<string[]>([]);

  const handleCategoryBulkDeleteOnComplete = useCallback(
    (data: CategoryBulkDeleteMutation): void => {
      if (data?.categoryBulkDelete?.errors.length !== 0) {
        return;
      }

      const deletedIds = new Set(deletingCategoryIdsRef.current);
      const deletedIdsWithDescendants = new Set(deletedIds);

      deletedIds.forEach(deletedId => {
        collectDescendantIds(deletedId, getCachedChildrenByParentId).forEach(descendantId => {
          deletedIdsWithDescendants.add(descendantId);
        });
      });

      const parentByCategoryId = buildParentByCategoryId(visibleRows);
      const parentIdsToInvalidate = new Set<string>();

      deletedIdsWithDescendants.forEach(deletedId => {
        let parentId = parentByCategoryId[deletedId];

        while (parentId) {
          parentIdsToInvalidate.add(parentId);
          parentId = parentByCategoryId[parentId];
        }
      });

      pruneTreeStateAfterDelete(deletedIdsWithDescendants, parentIdsToInvalidate);

      const parentIdsToRefetch = Array.from(parentIdsToInvalidate);

      if (parentIdsToRefetch.length > 0) {
        void refetchParentChildren(client, parentIdsToRefetch, subcategoryPageSize);
      }

      navigateToList();
      refetchRootCategories();
      clearRowSelection();
      deletingCategoryIdsRef.current = [];
      notifyDeleted();
    },
    [
      clearRowSelection,
      client,
      getCachedChildrenByParentId,
      navigateToList,
      notifyDeleted,
      pruneTreeStateAfterDelete,
      refetchRootCategories,
      subcategoryPageSize,
      visibleRows,
    ],
  );

  const [categoryBulkDelete, categoryBulkDeleteOpts] = useCategoryBulkDeleteMutation({
    onCompleted: handleCategoryBulkDeleteOnComplete,
  });

  const handleCategoryBulkDelete = useCallback(async (): Promise<void> => {
    deletingCategoryIdsRef.current = [...selectedRowIds];

    await categoryBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });

    clearRowSelection();
  }, [categoryBulkDelete, clearRowSelection, selectedRowIds]);

  return {
    categoryBulkDelete,
    categoryBulkDeleteOpts,
    handleCategoryBulkDelete,
  };
};
