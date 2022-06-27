import { Card } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { configurationMenuUrl } from "@saleor/configuration";
import { PageTypeFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import {
  pageTypeAddUrl,
  PageTypeListUrlSortField,
} from "@saleor/pageTypes/urls";
import React from "react";
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

const PageTypeListPage: React.FC<PageTypeListPageProps> = ({
  currentTab,
  initialSearch,
  onAll,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();
  return (
    <Container>
      <Backlink href={configurationMenuUrl}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.pageTypes)}>
        <Button
          variant="primary"
          href={pageTypeAddUrl}
          data-test-id="create-page-type"
        >
          <FormattedMessage
            id="6JlXeD"
            defaultMessage="Create page type"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
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
      </Card>
    </Container>
  );
};
PageTypeListPage.displayName = "PageTypeListPage";
export default PageTypeListPage;
