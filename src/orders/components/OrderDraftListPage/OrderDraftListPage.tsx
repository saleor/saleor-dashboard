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
import { OrderDraftList_draftOrders_edges_node } from "../../types/OrderDraftList";
import OrderDraftList from "../OrderDraftList";

export interface OrderDraftListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    TabPageProps {
  orders: OrderDraftList_draftOrders_edges_node[];
}

const OrderDraftListPage: React.StatelessComponent<OrderDraftListPageProps> = ({
  currentTab,
  disabled,
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
      <PageHeader title={intl.formatMessage(sectionNames.draftOrders)}>
        <Button
          color="primary"
          variant="contained"
          disabled={disabled}
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Create order"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Drafts",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Draft"
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <OrderDraftList disabled={disabled} {...listProps} />
      </Card>
    </Container>
  );
};
OrderDraftListPage.displayName = "OrderDraftListPage";
export default OrderDraftListPage;
