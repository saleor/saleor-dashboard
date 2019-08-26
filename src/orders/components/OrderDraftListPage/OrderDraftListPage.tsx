import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "@saleor/types";
import { OrderDraftList_draftOrders_edges_node } from "../../types/OrderDraftList";
import OrderDraftList from "../OrderDraftList";

export interface OrderDraftListPageProps extends PageListProps, ListActions {
  orders: OrderDraftList_draftOrders_edges_node[];
}

const OrderDraftListPage: React.StatelessComponent<OrderDraftListPageProps> = ({
  disabled,
  onAdd,
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
          <AddIcon />
        </Button>
      </PageHeader>
      <Card>
        <OrderDraftList disabled={disabled} {...listProps} />
      </Card>
    </Container>
  );
};
OrderDraftListPage.displayName = "OrderDraftListPage";
export default OrderDraftListPage;
