import { type Collection, type Collections } from "@dashboard/collections/types";
import { type CollectionListUrlSortField } from "@dashboard/collections/urls";
import { messages } from "@dashboard/components/ChannelsAvailabilityDropdown/messages";
import {
  type CollectionChannels,
  getChannelAvailabilityLabel,
  getChannelAvailabilityStatus,
  getDropdownStatus,
} from "@dashboard/components/ChannelsAvailabilityDropdown/utils";
import { readonlyTextCell, statusCell } from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

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
  }: {
    collections: Collections;
    columns: AvailableColumn[];
    intl: IntlShape;
    selectedChannelId: string;
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
        return readonlyTextCell(rowData?.products?.totalCount?.toString() ?? "");
      case "availability": {
        const { label, status } = channel
          ? getAvailabilityLabelWhenSelectedChannel(channel, intl)
          : getAvailabilityLabel(rowData, intl);

        return statusCell(status, label, {
          cursor: "pointer",
          readonly: true,
          allowOverlay: false,
        });
      }
      default:
        return readonlyTextCell("");
    }
  };

export function getAvailabilityLabelWhenSelectedChannel(
  channel: CollectionChannels,
  intl: IntlShape,
): { label: string; status: DotStatus } {
  return {
    label: intl.formatMessage(getChannelAvailabilityLabel(channel)),
    status: getChannelAvailabilityStatus(channel),
  };
}

export function getAvailabilityLabel(
  rowData: Collection,
  intl: IntlShape,
): { label: string; status: DotStatus } {
  const listings = rowData?.channelListings || [];
  const label = listings.length
    ? intl.formatMessage(messages.dropdownLabel, {
        channelCount: listings.length,
      })
    : intl.formatMessage(messages.noChannels);

  return {
    label,
    status: getDropdownStatus(listings),
  };
}
