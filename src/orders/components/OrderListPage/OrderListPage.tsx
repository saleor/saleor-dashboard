import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { FilterPageProps, ListActions, PageListProps } from "@saleor/types";
import { OrderList_orders_edges_node } from "../../types/OrderList";
import OrderList from "../OrderList";
import OrderListFilter, { OrderFilterKeys } from "../OrderListFilter";

export interface OrderListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<OrderFilterKeys> {
  orders: OrderList_orders_edges_node[];
}

const OrderListPage: React.FC<OrderListPageProps> = ({
  currencySymbol,
  currentTab,
  filtersList,
  initialSearch,
  tabs,
  onAdd,
  onAll,
  onSearchChange,
  onFilterAdd,
  onTabChange,
  onTabDelete,
  onTabSave,
  ...listProps
}) => {
  const intl = useIntl();

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
        <OrderListFilter
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Orders",
            description: "tab name"
          })}
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          filterLabel={intl.formatMessage({
            defaultMessage: "Select all orders where:"
          })}
          tabs={tabs}
          filtersList={filtersList}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Orders..."
          })}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onFilterAdd={onFilterAdd}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <OrderList {...listProps} />
      </Card>
    </Container>
  );
};
OrderListPage.displayName = "OrderListPage";
export default OrderListPage;
