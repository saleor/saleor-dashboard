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
import { PageListProps, SearchPageProps, SortPage, TabPageProps } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
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
  selectedCategoriesIds,
  ...listProps
}: CategoryTableProps) => {
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
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRight />
            </Box>

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
          {selectedCategoriesIds.length > 0 && (
            <BulkDeleteButton onClick={onCategoriesDelete}>
              <FormattedMessage {...messages.bulkCategoryDelete} />
            </BulkDeleteButton>
          )}
        </Box>
        <CategoryListDatagrid
          disabled={disabled}
          categories={categories}
          hasRowHover={!isFilterPresetOpen}
          {...listProps}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};
CategoryListPage.displayName = "CategoryListPage";
