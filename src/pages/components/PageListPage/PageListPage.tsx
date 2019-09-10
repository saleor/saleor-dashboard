import Button from "@material-ui/core/Button";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "@saleor/types";
import { PageList_pages_edges_node } from "../../types/PageList";
import PageList from "../PageList/PageList";

export interface PageListPageProps extends PageListProps, ListActions {
  pages: PageList_pages_edges_node[];
  onBack: () => void;
}

const PageListPage: React.StatelessComponent<PageListPageProps> = ({
  disabled,
  settings,
  onAdd,
  onBack,
  onNextPage,
  onPreviousPage,
  onRowClick,
  onUpdateListSettings,
  pageInfo,
  pages,
  isChecked,
  selected,
  toggle,
  toggleAll,
  toolbar
}) => {
  const intl = useIntl();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.pages)}>
        <Button
          disabled={disabled}
          onClick={onAdd}
          variant="contained"
          color="primary"
        >
          <FormattedMessage defaultMessage="Create page" description="button" />
        </Button>
      </PageHeader>
      <PageList
        disabled={disabled}
        settings={settings}
        pages={pages}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onUpdateListSettings={onUpdateListSettings}
        onRowClick={onRowClick}
        pageInfo={pageInfo}
        isChecked={isChecked}
        selected={selected}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={toolbar}
      />
    </Container>
  );
};
PageListPage.displayName = "PageListPage";
export default PageListPage;
