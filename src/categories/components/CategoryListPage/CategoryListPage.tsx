import {
  categoryAddUrl,
  CategoryListUrlSortField,
} from "@dashboard/categories/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { CategoryFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import { Box, ChevronRightIcon } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryListDatagrid } from "../CategoryListDatagrid";

export interface CategoryTableProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    SortPage<CategoryListUrlSortField>,
    TabPageProps {
  categories: CategoryFragment[];
  hasPresetsChanged: boolean;
}

export const CategoryListPage: React.FC<CategoryTableProps> = ({
  categories,
  currentTab,
  disabled,
  initialSearch,
  isChecked,
  selected,
  settings,
  tabs,
  toggle,
  toggleAll,
  toolbar,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  onUpdateListSettings,
  hasPresetsChanged,
  ...listProps
}) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <ListPageLayout>
      <TopNav
        title={intl.formatMessage(sectionNames.categories)}
        isAlignToRight={false}
      >
        <Box
          __flex={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onSearchChange}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "vy7fjd",
                defaultMessage: "All Categories",
                description: "tab name",
              })}
            />
          </Box>

          <Button
            variant="primary"
            href={categoryAddUrl()}
            data-test-id="create-category"
          >
            <FormattedMessage
              id="vof5TR"
              defaultMessage="Create category"
              description="button"
            />
          </Button>
        </Box>
      </TopNav>
      <Card>
        <CategoryListDatagrid
          categories={categories}
          onSort={listProps.onSort}
          sort={listProps.sort}
        />
        {/* <CategoryList
          categories={categories}
          disabled={disabled}
          isChecked={isChecked}
          isRoot={true}
          selected={selected}
          settings={settings}
          toggle={toggle}
          toggleAll={toggleAll}
          toolbar={toolbar}
          onUpdateListSettings={onUpdateListSettings}
          {...listProps}
        /> */}
      </Card>
    </ListPageLayout>
  );
};
CategoryListPage.displayName = "CategoryListPage";
export default CategoryListPage;
