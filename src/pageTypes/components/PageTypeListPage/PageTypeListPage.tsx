import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import SearchBar from "@dashboard/components/SearchBar";
import { configurationMenuUrl } from "@dashboard/configuration";
import { PageTypeFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { pageTypeAddUrl, PageTypeListUrlSortField } from "@dashboard/pageTypes/urls";
import { FormattedMessage, useIntl } from "react-intl";

import {
  ListActions,
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "../../../types";
import PageTypeList from "../PageTypeList";

export interface PageTypeListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    SortPage<PageTypeListUrlSortField>,
    TabPageProps {
  pageTypes: PageTypeFragment[];
}

const PageTypeListPage = ({
  currentTab,
  initialSearch,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}: PageTypeListPageProps) => {
  const intl = useIntl();

  return (
    <ListPageLayout>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.pageTypes)}>
        <Button variant="primary" href={pageTypeAddUrl} data-test-id="create-page-type">
          <FormattedMessage id="6JlXeD" defaultMessage="Create page type" description="button" />
        </Button>
      </TopNav>
      <DashboardCard>
        <SearchBar
          allTabLabel={intl.formatMessage({
            id: "oVDZUb",
            defaultMessage: "All Page Types",
            description: "tab name",
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "umsU70",
            defaultMessage: "Search Page Type",
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <PageTypeList {...listProps} />
      </DashboardCard>
    </ListPageLayout>
  );
};

PageTypeListPage.displayName = "PageTypeListPage";
export default PageTypeListPage;
