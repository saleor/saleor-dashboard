import { ChannelData } from "@dashboard/channels/utils";
import { ColumnCategory } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { AttributeInputTypeEnum, ProductFragment, WarehouseFragment } from "@dashboard/graphql";
import { useClientPagination } from "@dashboard/hooks/useClientPagination";
import { useState } from "react";
import { IntlShape } from "react-intl";

import messages from "./messages";

export const variantsStaticColumnsAdapter = (intl: IntlShape) => [
  {
    id: "name",
    title: intl.formatMessage(messages.name),
    width: 200,
    group: " ",
  },
  {
    id: "sku",
    title: intl.formatMessage(messages.sku),
    width: 200,
    group: " ",
  },
];

export const useChannelAdapter = ({
  intl,
  selectedColumns,
  listings,
}: {
  intl: IntlShape;
  selectedColumns: string[] | undefined;
  listings: ChannelData[] | undefined;
}): ColumnCategory => {
  const [channelQuery, setChannelQuery] = useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();
  const paginatedChannels = paginate(
    (listings ?? [])?.filter(channel =>
      channel.name.toLowerCase().includes(channelQuery?.toLowerCase()),
    ),
  );
  const selectedChannels = selectedColumns
    ? listings?.filter(channel => selectedColumns.includes(`channel:${channel.id}`))
    : undefined;

  return {
    name: intl.formatMessage(messages.channel),
    prefix: "channel",
    children: ["availableInChannel"],
    availableNodes: parseChannelColumns(paginatedChannels.data, intl),
    selectedNodes: parseChannelColumns(selectedChannels, intl),
    onSearch: query => setChannelQuery(query),
    initialSearch: channelQuery,
    hasNextPage: paginatedChannels.hasNextPage,
    hasPreviousPage: paginatedChannels.hasPreviousPage,
    onNextPage: () => changeCurrentPage(currentPage + 1),
    onPreviousPage: () => changeCurrentPage(currentPage - 1),
  };
};

export const useChannelAvailabilityAdapter = ({
  intl,
  selectedColumns,
  listings,
}: {
  intl: IntlShape;
  selectedColumns: string[] | undefined;
  listings: ChannelData[];
}): ColumnCategory => {
  const [channelQuery, setChannelQuery] = useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();
  const paginatedChannels = paginate(
    (listings ?? []).filter(channel =>
      channel.name.toLowerCase().includes(channelQuery?.toLowerCase()),
    ),
  );
  const selectedChannels = selectedColumns
    ? listings?.filter(channel => selectedColumns.includes(`channel:${channel.id}`))
    : undefined;

  return {
    name: intl.formatMessage(messages.available),
    prefix: "availableInChannel",
    hidden: true,
    availableNodes: parseAvailabilityColumns(paginatedChannels.data, intl),
    selectedNodes: parseAvailabilityColumns(selectedChannels, intl),
    onSearch: query => setChannelQuery(query),
    initialSearch: channelQuery,
    hasNextPage: paginatedChannels.hasNextPage,
    hasPreviousPage: paginatedChannels.hasPreviousPage,
    onNextPage: () => changeCurrentPage(currentPage + 1),
    onPreviousPage: () => changeCurrentPage(currentPage - 1),
  };
};

const parseAvailabilityColumns = (channels: ChannelData[] | undefined, intl: IntlShape) =>
  channels?.map(channel => ({
    id: `availableInChannel:${channel.id}`,
    group: channel.name,
    title: intl.formatMessage(messages.available),
    width: 80,
  }));
const parseChannelColumns = (
  channels: ChannelData[] | undefined,
  intl: IntlShape,
): AvailableColumn[] | undefined =>
  channels?.map(channel => ({
    id: `channel:${channel.id}`,
    group: channel.name,
    metaGroup: intl.formatMessage(messages.channel),
    pickerTitle: channel.name,
    title: intl.formatMessage(messages.price),
    width: 150,
  }));

export const useAttributesAdapter = ({
  intl,
  selectedColumns,
  attributes,
}: {
  intl: IntlShape;
  selectedColumns: string[] | undefined;
  attributes: ProductFragment["productType"]["variantAttributes"];
}) => {
  const supportedAttributes = attributes?.filter(attribute => {
    if (!attribute.inputType) {
      return false;
    }

    return [AttributeInputTypeEnum.DROPDOWN, AttributeInputTypeEnum.PLAIN_TEXT].includes(
      attribute.inputType,
    );
  });
  const [attributeQuery, setAttributeQuery] = useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();
  const paginatedAttributes = paginate(
    (supportedAttributes ?? []).filter(attribute =>
      attribute.name?.toLowerCase().includes(attributeQuery.toLowerCase()),
    ),
  );
  const selectedAttributes = selectedColumns
    ? attributes?.filter(attribute => selectedColumns.includes(`attribute:${attribute.id}`))
    : undefined;

  return {
    name: intl.formatMessage(messages.attributes),
    prefix: "attribute",
    availableNodes: parseAttributeColumns(paginatedAttributes.data, intl),
    selectedNodes: parseAttributeColumns(selectedAttributes, intl),
    onSearch: (query: string) => setAttributeQuery(query),
    initialSearch: attributeQuery,
    hasNextPage: paginatedAttributes.hasNextPage,
    hasPreviousPage: paginatedAttributes.hasPreviousPage,
    onNextPage: () => changeCurrentPage(currentPage + 1),
    onPreviousPage: () => changeCurrentPage(currentPage - 1),
  };
};

const parseAttributeColumns = (
  attributes: ProductFragment["productType"]["variantAttributes"] | undefined,
  intl: IntlShape,
): AvailableColumn[] | undefined =>
  attributes?.map(attribute => ({
    id: `attribute:${attribute.id}`,
    group: intl.formatMessage(messages.attributes),
    metaGroup: intl.formatMessage(messages.attributes),
    title: attribute.name ?? "",
    width: 150,
  }));

export const useWarehouseAdapter = ({
  intl,
  selectedColumns,
  warehouses,
}: {
  intl: IntlShape;
  selectedColumns: string[] | undefined;
  warehouses: WarehouseFragment[] | undefined;
}) => {
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();
  const paginatedWarehouses = paginate(
    (warehouses ?? []).filter(warehouse =>
      warehouse.name?.toLowerCase().includes(warehouseQuery.toLowerCase()),
    ),
  );
  const filteredWarehouses = selectedColumns
    ? warehouses?.filter(warehouse => selectedColumns.includes(`warehouse:${warehouse.id}`))
    : undefined;

  return {
    name: intl.formatMessage(messages.warehouses),
    prefix: "warehouse",
    availableNodes: parseWarehousesColumns(paginatedWarehouses.data, intl),
    selectedNodes: parseWarehousesColumns(filteredWarehouses, intl),
    onSearch: (query: string) => setWarehouseQuery(query),
    initialSearch: warehouseQuery,
    hasNextPage: paginatedWarehouses.hasNextPage,
    hasPreviousPage: paginatedWarehouses.hasPreviousPage,
    onNextPage: () => changeCurrentPage(currentPage + 1),
    onPreviousPage: () => changeCurrentPage(currentPage - 1),
  };
};

const parseWarehousesColumns = (data: WarehouseFragment[] | undefined, intl: IntlShape) => {
  return data?.map(warehouse => ({
    id: `warehouse:${warehouse.id}`,
    group: intl.formatMessage(messages.warehouses),
    metaGroup: intl.formatMessage(messages.warehouses),
    title: warehouse.name,
    width: 150,
  }));
};
