import { Collection, Collections } from "@dashboard/collections/types";
import { CollectionListUrlSortField } from "@dashboard/collections/urls";
import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
import {
  CollectionChannels,
  getChannelAvailabilityColor,
  getChannelAvailabilityLabel,
  getDropdownColor,
} from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import {
  readonlyTextCell,
  tagsCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { getStatusColor } from "@dashboard/misc";
import { Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { DefaultTheme } from "@saleor/macaw-ui-next";
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
      width: 350,
    },
    {
      id: "productCount",
      title: intl.formatMessage(columnsMessages.noOfProducts),
      width: 200,
    },
    {
      id: "availability",
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
    currentTheme,
  }: {
    collections: Collections;
    columns: AvailableColumn[];
    intl: IntlShape;
    selectedChannelId: string;
    currentTheme: DefaultTheme;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData = collections[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    const channel = rowData.channelListings?.find(
      (listing: CollectionChannels) => listing.channel.id === selectedChannelId,
    );

    switch (columnId) {
      case "name":
        return readonlyTextCell(rowData.name);
      case "productCount":
        return readonlyTextCell(
          rowData?.products?.totalCount?.toString() ?? "",
        );
      case "availability": {
        const { label, color } = !!channel
          ? getAvailabilityLabelWhenSelectedChannel(channel, intl, currentTheme)
          : getAvailabilityLabel(rowData, intl, currentTheme);

        return tagsCell(
          [
            {
              tag: label,
              color,
            },
          ],
          [label],
          {
            cursor: "pointer",
            readonly: true,
            allowOverlay: false,
          },
        );
      }
      default:
        return readonlyTextCell("");
    }
  };

export function getAvailabilityLabelWhenSelectedChannel(
  channel: CollectionChannels,
  intl: IntlShape,
  currentTheme: DefaultTheme,
) {
  const color = getStatusColor({
    status: getChannelAvailabilityColor(channel),
    currentTheme,
  });

  return {
    label: intl.formatMessage(getChannelAvailabilityLabel(channel)),
    color: color.base,
  };
}

export function getAvailabilityLabel(
  rowData: Collection,
  intl: IntlShape,
  currentTheme: DefaultTheme,
) {
  const availabilityLabel = rowData?.channelListings?.length
    ? intl.formatMessage(messages.dropdownLabel, {
        channelCount: rowData?.channelListings?.length,
      })
    : intl.formatMessage(messages.noChannels);

  const color = getStatusColor({
    status: getDropdownColor(rowData?.channelListings || []),
    currentTheme,
  });

  return {
    label: availabilityLabel,
    color: color.base,
  };
}
