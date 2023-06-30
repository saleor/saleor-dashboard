import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { CollectionListQuery } from "@dashboard/graphql";
import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";

export const collectionListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<CollectionListUrlSortField>,
): AvailableColumn[] =>
  [
    {
      id: "name",
      title: intl.formatMessage(columnsMessages.name),
      width: 200,
    },
    {
      id: "productCount",
      title: intl.formatMessage(columnsMessages.noOfProducts),
      width: 200,
    },
    {
      id: "available",
      title: intl.formatMessage(columnsMessages.availability),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const createGetCellContent =
  ({
    collections,
    columns,
    intl,
  }: {
    collections: RelayToFlat<CollectionListQuery["collections"]>;
    columns: AvailableColumn[];
    intl: IntlShape;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = collections[row];
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData.name);
      case "productCount":
        return readonlyTextCell(rowData.products.totalCount.toString());
      case "available":
        return readonlyTextCell(
          rowData?.channelListings?.length
            ? intl.formatMessage(messages.dropdownLabel, {
                channelCount: rowData?.channelListings?.length,
              })
            : intl.formatMessage(messages.noChannels),
        );
    }
  };
