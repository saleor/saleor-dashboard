import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductListColumns } from "@dashboard/config";
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { useSearchProductTypes } from "@dashboard/searches/useProductTypeSearch";
import { ListProps, RelayToFlat } from "@dashboard/types";
import { Button, EditIcon, makeStyles } from "@saleor/macaw-ui";
import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { createGetCellContent, getColumns } from "./utils";

interface ProductListDatagridProps extends ListProps<ProductListColumns> {
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
}) => {
  const datagrid = useDatagridChangeState();
  const classes = useStyles();
  const intl = useIntl();
  const searchProductType = useSearchProductTypes();

  const columns = useMemo(() => getColumns(channels), [channels]);

  const getCellContent = useMemo(
    () => createGetCellContent(columns, products, searchProductType),
    [columns, products, searchProductType],
  );

  const getCellError = () => false;

  const onChange = () => null;

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        addButtonLabel={intl.formatMessage(messages.addProduct)}
        availableColumns={columns}
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
          colSpan={(products?.length === 0 ? 1 : 2) + settings.columns.length}
          settings={settings}
          onUpdateListSettings={onUpdateListSettings}
        />
      </div>
    </DatagridChangeStateContext.Provider>
  );
};
