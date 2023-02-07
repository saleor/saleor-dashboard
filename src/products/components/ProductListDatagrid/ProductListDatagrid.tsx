import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/useDatagridChange";
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { EditIcon } from "@saleor/macaw-ui";
import React, { useMemo } from "react";

import { createGetCellContent, getColumns } from "./utils";

interface ProductListDatagridProps {
  products: RelayToFlat<ProductListQuery["products"]>;
  channels: ChannelFragment[];
  onRowClick: (id: string) => void;
}

export const ProductListDatagrid: React.FC<ProductListDatagridProps> = ({
  products,
  onRowClick,
  channels,
}) => {
  const datagrid = useDatagridChangeState();

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
    </DatagridChangeStateContext.Provider>
  );
};
