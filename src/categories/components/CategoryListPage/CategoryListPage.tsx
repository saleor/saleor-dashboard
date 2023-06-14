import {
  categoryAddUrl,
  CategoryListUrlSortField,
} from "@dashboard/categories/urls";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { CategoryFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import {
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import {
  Box,
  Button as MacawButton,
  ChevronRightIcon,
  Tooltip,
  TrashBinIcon,
} from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryListDatagrid } from "../CategoryListDatagrid";

export interface CategoryTableProps
  extends PageListProps,
    SearchPageProps,
    SortPage<CategoryListUrlSortField>,
    TabPageProps {
  categories: CategoryFragment[];
  hasPresetsChanged: boolean;
  selectedCategoriesIds: string[];
  onCategoriesDelete: () => void;
  onSelectCategoriesIds: (ids: number[], clearSelection: () => void) => void;
  setBulkDeleteButtonRef: (ref: HTMLButtonElement) => void;
}

export const CategoryListPage: React.FC<CategoryTableProps> = ({
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
  hasPresetsChanged,
  onCategoriesDelete,
  setBulkDeleteButtonRef,
  selectedCategoriesIds,
  ...listProps
}) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <ListPageLayout>
      <TopNav
        title={intl.formatMessage(sectionNames.categories)}
        isAlignToRight={false}
        withoutBorder
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
              placeholder={intl.formatMessage({
                id: "T83iU7",
                defaultMessage: "Search categories...",
              })}
              onSearchChange={onSearchChange}
            />
          </Box>
          {selectedCategoriesIds.length > 0 && (
            <Tooltip>
              <Tooltip.Trigger>
                <MacawButton
                  ref={setBulkDeleteButtonRef}
                  onClick={onCategoriesDelete}
                  icon={<TrashBinIcon />}
                  variant="secondary"
                  data-test-id="delete-products-button"
                />
              </Tooltip.Trigger>
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow />
                <FormattedMessage
                  defaultMessage="Bulk category delete"
                  id="qU/z0Q"
                />
              </Tooltip.Content>
            </Tooltip>
          )}
        </Box>
        <CategoryListDatagrid
          disabled={disabled}
          categories={categories}
          {...listProps}
        />
      </Card>
    </ListPageLayout>
  );
};
CategoryListPage.displayName = "CategoryListPage";
export default CategoryListPage;
