import { rippleExpandedSubcategories } from "@dashboard/categories/ripples/expandedSubcategories";
import { categoryAddUrl, CategoryListUrlSortField } from "@dashboard/categories/urls";
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
import { CategoryFragment } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { PageListProps, SearchPageProps, SortPage, TabPageProps } from "@dashboard/types";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import { ChangeEvent, useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryListDatagrid } from "../CategoryListDatagrid";
import { messages } from "./messages";

interface CategoryTableProps
  extends PageListProps,
    SearchPageProps,
    SortPage<CategoryListUrlSortField>,
    Omit<TabPageProps, "onTabDelete"> {
  categories: CategoryFragment[];
  hasPresetsChanged: boolean;
  selectedCategoriesIds: string[];
  onTabDelete: (tabIndex: number) => void;
  onTabUpdate: (tabName: string) => void;
  onCategoriesDelete: () => void;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  onSelectedCategoriesIdsChange?: (ids: string[]) => void;
  isCategoryExpanded?: (categoryId: string) => boolean;
  onCategoryExpandToggle?: (categoryId: string) => void;
  isCategoryChildrenLoading?: (categoryId: string) => boolean;
  getCategoryDepth?: (categoryId: string) => number;
  subcategoryPageSize: number;
  onSubcategoryPageSizeChange: (value: number) => void;
}

export const CategoryListPage = ({
  categories,
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
  onCategoriesDelete,
  onSelectCategoriesIds,
  onSelectedCategoriesIdsChange,
  selectedCategoriesIds,
  isCategoryExpanded,
  isCategoryChildrenLoading,
  onCategoryExpandToggle,
  getCategoryDepth,
  subcategoryPageSize,
  onSubcategoryPageSizeChange,
  ...listProps
}: CategoryTableProps): JSX.Element => {
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
  const handleSubcategoryPageSizeInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number.parseInt(event.target.value, 10);

      if (Number.isNaN(nextValue)) {
        return;
      }

      onSubcategoryPageSizeChange(nextValue);
    },
    [onSubcategoryPageSizeChange],
  );

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
              <Text size={2}>
                <FormattedMessage {...messages.subcategoriesPageSizeLabel} />
              </Text>
              <Ripple model={rippleExpandedSubcategories} />
              <Input
                size="small"
                type="number"
                min={1}
                max={200}
                step={1}
                value={subcategoryPageSize}
                onChange={handleSubcategoryPageSizeInputChange}
                __width="104px"
                data-test-id="subcategory-page-size-input"
              />
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
          categories={categories}
          hasRowHover={!isFilterPresetOpen}
          onSelectCategoriesIds={onSelectCategoriesIds}
          selectedCategoriesIds={selectedCategoriesIds}
          onSelectedCategoriesIdsChange={onSelectedCategoriesIdsChange}
          isCategoryExpanded={isCategoryExpanded}
          onCategoryExpandToggle={onCategoryExpandToggle}
          isCategoryChildrenLoading={isCategoryChildrenLoading}
          getCategoryDepth={getCategoryDepth}
          {...listProps}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};
CategoryListPage.displayName = "CategoryListPage";
