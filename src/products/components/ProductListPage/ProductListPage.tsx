import { Card } from "@material-ui/core";
import {
  extensionMountPoints,
  mapToMenuItems,
  useExtensions,
} from "@saleor/apps/useExtensions";
import { ButtonWithSelect } from "@saleor/components/ButtonWithSelect";
import CardMenu from "@saleor/components/CardMenu";
import ColumnPicker from "@saleor/components/ColumnPicker";
import Container from "@saleor/components/Container";
import { getByName } from "@saleor/components/Filter/utils";
import FilterBar from "@saleor/components/FilterBar";
import LimitReachedAlert from "@saleor/components/LimitReachedAlert";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PageHeader from "@saleor/components/PageHeader";
import { ProductListColumns } from "@saleor/config";
import {
  GridAttributesQuery,
  ProductListQuery,
  RefreshLimitsQuery,
  SearchAvailableInGridAttributesQuery,
} from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import {
  ChannelProps,
  FetchMoreProps,
  FilterPageProps,
  ListActions,
  PageListProps,
  RelayToFlat,
  SortPage,
} from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductListUrlSortField } from "../../urls";
import ProductList from "../ProductList";
import { columnsMessages } from "../ProductList/messages";
import {
  createFilterStructure,
  ProductFilterKeys,
  ProductListFilterOpts,
} from "./filters";
import { getAttributeColumnValue } from "./utils";

export interface ProductListPageProps
  extends PageListProps<ProductListColumns>,
    ListActions,
    FilterPageProps<ProductFilterKeys, ProductListFilterOpts>,
    FetchMoreProps,
    SortPage<ProductListUrlSortField>,
    ChannelProps {
  activeAttributeSortId: string;
  availableInGridAttributes: RelayToFlat<
    SearchAvailableInGridAttributesQuery["availableInGrid"]
  >;
  columnQuery: string;
  currencySymbol: string;
  gridAttributes: RelayToFlat<GridAttributesQuery["grid"]>;
  limits: RefreshLimitsQuery["shop"]["limits"];
  products: RelayToFlat<ProductListQuery["products"]>;
  onAdd: () => void;
  onExport: () => void;
  onColumnQueryChange: (query: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    columnPicker: {
      marginRight: theme.spacing(3),
      [theme.breakpoints.down("xs")]: {
        "& > button": {
          width: "100%",
        },
      },
    },
    settings: {
      [theme.breakpoints.up("sm")]: {
        marginRight: theme.spacing(2),
      },
    },
  }),
  { name: "ProductListPage" },
);

export const ProductListPage: React.FC<ProductListPageProps> = props => {
  const {
    columnQuery,
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
    onAdd,
    onAll,
    onColumnQueryChange,
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

  const staticColumns = [
    {
      label: intl.formatMessage(columnsMessages.availability),
      value: "availability" as ProductListColumns,
    },
    {
      label: intl.formatMessage(columnsMessages.price),
      value: "price" as ProductListColumns,
    },
    {
      label: intl.formatMessage(columnsMessages.type),
      value: "productType" as ProductListColumns,
    },
    {
      label: intl.formatMessage(columnsMessages.updatedAt),
      value: "date" as ProductListColumns,
    },
  ];

  const initialColumnsChoices = React.useMemo(() => {
    const selectedStaticColumns = staticColumns.filter(column =>
      (settings.columns || []).includes(column.value),
    );
    const selectedAttributeColumns = gridAttributes.map(attribute => ({
      label: attribute.name,
      value: getAttributeColumnValue(attribute.id),
    }));

    return [...selectedStaticColumns, ...selectedAttributeColumns];
  }, [gridAttributes, settings.columns]);

  const handleSave = (columns: ProductListColumns[]) =>
    onUpdateListSettings("columns", columns);

  const filterStructure = createFilterStructure(intl, filterOpts);

  const filterDependency = filterStructure.find(getByName("channel"));

  const availableColumns: MultiAutocompleteChoiceType[] = [
    ...staticColumns,
    ...availableInGridAttributes.map(
      attribute =>
        ({
          label: attribute.name,
          value: getAttributeColumnValue(attribute.id),
        } as MultiAutocompleteChoiceType),
    ),
  ];

  const limitReached = isLimitReached(limits, "productVariants");
  const {
    PRODUCT_OVERVIEW_CREATE,
    PRODUCT_OVERVIEW_MORE_ACTIONS,
  } = useExtensions(extensionMountPoints.PRODUCT_LIST);

  const extensionMenuItems = mapToMenuItems(PRODUCT_OVERVIEW_MORE_ACTIONS);
  const extensionCreateButtonItems = mapToMenuItems(PRODUCT_OVERVIEW_CREATE);

  return (
    <Container>
      <PageHeader
        cardMenu={
          <CardMenu
            className={classes.settings}
            menuItems={[
              {
                label: intl.formatMessage({
                  id: "7FL+WZ",
                  defaultMessage: "Export Products",
                  description: "export products to csv file, button",
                }),
                onSelect: onExport,
                testId: "export",
              },
              ...extensionMenuItems,
            ]}
            data-test-id="menu"
          />
        }
        title={intl.formatMessage(sectionNames.products)}
        limitText={
          hasLimits(limits, "productVariants") &&
          intl.formatMessage(
            {
              id: "Kw0jHS",
              defaultMessage: "{count}/{max} SKUs used",
              description: "created products counter",
            },
            {
              count: limits.currentUsage.productVariants,
              max: limits.allowedUsage.productVariants,
            },
          )
        }
      >
        <ColumnPicker
          className={classes.columnPicker}
          availableColumns={availableColumns}
          initialColumns={initialColumnsChoices}
          defaultColumns={defaultSettings.columns}
          hasMore={hasMore}
          loading={loading}
          query={columnQuery}
          onQueryChange={onColumnQueryChange}
          onFetchMore={onFetchMore}
          onSave={handleSave}
        />
        <ButtonWithSelect
          options={extensionCreateButtonItems}
          data-test-id="add-product"
          disabled={limitReached}
          onClick={onAdd}
        >
          <FormattedMessage
            id="JFmOfi"
            defaultMessage="Create Product"
            description="button"
          />
        </ButtonWithSelect>
      </PageHeader>
      {limitReached && (
        <LimitReachedAlert
          title={intl.formatMessage({
            id: "FwHWUm",
            defaultMessage: "SKU limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="5Vwnu+"
            defaultMessage="You have reached your SKU limit, you will be no longer able to add SKUs to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}
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
            id: "aFLtLk",
            defaultMessage: "All Products",
            description: "tab name",
          })}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            id: "kIvvax",
            defaultMessage: "Search Products...",
          })}
        />
        <ProductList
          {...listProps}
          gridAttributes={gridAttributes}
          settings={settings}
          selectedChannelId={selectedChannelId}
          onUpdateListSettings={onUpdateListSettings}
          filterDependency={filterDependency}
        />
      </Card>
    </Container>
  );
};
ProductListPage.displayName = "ProductListPage";
export default ProductListPage;
