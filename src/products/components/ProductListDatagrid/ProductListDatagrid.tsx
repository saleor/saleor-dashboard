import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import { DatagridChangeStateContext } from "@dashboard/components/Datagrid/useDatagridChange";
import Savebar from "@dashboard/components/Savebar";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductListColumns } from "@dashboard/config";
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { ProductListUrlSortField } from "@dashboard/products/urls";
import { useSearchProductTypes } from "@dashboard/searches/useProductTypeSearch";
import { ListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { Button, EditIcon, makeStyles } from "@saleor/macaw-ui";
import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { ProductListDatagridSkeleton } from "./ProductListDatagridSkeleton";
import { useProductForm } from "./useProductForm";
import { createGetCellContent, getColumns } from "./utils";

interface ProductListDatagridProps
  extends ListProps<ProductListColumns>,
    SortPage<ProductListUrlSortField> {
  products: RelayToFlat<ProductListQuery["products"]>;
  channels: ChannelFragment[];
  onRowClick: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    paginationContainer: {
      padding: theme.spacing(0, 4),
    },
  }),
  { name: "ProductListPage" },
);

export const ProductListDatagrid: React.FC<ProductListDatagridProps> = ({
  products,
  onRowClick,
  channels,
  settings,
  onUpdateListSettings,
  onSort,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const searchProductType = useSearchProductTypes();
  const { onChange, isDirty, onSubmit, datagrid, clear } = useProductForm();

  const columns = useMemo(() => getColumns(channels, intl), [channels, intl]);

  const getCellContent = useMemo(
    () => createGetCellContent(columns, products, searchProductType),
    [columns, products, searchProductType],
  );

  const onHeaderMenuClick = useCallback(
    (col: number) => {
      onSort(columns[col].id as ProductListUrlSortField);
    },
    [columns, onSort],
  );

  const getCellError = () => false;

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      {products?.length ? (
        <>
          <Datagrid
            addButtonLabel={intl.formatMessage(messages.addProduct)}
            availableColumns={columns}
            onHeaderMenuClick={onHeaderMenuClick}
            emptyText={intl.formatMessage(messages.emptyText)}
            getCellContent={getCellContent}
            getCellError={getCellError}
            menuItems={index => [
              {
                label: intl.formatMessage(messages.editProduct),
                onSelect: () => onRowClick(products[index].id),
                Icon: <EditIcon />,
              },
            ]}
            rows={products?.length ?? 0}
            selectionActions={(indexes, { removeRows }) => (
              <Button variant="tertiary" onClick={() => removeRows(indexes)}>
                <FormattedMessage {...buttonMessages.delete} />
              </Button>
            )}
            title=""
            fullScreenTitle={intl.formatMessage(messages.products)}
            onChange={onChange}
          />

          <div className={classes.paginationContainer}>
            <TablePaginationWithContext
              component="div"
              colSpan={
                (products?.length === 0 ? 1 : 2) + settings.columns.length
              }
              settings={settings}
              onUpdateListSettings={onUpdateListSettings}
            />
          </div>
          {isDirty && (
            <Savebar
              onCancel={clear}
              onSubmit={onSubmit}
              state="default"
              disabled={false}
              labels={{
                cancel: intl.formatMessage(buttonMessages.clear),
              }}
            />
          )}
        </>
      ) : (
        <ProductListDatagridSkeleton />
      )}
    </DatagridChangeStateContext.Provider>
  );
};
