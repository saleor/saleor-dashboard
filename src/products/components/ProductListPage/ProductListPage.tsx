import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { Theme } from "@material-ui/core/styles";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ColumnPicker, {
  ColumnPickerChoice
} from "@saleor/components/ColumnPicker";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { ProductListColumns } from "@saleor/config";
import { sectionNames } from "@saleor/intl";
import {
  AvailableInGridAttributes_availableInGrid_edges_node,
  AvailableInGridAttributes_grid_edges_node
} from "@saleor/products/types/AvailableInGridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import {
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage
} from "@saleor/types";
import { ProductListUrlSortField } from "../../urls";
import ProductList from "../ProductList";
import ProductListFilter, { ProductFilterKeys } from "../ProductListFilter";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductFilterKeys>,
    FetchMoreProps,
    SortPage<ProductListUrlSortField> {
  activeAttributeSortId: string;
  availableInGridAttributes: AvailableInGridAttributes_availableInGrid_edges_node[];
  currencySymbol: string;
  gridAttributes: AvailableInGridAttributes_grid_edges_node[];
  totalGridAttributes: number;
  products: ProductList_products_edges_node[];
}

const useStyles = makeStyles((theme: Theme) => ({
  columnPicker: {
    marginRight: theme.spacing.unit * 3
  }
}));

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    currencySymbol,
    currentTab,
    defaultSettings,
    filtersList,
    gridAttributes,
    availableInGridAttributes,
    hasMore,
    initialSearch,
    loading,
    settings,
    tabs,
    totalGridAttributes,
    onAdd,
    onAll,
    onFetchMore,
    onSearchChange,
    onFilterAdd,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    ...listProps
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);

  const handleSave = (columns: ProductListColumns[]) =>
    onUpdateListSettings("columns", columns);

  const columns: ColumnPickerChoice[] = [
    {
      label: intl.formatMessage({
        defaultMessage: "Published",
        description: "product status"
      }),
      value: "isPublished" as ProductListColumns
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Price",
        description: "product price"
      }),
      value: "price" as ProductListColumns
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Type",
        description: "product type"
      }),
      value: "productType" as ProductListColumns
    },
    ...availableInGridAttributes.map(attribute => ({
      label: attribute.name,
      value: `attribute:${attribute.id}`
    }))
  ];

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.products)}>
        <ColumnPicker
          className={classes.columnPicker}
          columns={columns}
          defaultColumns={defaultSettings.columns}
          hasMore={hasMore}
          loading={loading}
          initialColumns={settings.columns}
          total={
            columns.length -
            availableInGridAttributes.length +
            totalGridAttributes
          }
          onFetchMore={onFetchMore}
          onSave={handleSave}
        />
        <Button
          onClick={onAdd}
          color="primary"
          variant="contained"
          data-tc="add-product"
        >
          <FormattedMessage
            defaultMessage="Create Product"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <ProductListFilter
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          filtersList={filtersList}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterAdd={onFilterAdd}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          tabs={tabs}
        />
        <ProductList
          {...listProps}
          gridAttributes={gridAttributes}
          settings={settings}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Card>
    </Container>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
