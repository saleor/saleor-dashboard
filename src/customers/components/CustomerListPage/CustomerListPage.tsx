import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "@saleor/types";
import { ListCustomers_customers_edges_node } from "../../types/ListCustomers";
import CustomerList from "../CustomerList/CustomerList";

export interface CustomerListPageProps extends PageListProps, ListActions {
  customers: ListCustomers_customers_edges_node[];
}

const CustomerListPage: React.StatelessComponent<CustomerListPageProps> = ({
  customers,
  disabled,
  onAdd,
  ...customerListProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.customers)}>
        <Button
          color="primary"
          variant="contained"
          disabled={disabled}
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Add customer"
            description="button"
          />
          <AddIcon />
        </Button>
      </PageHeader>
      <CustomerList
        customers={customers}
        disabled={disabled}
        {...customerListProps}
      />
    </Container>
  );
};
CustomerListPage.displayName = "CustomerListPage";
export default CustomerListPage;
