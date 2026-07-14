import { useApolloClient } from "@apollo/client";
import { categoryAddUrl } from "@dashboard/categories/urls";
import { useCategorySelectionController } from "@dashboard/categories/views/CategoryList/hooks/useCategorySelectionController";
import { useCategoryTreeController } from "@dashboard/categories/views/CategoryList/hooks/useCategoryTreeController";
import { collectDescendantIds } from "@dashboard/categories/views/CategoryList/utils/categoryTree";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { DashboardCard } from "@dashboard/components/Card";
import { InternalLink } from "@dashboard/components/InternalLink";
import { type CategoryDetailsQuery } from "@dashboard/graphql";
import { type ListProps, type ListViews, type RelayToFlat } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { type Dispatch, type SetStateAction, useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";

import { CategoryListDatagrid } from "../CategoryListDatagrid";
import { messages } from "./messages";

interface CategorySubcategoriesProps
  extends Pick<ListProps<ListViews.CATEGORY_LIST>, "onUpdateListSettings" | "settings"> {
  categoryId: string;
  disabled: boolean;
  subcategories: RelayToFlat<NonNullable<CategoryDetailsQuery["category"]>["children"]>;
  selectedCategoryIds: string[];
  setSelectedCategoryIds: Dispatch<SetStateAction<string[]>>;
  clearRowSelection: () => void;
  excludeFromSelected: (ids: string[]) => void;
  setClearDatagridRowSelectionCallback: (callback: () => void) => void;
  onCategoriesDelete: () => void;
}

export const CategorySubcategories = ({
  categoryId,
  subcategories,
  disabled,
  onCategoriesDelete,
  selectedCategoryIds,
  setSelectedCategoryIds,
  clearRowSelection,
  excludeFromSelected,
  setClearDatagridRowSelectionCallback,
  settings,
  onUpdateListSettings,
}: CategorySubcategoriesProps) => {
  const client = useApolloClient();
  const location = useLocation();
  const [storedExpandedIds, setStoredExpandedIds] = useState<string[]>([]);
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
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <FormattedMessage
            id="NivJal"
            defaultMessage="All Subcategories"
            description="section header"
          />
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="secondary"
              onClick={handleCollapseAllSubcategories}
              disabled={!hasExpandedSubcategories}
              data-test-id="collapse-all-subcategories"
            >
              <FormattedMessage {...messages.collapseAllSubcategories} />
            </Button>
            <InternalLink to={categoryAddUrl(categoryId)}>
              <Button variant="secondary" data-test-id="create-subcategory">
                <FormattedMessage
                  id="UycVMp"
                  defaultMessage="Create subcategory"
                  description="button"
                />
              </Button>
            </InternalLink>
          </Box>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      <CategoryListDatagrid
        settings={settings}
        onUpdateListSettings={onUpdateListSettings}
        rows={visibleRows}
        disabled={disabled}
        selectedCategoriesIds={selectedCategoryIds}
        onSelectCategoriesIds={handleSetSelectedCategoryIds}
        onSelectedCategoriesIdsChange={handleSelectedCategoryIdsChange}
        isCategoryExpanded={isCategoryExpanded}
        onCategoryExpandToggle={handleCategoryExpandToggle}
        isCategoryChildrenLoading={isCategoryChildrenLoading}
        isLoadingMoreSubcategories={isLoadingMoreSubcategories}
        getCategoryDepth={getCategoryDepth}
        onLoadMoreSubcategories={loadMoreSubcategories}
        selectionActionButton={
          <Box paddingRight={5}>
            <BulkDeleteButton onClick={onCategoriesDelete}>
              <FormattedMessage defaultMessage="Delete categories" id="FiO/W/" />
            </BulkDeleteButton>
          </Box>
        }
      />
    </DashboardCard>
  );
};
