import { rippleExpandedSubcategories } from "@dashboard/categories/ripples/expandedSubcategories";
import { categoryAddUrl, type CategoryListUrlSortField } from "@dashboard/categories/urls";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForCategoryOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import {
  type PageListProps,
  type SearchPageProps,
  type SortPage,
  type TabPageProps,
} from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryListDatagrid } from "../CategoryListDatagrid";
import { useCategoryListPageState } from "./categoryListPageState";
import { messages } from "./messages";

interface CategoryTableProps
  extends PageListProps,
    SearchPageProps,
    SortPage<CategoryListUrlSortField>,
    Omit<TabPageProps, "onTabDelete"> {
  hasPresetsChanged: boolean;
  onTabDelete: (tabIndex: number) => void;
  onTabUpdate: (tabName: string) => void;
}

export const CategoryListPage = ({
  currentTab,
  disabled,
  initialSearch,
  tabs,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  onTabUpdate,
  hasPresetsChanged,
  ...listProps
}: CategoryTableProps): JSX.Element => {
  const {
    rows,
    selectedCategoriesIds,
    onCategoriesDelete,
    onSelectCategoriesIds,
    onSelectedCategoriesIdsChange,
    isCategoryExpanded,
    isCategoryChildrenLoading,
    isLoadingMoreSubcategories,
    onCategoryExpandToggle,
    getCategoryDepth,
    onLoadMoreSubcategories,
    hasExpandedSubcategories,
    onCollapseAllSubcategories,
  } = useCategoryListPageState();
  const navigate = useNavigator();

  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const { CATEGORY_OVERVIEW_CREATE, CATEGORY_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.CATEGORY_LIST,
  );
  const extensionMenuItems = getExtensionsItemsForCategoryOverviewActions(
    CATEGORY_OVERVIEW_MORE_ACTIONS,
    selectedCategoriesIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(CATEGORY_OVERVIEW_CREATE);

  return (
    <ListPageLayout>
      <TopNav
        title={intl.formatMessage(sectionNames.categories)}
        isAlignToRight={false}
        withoutBorder
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onTabUpdate}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage(messages.allCategories)}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {extensionMenuItems.length > 0 && <TopNav.Menu items={extensionMenuItems} />}
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonGroupWithDropdown
                options={extensionCreateButtonItems}
                data-test-id="create-category"
                onClick={() => navigate(categoryAddUrl())}
              >
                <FormattedMessage {...messages.createCategory} />
              </ButtonGroupWithDropdown>
            ) : (
              <Button
                data-test-id="create-category"
                onClick={() => navigate(categoryAddUrl())}
                variant="primary"
              >
                <FormattedMessage {...messages.createCategory} />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      <DashboardCard>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingX={6}
          marginBottom={2}
        >
          <Box __width="320px">
            <SearchInput
              initialSearch={initialSearch}
              placeholder={intl.formatMessage(messages.searchCategory)}
              onSearchChange={onSearchChange}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <Ripple model={rippleExpandedSubcategories} />
              <Button
                variant="secondary"
                onClick={onCollapseAllSubcategories}
                disabled={!hasExpandedSubcategories}
                data-test-id="collapse-all-subcategories"
              >
                <FormattedMessage {...messages.collapseAllSubcategories} />
              </Button>
            </Box>
            {selectedCategoriesIds.length > 0 && (
              <BulkDeleteButton onClick={onCategoriesDelete}>
                <FormattedMessage {...messages.bulkCategoryDelete} />
              </BulkDeleteButton>
            )}
          </Box>
        </Box>
        <CategoryListDatagrid
          disabled={disabled}
          rows={rows}
          hasRowHover={!isFilterPresetOpen}
          onSelectCategoriesIds={onSelectCategoriesIds}
          selectedCategoriesIds={selectedCategoriesIds}
          onSelectedCategoriesIdsChange={onSelectedCategoriesIdsChange}
          isCategoryExpanded={isCategoryExpanded}
          onCategoryExpandToggle={onCategoryExpandToggle}
          isCategoryChildrenLoading={isCategoryChildrenLoading}
          isLoadingMoreSubcategories={isLoadingMoreSubcategories}
          getCategoryDepth={getCategoryDepth}
          onLoadMoreSubcategories={onLoadMoreSubcategories}
          {...listProps}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};
CategoryListPage.displayName = "CategoryListPage";
