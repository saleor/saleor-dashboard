import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  TabPageProps
} from "@saleor/types";
import { SaleList_sales_edges_node } from "../../types/SaleList";
import SaleList from "../SaleList";

export interface SaleListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    TabPageProps {
  defaultCurrency: string;
  sales: SaleList_sales_edges_node[];
}

const SaleListPage: React.StatelessComponent<SaleListPageProps> = ({
  currentTab,
  initialSearch,
  onAdd,
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
      <PageHeader title={intl.formatMessage(sectionNames.sales)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage defaultMessage="Create Sale" description="button" />
        </Button>
      </PageHeader>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Sales",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Sale"
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <SaleList {...listProps} />
      </Card>
    </Container>
  );
};
SaleListPage.displayName = "SaleListPage";
export default SaleListPage;
