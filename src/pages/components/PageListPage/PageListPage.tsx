import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import { PageListUrlSortField } from "@saleor/pages/urls";
import { ListActions, PageListProps, SortPage } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { PageList_pages_edges_node } from "../../types/PageList";
import PageList from "../PageList";

export interface PageListPageProps
  extends PageListProps,
    ListActions,
    SortPage<PageListUrlSortField> {
  pages: PageList_pages_edges_node[];
}

const PageListPage: React.FC<PageListPageProps> = ({ onAdd, ...listProps }) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.pages)}>
        <Button onClick={onAdd} variant="primary" data-test-id="create-page">
          <FormattedMessage defaultMessage="Create page" description="button" />
        </Button>
      </PageHeader>
      <PageList {...listProps} />
    </Container>
  );
};
PageListPage.displayName = "PageListPage";
export default PageListPage;
