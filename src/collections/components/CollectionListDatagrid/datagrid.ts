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
import { DefaultTheme, ThemeTokensValues } from "@saleor/macaw-ui/next";
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
    theme,
    currentTheme,
  }: {
    collections: Collections;
    columns: AvailableColumn[];
    intl: IntlShape;
    selectedChannelId: string;
    theme: ThemeTokensValues;
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
      case "availability":
        const { label, color } = !!channel
          ? getAvailablilityLabelWhenSelectedChannel(
              channel,
              intl,
              currentTheme,
              theme,
            )
          : getAvailablilityLabel(rowData, intl, currentTheme, theme);

        return tagsCell(
          [
            {
              tag: label,
              color,
            },
          ],
          [label],
          {
            readonly: true,
            allowOverlay: false,
          },
        );
      default:
        return readonlyTextCell("");
    }
  };

export function getAvailablilityLabelWhenSelectedChannel(
  channel: CollectionChannels,
  intl: IntlShape,
  currentTheme: DefaultTheme,
  theme: ThemeTokensValues,
) {
  const color = getStatusColor(
    getChannelAvailabilityColor(channel),
    currentTheme,
  );

  return {
    label: intl.formatMessage(getChannelAvailabilityLabel(channel)),
    color: getTagCellColor(color, theme),
  };
}

export function getAvailablilityLabel(
  rowData: Collection,
  intl: IntlShape,
  currentTheme: DefaultTheme,
  theme: ThemeTokensValues,
) {
  const availablilityLabel = rowData?.channelListings?.length
    ? intl.formatMessage(messages.dropdownLabel, {
        channelCount: rowData?.channelListings?.length,
      })
    : intl.formatMessage(messages.noChannels);

  const availablilityLabelColor = getStatusColor(
    getDropdownColor(rowData?.channelListings || []),
    currentTheme,
  );

  return {
    label: availablilityLabel,
    color: getTagCellColor(availablilityLabelColor, theme),
  };
}

function getTagCellColor(
  color: string,
  currentTheme: ThemeTokensValues,
): string {
  if (color.startsWith("#")) {
    return color;
  }

  return currentTheme.colors.background[
    color as keyof ThemeTokensValues["colors"]["background"]
  ];
}
