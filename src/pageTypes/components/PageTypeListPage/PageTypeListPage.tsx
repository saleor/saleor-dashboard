import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { PageTypeListUrlSortField } from "@saleor/pageTypes/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "../../../types";
// import { PageTypeList_pageTypes_edges_node } from "../../types/PageTypeList";
import PageTypeList from "../PageTypeList";
import {
  createFilterStructure,
  PageTypeFilterKeys,
  PageTypeListFilterOpts
} from "./filters";

export interface PageTypeListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<PageTypeFilterKeys, PageTypeListFilterOpts>,
    SortPage<PageTypeListUrlSortField>,
    TabPageProps {
  pageTypes: any[]; // TODO FIX!!!
  onBack: () => void;
}

const PageTypeListPage: React.FC<PageTypeListPageProps> = ({
  currencySymbol,
  currentTab,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onBack,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.pageTypes)}>
        <Button color="primary" variant="contained" onClick={onAdd}>
          <FormattedMessage
            defaultMessage="create page type"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Page Types",
            description: "tab name"
          })}
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Page Type"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <PageTypeList {...listProps} />
      </Card>
    </Container>
  );
};
PageTypeListPage.displayName = "PageTypeListPage";
export default PageTypeListPage;
