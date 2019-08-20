import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "@saleor/types";
import { SaleList_sales_edges_node } from "../../types/SaleList";
import SaleList from "../SaleList";

export interface SaleListPageProps extends PageListProps, ListActions {
  defaultCurrency: string;
  sales: SaleList_sales_edges_node[];
}

const SaleListPage: React.StatelessComponent<SaleListPageProps> = ({
  onAdd,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.sales)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage defaultMessage="Add Sale"
            description="button"
             />
          <AddIcon />
        </Button>
      </PageHeader>
      <SaleList {...listProps} />
    </Container>
  );
};
SaleListPage.displayName = "SaleListPage";
export default SaleListPage;
