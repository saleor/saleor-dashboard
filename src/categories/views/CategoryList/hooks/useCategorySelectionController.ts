import { type CategoryFragment } from "@dashboard/graphql";
import isEqual from "lodash/isEqual";
import { useCallback, useEffect } from "react";

import { type CategoryListRow } from "../types";
import {
  getSelectedWithLoadedDescendants,
  removeDescendantsFromDeselectedParents,
} from "../utils/categorySelection";

interface UseCategorySelectionControllerArgs {
  selectedRowIds: string[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>;
  setClearDatagridRowSelectionCallback: (clearSelection: () => void) => void;
  visibleRows: CategoryListRow[];
  getCachedChildrenByParentId: (parentId: string) => CategoryFragment[];
}

interface UseCategorySelectionController {
  handleSelectedCategoryIdsChange: (ids: string[]) => void;
  handleSetSelectedCategoryIds: (rows: number[], clearSelection: () => void) => void;
}

export const useCategorySelectionController = ({
  selectedRowIds,
  setSelectedRowIds,
  setClearDatagridRowSelectionCallback,
  visibleRows,
  getCachedChildrenByParentId,
}: UseCategorySelectionControllerArgs): UseCategorySelectionController => {
  const handleSelectedCategoryIdsChange = useCallback(
    (ids: string[]): void => {
      const idsWithoutDeselectedParentsDescendants = removeDescendantsFromDeselectedParents(
        ids,
        selectedRowIds,
        getCachedChildrenByParentId,
      );
      const nextSelectedIds = getSelectedWithLoadedDescendants(
        idsWithoutDeselectedParentsDescendants,
        getCachedChildrenByParentId,
      );

      if (!isEqual(nextSelectedIds, selectedRowIds)) {
        setSelectedRowIds(nextSelectedIds);
      }
    },
    [getCachedChildrenByParentId, selectedRowIds, setSelectedRowIds],
  );

  useEffect(() => {
    const nextSelectedIds = getSelectedWithLoadedDescendants(
      selectedRowIds,
      getCachedChildrenByParentId,
    );

    if (!isEqual(nextSelectedIds, selectedRowIds)) {
      // eslint-disable-next-line react-you-might-not-need-an-effect/no-pass-data-to-parent
      setSelectedRowIds(nextSelectedIds);
    }
  }, [getCachedChildrenByParentId, selectedRowIds, setSelectedRowIds]);

  const handleSetSelectedCategoryIds = useCallback(
    (rows: number[], clearSelection: () => void): void => {
      const rowsIds = rows
        .map(rowIndex => visibleRows[rowIndex]?.category.id)
        .filter((id): id is string => !!id);

      handleSelectedCategoryIdsChange(rowsIds);
      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [visibleRows, handleSelectedCategoryIdsChange, setClearDatagridRowSelectionCallback],
  );

  return {
    handleSelectedCategoryIdsChange,
    handleSetSelectedCategoryIds,
  };
};
