import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { ListActions, PageListProps } from "../../../types";
import { ProductTypeList_productTypes_edges_node } from "../../types/ProductTypeList";
import ProductTypeList from "../ProductTypeList";

interface ProductTypeListPageProps extends PageListProps, ListActions {
  productTypes: ProductTypeList_productTypes_edges_node[];
  onBack: () => void;
}

const ProductTypeListPage: React.StatelessComponent<
  ProductTypeListPageProps
> = ({ disabled, onAdd, onBack, ...listProps }) => {
  const intl = useIntl();

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.productTypes)}>
        <Button
          color="primary"
          variant="contained"
          disabled={disabled}
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Add product type"
            description="button"
          />{" "}
          <AddIcon />
        </Button>
      </PageHeader>
      <ProductTypeList disabled={disabled} {...listProps} />
    </Container>
  );
};
ProductTypeListPage.displayName = "ProductTypeListPage";
export default ProductTypeListPage;
