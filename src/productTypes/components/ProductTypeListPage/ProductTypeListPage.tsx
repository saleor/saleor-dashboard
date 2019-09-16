import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import {
  ListActions,
  PageListProps,
  SearchPageProps,
  TabPageProps
} from "../../../types";
import { ProductTypeList_productTypes_edges_node } from "../../types/ProductTypeList";
import ProductTypeList from "../ProductTypeList";

export interface ProductTypeListPageProps
  extends PageListProps,
    ListActions,
    SearchPageProps,
    TabPageProps {
  productTypes: ProductTypeList_productTypes_edges_node[];
  onBack: () => void;
}

const ProductTypeListPage: React.StatelessComponent<
  ProductTypeListPageProps
> = ({
  currentTab,
  initialSearch,
  onAdd,
  onAll,
  onBack,
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
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.productTypes)}>
        <Button color="primary" variant="contained" onClick={onAdd}>
          <FormattedMessage
            defaultMessage="create product type"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Product Types",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Product Type"
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <ProductTypeList {...listProps} />
      </Card>
    </Container>
  );
};
ProductTypeListPage.displayName = "ProductTypeListPage";
export default ProductTypeListPage;
