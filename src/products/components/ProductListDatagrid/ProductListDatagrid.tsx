import { textCell } from "@dashboard/components/Datagrid/cells";
import Datagrid, {
  GetCellContentOpts,
} from "@dashboard/components/Datagrid/Datagrid";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import React from "react";

interface ProductListDatagridProps {
  products: RelayToFlat<ProductListQuery["products"]>;
}

export const ProductListDatagrid: React.FC<ProductListDatagridProps> = ({
  products,
}) => {
  const columns: AvailableColumn[] = [
    {
      id: "name",
      title: "Name",
      width: 200,
    },
    {
      id: "productType",
      title: "Type",
      width: 200,
    },
    {
      id: "availability",
      title: "Availability",
      width: 200,
    },
  ];

  const getCellContent = (
    [column, row]: Item,
    opts: GetCellContentOpts,
  ): GridCell => {
    const columnId = columns[column].id;
    const change =
      opts.changes.current[opts.getChangeIndex(columnId, row)].data;
    const dataRow = opts.added.includes(row)
      ? undefined
      : products[row + opts.removed.filter(r => r <= row).length];

    return textCell(change ?? dataRow ? dataRow[columnId] : "");
  };

  const getCellError = () => false;

  const onChange = () => null;

  return (
    <Datagrid
      addButtonLabel="Add new product"
      availableColumns={columns}
      emptyText="Empty text"
      getCellContent={getCellContent}
      getCellError={getCellError}
      menuItems={() => []}
      rows={products?.length ?? 0}
      selectionActions={() => <button>Remove</button>}
      title={"Products"}
      fullScreenTitle={"Products"}
      onChange={onChange}
    />
  );
};
