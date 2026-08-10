import { useApolloClient } from "@apollo/client";
import { useCategorySelectionController } from "@dashboard/categories/views/CategoryList/hooks/useCategorySelectionController";
import { useCategoryTreeController } from "@dashboard/categories/views/CategoryList/hooks/useCategoryTreeController";
import { collectDescendantIds } from "@dashboard/categories/views/CategoryList/utils/categoryTree";
import { Pagination } from "@dashboard/collections/components/CollectionProducts/Pagination";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { PAGINATE_BY } from "@dashboard/config";
import { type CategoryDetailsQuery } from "@dashboard/graphql";
import { type ListProps, type ListViews, type RelayToFlat } from "@dashboard/types";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { type Dispatch, type SetStateAction, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

import { CategoryListDatagrid } from "../CategoryListDatagrid";
import styles from "./CategorySubcategories.module.css";
import { messages } from "./messages";

interface CategorySubcategoriesProps
  extends Pick<ListProps<ListViews.CATEGORY_LIST>, "onUpdateListSettings" | "settings"> {
  categoryId: string;
  disabled: boolean;
  subcategories: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["children"]>;
  subcategoryTotalCount?: number | null;
  selectedCategoryIds: string[];
  setSelectedCategoryIds: Dispatch<SetStateAction<string[]>>;
  clearRowSelection: () => void;
  excludeFromSelected: (ids: string[]) => void;
  setClearDatagridRowSelectionCallback: (callback: () => void) => void;
  onCategoriesDelete: () => void;
  onCreateSubcategory: () => void;
}

export const CategorySubcategories = ({
  categoryId,
  subcategories,
  subcategoryTotalCount,
  disabled,
  onCategoriesDelete,
  onCreateSubcategory,
  selectedCategoryIds,
  setSelectedCategoryIds,
  clearRowSelection,
  excludeFromSelected,
  setClearDatagridRowSelectionCallback,
  settings,
  onUpdateListSettings,
}: CategorySubcategoriesProps): JSX.Element => {
  const client = useApolloClient();
  const location = useLocation();
  const [storedExpandedIds, setStoredExpandedIds] = useState<string[]>([]);
  const count = subcategoryTotalCount ?? subcategories?.length ?? 0;
  const hasSubcategories = count > 0;
  const numberOfRows = settings?.rowNumber ?? PAGINATE_BY;
  const {
    visibleRows,
    hasExpandedSubcategories,
    isCategoryExpanded,
    isCategoryChildrenLoading,
    isLoadingMoreSubcategories,
    getCategoryDepth,
    toggleExpanded,
    loadMoreSubcategories,
    handleCollapseAllSubcategories,
    getCachedChildrenByParentId,
  } = useCategoryTreeController({
    client,
    categories: subcategories ?? [],
    locationPathname: `${location.pathname}:${categoryId}`,
    clearRowSelection,
    storedExpandedIds,
    setStoredExpandedIds,
  });
  const { handleSelectedCategoryIdsChange, handleSetSelectedCategoryIds } =
    useCategorySelectionController({
      selectedRowIds: selectedCategoryIds,
      setSelectedRowIds: setSelectedCategoryIds,
      setClearDatagridRowSelectionCallback,
      visibleRows,
      getCachedChildrenByParentId,
    });
  const handleCategoryExpandToggle = useCallback(
    async (subcategoryId: string): Promise<void> => {
      if (isCategoryExpanded(subcategoryId)) {
        const hiddenIds = new Set(collectDescendantIds(subcategoryId, getCachedChildrenByParentId));
        const hasHiddenSelectedRows = selectedCategoryIds.some(id => hiddenIds.has(id));

        if (hasHiddenSelectedRows) {
          excludeFromSelected([...hiddenIds, subcategoryId]);
        }
      }

      await toggleExpanded(subcategoryId);
    },
    [
      excludeFromSelected,
      getCachedChildrenByParentId,
      isCategoryExpanded,
      selectedCategoryIds,
      toggleExpanded,
    ],
  );

  return (
    <Box className={styles.card} data-test-id="category-subcategories">
      <Box className={styles.header}>
        <Text size={5} fontWeight="bold" as="h2" className={styles.headerTitle}>
          <FormattedMessage {...messages.title} />
        </Text>
        <Text size={2} color="default2" className={styles.headerCount}>
          <FormattedMessage {...messages.assignedCount} values={{ count }} />
        </Text>
      </Box>

      <Box className={styles.intro}>
        <Text size={3} color="default2">
          <FormattedMessage {...messages.intro} />
        </Text>
      </Box>

      {hasSubcategories ? (
        <Box className={styles.list}>
          <CategoryListDatagrid
            variant="sidebar"
            settings={settings}
            onUpdateListSettings={onUpdateListSettings}
            rows={visibleRows}
            disabled={disabled}
            hidePagination
            selectedCategoriesIds={selectedCategoryIds}
            onSelectCategoriesIds={handleSetSelectedCategoryIds}
            onSelectedCategoriesIdsChange={handleSelectedCategoryIdsChange}
            isCategoryExpanded={isCategoryExpanded}
            onCategoryExpandToggle={handleCategoryExpandToggle}
            isCategoryChildrenLoading={isCategoryChildrenLoading}
            isLoadingMoreSubcategories={isLoadingMoreSubcategories}
            getCategoryDepth={getCategoryDepth}
            onLoadMoreSubcategories={loadMoreSubcategories}
          />
        </Box>
      ) : (
        <Box className={styles.emptyState} data-test-id="empty-data-grid-text">
          <Text size={2} color="default2">
            <FormattedMessage {...messages.empty} />
          </Text>
        </Box>
      )}

      <Box className={styles.listFooter}>
        <Box className={styles.footerToolbar}>
          {hasSubcategories && hasExpandedSubcategories ? (
            <Button
              variant="tertiary"
              size="small"
              type="button"
              onClick={handleCollapseAllSubcategories}
              data-test-id="collapse-all-subcategories"
            >
              <FormattedMessage {...messages.collapseAllSubcategories} />
            </Button>
          ) : null}
          <Box className={styles.actions}>
            {hasSubcategories && selectedCategoryIds.length > 0 ? (
              <BulkDeleteButton onClick={onCategoriesDelete} disabled={disabled}>
                <FormattedMessage {...messages.deleteSelected} />
              </BulkDeleteButton>
            ) : null}
            <Button
              variant="secondary"
              type="button"
              data-test-id="create-subcategory"
              disabled={disabled}
              onClick={onCreateSubcategory}
            >
              <FormattedMessage {...messages.create} />
            </Button>
          </Box>
        </Box>
      </Box>

      {hasSubcategories ? (
        <Box className={styles.pagination}>
          <Pagination
            numberOfRows={numberOfRows}
            onUpdateListSettings={(key, value) => onUpdateListSettings?.(key, value)}
          />
        </Box>
      ) : null}
    </Box>
  );
};
