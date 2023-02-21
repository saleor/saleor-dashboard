import {
  categoryAddUrl,
  CategoryListUrlSortField,
} from "@dashboard/categories/urls";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import SearchBar from "@dashboard/components/SearchBar";
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
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CategoryList from "../CategoryList";

export interface CategoryTableProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    SortPage<CategoryListUrlSortField>,
    TabPageProps {
  categories: CategoryFragment[];
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
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <>
      <TopNav title={intl.formatMessage(sectionNames.categories)}>
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
      </TopNav>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            id: "vy7fjd",
            defaultMessage: "All Categories",
            description: "tab name",
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "JiXNEV",
            defaultMessage: "Search Category",
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <CategoryList
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
        />
      </Card>
    </>
  );
};
CategoryListPage.displayName = "CategoryListPage";
export default CategoryListPage;
