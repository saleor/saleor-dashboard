import {
  booleanCell,
  dropdownCell,
  textCell,
} from "@dashboard/components/Datagrid/cells";
import Datagrid, {
  GetCellContentOpts,
} from "@dashboard/components/Datagrid/Datagrid";
import { emptyDropdownCellValue } from "@dashboard/components/Datagrid/DropdownCell";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/useDatagridChange";
import { ChannelFragment, ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { EditIcon } from "@saleor/macaw-ui";
import React from "react";

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

  const columns: AvailableColumn[] = [
    {
      id: "name",
      title: "Produt name",
      width: 250,
    },
    {
      id: "productType",
      title: "Product type",
      width: 250,
    },
    ...(channels ?? []).map(channel => ({
      id: `channel:${channel.id}`,
      title: channel.name,
      width: 250,
    })),
  ];

  const getCellContent = (
    [column, row]: Item,
    opts: GetCellContentOpts,
  ): GridCell => {
    const columnId = columns[column].id;
    const change =
      opts.changes.current[opts.getChangeIndex(columnId, row)]?.data;
    const dataRow = opts.added.includes(row)
      ? undefined
      : products[row + opts.removed.filter(r => r <= row).length];

    if (columnId === "productType") {
      const value =
        change?.value ?? {
          label: dataRow?.productType?.name,
          value: dataRow?.productType?.id,
        } ??
        emptyDropdownCellValue;

      return dropdownCell(value, {
        allowCustomValues: false,
        emptyOption: false,
        choices: [
          { label: "Bear", value: "UHJvZHVjdFR5cGU6MTE=" },
          { label: "Cushion", value: "UHJvZHVjdFR5cGU6MTI=" },
          { label: "Audiobook", value: "UHJvZHVjdFR5cGU6MTU=" },
          { label: "Juice", value: "UHJvZHVjdFR5cGU6OQ==" },
          { label: "Music", value: "UHJvZHVjdFR5cGU6OA==" },
        ],
      });
    }

    if (columnId.startsWith("channel")) {
      const channelId = columnId.split(":")[1];
      const selectedChannel = dataRow.channelListings.find(
        chan => chan.channel.id === channelId,
      );

      return booleanCell(change ?? !!selectedChannel ?? false);
    }

    const value = change ?? (dataRow ? dataRow[columnId] : "");
    return textCell(value || "");
  };

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
