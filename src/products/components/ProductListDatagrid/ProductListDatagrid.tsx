import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductListColumns } from "@dashboard/config";
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { ListProps, RelayToFlat } from "@dashboard/types";
import { EditIcon, makeStyles } from "@saleor/macaw-ui";
import React, { useMemo } from "react";

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

  const columns = useMemo(() => getColumns(channels), [channels]);

  const getCellContent = useMemo(
    () => createGetCellContent(columns, products),
    [columns, products],
  );

  const getCellError = () => false;

  const onChange = () => null;

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        addButtonLabel="Add new product"
        availableColumns={columns}
        emptyText="Empty text"
        getCellContent={getCellContent}
        getCellError={getCellError}
        menuItems={index => [
          {
            label: "Edit Variant",
            onSelect: () => onRowClick(products[index].id),
            Icon: <EditIcon />,
          },
        ]}
        rows={products?.length ?? 0}
        selectionActions={() => <button>Remove</button>}
        title={"Products"}
        fullScreenTitle={"Products"}
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
