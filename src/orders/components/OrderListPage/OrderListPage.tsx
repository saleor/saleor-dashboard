import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { OrderListUrlSortField } from "@saleor/orders/urls";
import { FilterPageProps, PageListProps, SortPage } from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderList_orders_edges_node } from "../../types/OrderList";
import OrderList from "../OrderList";
import {
  createFilterStructure,
  OrderFilterKeys,
  OrderListFilterOpts
} from "./filters";

export interface OrderListPageProps
  extends PageListProps,
    FilterPageProps<OrderFilterKeys, OrderListFilterOpts>,
    SortPage<OrderListUrlSortField> {
  orders: OrderList_orders_edges_node[];
}

const OrderListPage: React.FC<OrderListPageProps> = ({
  currencySymbol,
  currentTab,
  initialSearch,
  filterOpts,
  tabs,
  onAdd,
  onAll,
  onSearchChange,
  onFilterChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  ...listProps
}) => {
  const intl = useIntl();

  const filterStructure = createFilterStructure(intl, filterOpts);

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.orders)}>
        <Button color="primary" variant="contained" onClick={onAdd}>
          <FormattedMessage
            defaultMessage="Create order"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          tabs={tabs}
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Orders",
            description: "tab name"
          })}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Orders..."
          })}
        />
        <OrderList {...listProps} />
      </Card>
    </Container>
  );
};
OrderListPage.displayName = "OrderListPage";
export default OrderListPage;
