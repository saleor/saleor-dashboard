import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { SaleListUrlSortField } from "@saleor/discounts/urls";
import { sectionNames } from "@saleor/intl";
import {
  ChannelProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { SaleList_sales_edges_node } from "../../types/SaleList";
import SaleList from "../SaleList";
import {
  createFilterStructure,
  SaleFilterKeys,
  SaleListFilterOpts
} from "./filters";

export interface SaleListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<SaleFilterKeys, SaleListFilterOpts>,
    SortPage<SaleListUrlSortField>,
    TabPageProps,
    ChannelProps {
  sales: SaleList_sales_edges_node[];
}

const SaleListPage: React.FC<SaleListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();
  const structure = createFilterStructure(intl, filterOpts);

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.sales)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage defaultMessage="Create Sale" description="button" />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Sales",
            description: "tab name"
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Sale"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
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
