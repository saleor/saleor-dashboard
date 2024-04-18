import { ChannelData } from "@dashboard/channels/utils";
import { ColumnCategory } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import {
  AttributeInputTypeEnum,
  ProductFragment,
  useGridWarehousesLazyQuery,
  useWarehouseListLazyQuery,
  WarehouseFragment,
} from "@dashboard/graphql";
import { useClientPagination } from "@dashboard/hooks/useClientPagination";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
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
  const [channelQuery, setChannelQuery] = React.useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();
  const paginatedChannels = paginate(
    (listings ?? [])?.filter(channel =>
      channel.name.toLowerCase().includes(channelQuery.toLowerCase()),
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
  const [channelQuery, setChannelQuery] = React.useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();
  const paginatedChannels = paginate(
    (listings ?? []).filter(channel =>
      channel.name.toLowerCase().includes(channelQuery.toLowerCase()),
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
  const [attributeQuery, setAttributeQuery] = React.useState("");
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

export const parseAttributeColumns = (
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
  const [warehouseQuery, setWarehouseQuery] = React.useState("");
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

export const getAvailableWarehousesData = ({
  availableWarehouses,
  initialWarehouses,
}: {
  availableWarehouses: ReturnType<typeof useWarehouseListLazyQuery>[1];
  initialWarehouses: ReturnType<typeof useGridWarehousesLazyQuery>[1];
}) =>
  mapEdgesToItems(availableWarehouses.data?.warehouses) ??
  (availableWarehouses.loading
    ? undefined
    : mapEdgesToItems(initialWarehouses.data?.availableWarehouses) ?? []);

const parseWarehousesColumns = (data: WarehouseFragment[] | undefined, intl: IntlShape) => {
  return data?.map(warehouse => ({
    id: `warehouse:${warehouse.id}`,
    group: intl.formatMessage(messages.warehouses),
    metaGroup: intl.formatMessage(messages.warehouses),
    title: warehouse.name,
    width: 150,
  }));
};

// Reuse when fixing #4165
export const getWarehousesFetchMoreProps = ({
  queryAvailableWarehouses,
  availableWarehousesData,
  gridWarehousesData,
}: {
  queryAvailableWarehouses: ReturnType<typeof useWarehouseListLazyQuery>[0];
  availableWarehousesData: ReturnType<typeof useWarehouseListLazyQuery>[1];
  gridWarehousesData: ReturnType<typeof useGridWarehousesLazyQuery>[1];
}) => {
  const onNextPage = (query: string) =>
    queryAvailableWarehouses({
      variables: {
        filter: {
          search: query,
        },
        after:
          availableWarehousesData.data?.warehouses?.pageInfo.endCursor ??
          gridWarehousesData.data?.availableWarehouses?.pageInfo.endCursor,
        first: 10,
        last: null,
        before: null,
      },
    });
  const onPreviousPage = (query: string) =>
    queryAvailableWarehouses({
      variables: {
        filter: {
          search: query,
        },
        before: availableWarehousesData.data?.warehouses?.pageInfo.startCursor,
        last: 10,
        first: null,
        after: null,
      },
    });
  const hasNextPage =
    availableWarehousesData.data?.warehouses?.pageInfo?.hasNextPage ??
    gridWarehousesData.data?.availableWarehouses?.pageInfo?.hasNextPage ??
    false;
  const hasPreviousPage =
    availableWarehousesData.data?.warehouses?.pageInfo?.hasPreviousPage ?? false;
  return {
    hasNextPage,
    hasPreviousPage,
    onNextPage,
    onPreviousPage,
  };
};

const prefix = "warehouse";

export function getWarehouseColumnValue(id: string) {
  return `${prefix}:${id}`;
}

export function isWarehouseColumnValue(value: string) {
  return value?.includes(`${prefix}:`);
}

export function getWarehouseIdFromColumnValue(value: string) {
  return value.substr(prefix.length + 1);
}
