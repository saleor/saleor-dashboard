import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
import { getChannelAvailabilityLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import { readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { CollectionListQuery } from "@dashboard/graphql";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape } from "react-intl";

import { columnsMessages } from "./messages";

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
    selectedChannelId,
  }: {
    collections: RelayToFlat<CollectionListQuery["collections"]>;
    columns: AvailableColumn[];
    intl: IntlShape;
    selectedChannelId: string;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = collections[row];
    const columnId = columns[column]?.id;

    if (!columnId) {
      return readonlyTextCell("");
    }

    const channel = rowData?.channelListings?.find(
      listing => listing.channel.id === selectedChannelId,
    );

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData.name);
      case "productCount":
        return readonlyTextCell(rowData.products.totalCount.toString());
      case "available":
        if (!!channel) {
          return readonlyTextCell(
            intl.formatMessage(getChannelAvailabilityLabel(channel)),
          );
        }

        return readonlyTextCell(
          rowData?.channelListings?.length
            ? intl.formatMessage(messages.dropdownLabel, {
                channelCount: rowData?.channelListings?.length,
              })
            : intl.formatMessage(messages.noChannels),
        );
    }
  };
