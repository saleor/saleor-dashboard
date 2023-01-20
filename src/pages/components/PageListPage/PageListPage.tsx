import { Button } from "@dashboard/components/Button";
import Container from "@dashboard/components/Container";
import PageHeader from "@dashboard/components/PageHeader";
import { PageFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import {
  PageListUrlDialog,
  PageListUrlQueryParams,
  PageListUrlSortField,
} from "@dashboard/pages/urls";
import { ListActions, PageListProps, SortPage } from "@dashboard/types";
import { Card } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import PageList from "../PageList";
import PageListSearchAndFilters from "./PageListSearchAndFilters";

export interface PageListActionDialogOpts {
  open: (action: PageListUrlDialog, newParams?: PageListUrlQueryParams) => void;
  close: () => void;
}
export interface PageListPageProps
  extends PageListProps,
    ListActions,
    SortPage<PageListUrlSortField> {
  pages: PageFragment[];
  params: PageListUrlQueryParams;
  actionDialogOpts: PageListActionDialogOpts;
  onAdd: () => void;
}

const PageListPage: React.FC<PageListPageProps> = ({
  params,
  actionDialogOpts,
  onAdd,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.pages)}>
        <Button onClick={onAdd} variant="primary" data-test-id="create-page">
          <FormattedMessage
            id="AHRDWt"
            defaultMessage="Create page"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <PageListSearchAndFilters
          params={params}
          actionDialogOpts={actionDialogOpts}
        />
        <PageList {...listProps} />
      </Card>
    </Container>
  );
};
PageListPage.displayName = "PageListPage";
export default PageListPage;
