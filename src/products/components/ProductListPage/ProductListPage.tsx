import { Button, Card } from "@material-ui/core";
import Alert from "@saleor/components/Alert/Alert";
import CardMenu from "@saleor/components/CardMenu";
import ColumnPicker, {
  ColumnPickerChoice
} from "@saleor/components/ColumnPicker";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { ProductListColumns } from "@saleor/config";
import { sectionNames } from "@saleor/intl";
import { AvailableInGridAttributes_availableInGrid_edges_node } from "@saleor/products/types/AvailableInGridAttributes";
import { GridAttributes_grid_edges_node } from "@saleor/products/types/GridAttributes";
import { ProductList_products_edges_node } from "@saleor/products/types/ProductList";
import { makeStyles } from "@saleor/theme";
import {
  ChannelProps,
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  SortPage
} from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField } from "../../urls";
import ProductList from "../ProductList";
import {
  createFilterStructure,
  ProductFilterKeys,
  ProductListFilterOpts
} from "./filters";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
    FetchMoreProps,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  availableInGridAttributes: AvailableInGridAttributes_availableInGrid_edges_node[];
  channelsCount: number;
  currencySymbol: string;
  gridAttributes: GridAttributes_grid_edges_node[];
  limits: RefreshLimits_shop_limits;
  totalGridAttributes: number;
  products: ProductList_products_edges_node[];
  onExport: () => void;
}

const useStyles = makeStyles(
  theme => ({
    columnPicker: {
      marginRight: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        "& > button": {
          width: "100%"
        }
      }
    },
    settings: {
      marginRight: theme.spacing(2)
    }
  }),
  { name: "ProductListPage" }
);

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    channelsCount,
    currencySymbol,
    currentTab,
    defaultSettings,
    gridAttributes,
    limits,
    availableInGridAttributes,
    filterOpts,
    hasMore,
    initialSearch,
    loading,
    settings,
    tabs,
    totalGridAttributes,
    onAdd,
    onAll,
    onExport,
    onFetchMore,
    onFilterChange,
    onFilterAttributeFocus,
    onSearchChange,
    onTabChange,
    onTabDelete,
    onTabSave,
    onUpdateListSettings,
    selectedChannelId,
    ...listProps
  } = props;
  const intl = useIntl();
  const classes = useStyles(props);

  const handleSave = (columns: ProductListColumns[]) =>
    onUpdateListSettings("columns", columns);

  const filterStructure = createFilterStructure(intl, filterOpts);

  const columns: ColumnPickerChoice[] = [
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

  const limitReached = isLimitReached(limits, "productVariants");

  return (
    <Container>
      <PageHeader
        title={intl.formatMessage(sectionNames.products)}
        limit={
          hasLimits(limits, "productVariants") && {
            data: limits,
            key: "productVariants",
            text: "SKUs used"
          }
        }
      >
        <CardMenu
          className={classes.settings}
          menuItems={[
            {
              label: intl.formatMessage({
                defaultMessage: "Export Products",
                description: "export products to csv file, button"
              }),
              onSelect: onExport,
              testId: "export"
            }
          ]}
          data-test="menu"
        />
        <ColumnPicker
          className={classes.columnPicker}
          columns={columns}
          defaultColumns={defaultSettings.columns}
          hasMore={hasMore}
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
          disabled={limitReached}
          onClick={onAdd}
          color="primary"
          variant="contained"
          data-test="add-product"
        >
          <FormattedMessage
            defaultMessage="Create Product"
            description="button"
          />
        </Button>
      </PageHeader>
      <Alert
        show={limitReached}
        title={intl.formatMessage({
          defaultMessage: "SKU limit reached",
          description: "alert"
        })}
      >
        <FormattedMessage defaultMessage="You have reached your SKU limit, you will be no longer able to add SKUs to your store. If you would like to up your limit, contact your administration staff about raising your limits." />
      </Alert>
      <Card>
        <FilterBar
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          initialSearch={initialSearch}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onFilterAttributeFocus={onFilterAttributeFocus}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
          tabs={tabs}
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Products",
            description: "tab name"
          })}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Products..."
          })}
        />
        <ProductList
          {...listProps}
          loading={loading}
          gridAttributes={gridAttributes}
          settings={settings}
          channelsCount={channelsCount}
          selectedChannelId={selectedChannelId}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Card>
    </Container>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
