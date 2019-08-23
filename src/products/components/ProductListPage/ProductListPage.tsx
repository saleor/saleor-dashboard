import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import { Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import makeStyles from "@material-ui/styles/makeStyles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { CategoryDetails_category_products_edges_node } from "@saleor/categories/types/CategoryDetails";
import ColumnPicker, {
  ColumnPickerChoice
} from "@saleor/components/ColumnPicker";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import ProductList from "@saleor/components/ProductList";
import { ProductListColumns } from "@saleor/config";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { FilterPageProps, ListActions, PageListProps } from "@saleor/types";
import { toggle } from "@saleor/utils/lists";
import { ProductListUrlFilters } from "../../urls";
import ProductListFilter from "../ProductListFilter";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductListUrlFilters> {
  currencySymbol: string;
  products: CategoryDetails_category_products_edges_node[];
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
    filterTabs,
    initialSearch,
    settings,
    onAdd,
    onAll,
    onSearchChange,
    onFilterAdd,
    onFilterSave,
    onTabChange,
    onFilterDelete,
    onUpdateListSettings,
    ...listProps
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const [selectedColumns, setSelectedColumns] = useStateFromProps(
    settings.columns
  );

  const handleCancel = React.useCallback(
    () => setSelectedColumns(settings.columns),
    [settings.columns]
  );

  const handleColumnToggle = (column: ProductListColumns) =>
    setSelectedColumns(prevSelectedColumns =>
      toggle(column, prevSelectedColumns, (a, b) => a === b)
    );

  const handleReset = () => setSelectedColumns(defaultSettings.columns);

  const handleSave = () => onUpdateListSettings("columns", selectedColumns);

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
    }
  ];

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.products)}>
        <ColumnPicker
          className={classes.columnPicker}
          columns={columns}
          selectedColumns={selectedColumns}
          onColumnToggle={handleColumnToggle}
          onCancel={handleCancel}
          onReset={handleReset}
          onSave={handleSave}
        />
        <Button onClick={onAdd} color="primary" variant="contained">
          <FormattedMessage defaultMessage="Add Product" description="button" />
          <AddIcon />
        </Button>
      </PageHeader>
      <Card>
        <ProductListFilter
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Products",
            description: "tab name"
          })}
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          filterLabel={intl.formatMessage({
            defaultMessage: "Select all products where:"
          })}
          filterTabs={filterTabs}
          filtersList={filtersList}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Products..."
          })}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onFilterAdd={onFilterAdd}
          onFilterSave={onFilterSave}
          onTabChange={onTabChange}
          onFilterDelete={onFilterDelete}
        />
        <ProductList
          {...listProps}
          settings={{ ...settings, columns: selectedColumns }}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Card>
    </Container>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
