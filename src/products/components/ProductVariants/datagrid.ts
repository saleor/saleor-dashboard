// @ts-strict-ignore
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
  selectedColumns: string[];
  listings: ChannelData[];
}): ColumnCategory => {
  const [channelQuery, setChannelQuery] = React.useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();

  const paginatedChannels = paginate(
    listings.filter(channel => channel.name.includes(channelQuery)),
  );

  const selectedChannels = listings.filter(channel =>
    selectedColumns.includes(`channel:${channel.id}`),
  );

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
  selectedColumns: string[];
  listings: ChannelData[];
}): ColumnCategory => {
  const [channelQuery, setChannelQuery] = React.useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();

  const paginatedChannels = paginate(
    listings.filter(channel => channel.name.includes(channelQuery)),
  );

  const selectedChannels = listings.filter(channel =>
    selectedColumns.includes(`channel:${channel.id}`),
  );

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

const parseAvailabilityColumns = (channels: ChannelData[], intl: IntlShape) =>
  channels?.map(channel => ({
    id: `availableInChannel:${channel.id}`,
    group: channel.name,
    metaGroup: null,
    title: intl.formatMessage(messages.available),
    width: 80,
  }));

const parseChannelColumns = (
  channels: ChannelData[],
  intl: IntlShape,
): AvailableColumn[] =>
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
  selectedColumns: string[];
  attributes: ProductFragment["productType"]["variantAttributes"];
}) => {
  const supportedAttributes = attributes.filter(attribute =>
    [
      AttributeInputTypeEnum.DROPDOWN,
      AttributeInputTypeEnum.PLAIN_TEXT,
    ].includes(attribute.inputType),
  );

  const [attributeQuery, setAttributeQuery] = React.useState("");
  const { paginate, currentPage, changeCurrentPage } = useClientPagination();

  const paginatedAttributes = paginate(
    supportedAttributes.filter(attribute =>
      attribute.name.includes(attributeQuery),
    ),
  );

  const selectedAttributes = attributes.filter(attribute =>
    selectedColumns.includes(`attribute:${attribute.id}`),
  );

  return {
    name: intl.formatMessage(messages.attributes),
    prefix: "attribute",
    availableNodes: parseAttributeColumns(paginatedAttributes.data, intl),
    selectedNodes: parseAttributeColumns(selectedAttributes, intl),
    onSearch: query => setAttributeQuery(query),
    initialSearch: attributeQuery,
    hasNextPage: paginatedAttributes.hasNextPage,
    hasPreviousPage: paginatedAttributes.hasPreviousPage,
    onNextPage: () => changeCurrentPage(currentPage + 1),
    onPreviousPage: () => changeCurrentPage(currentPage - 1),
  };
};

export const parseAttributeColumns = (
  attributes: ProductFragment["productType"]["variantAttributes"],
  intl: IntlShape,
): AvailableColumn[] =>
  attributes?.map(attribute => ({
    id: `attribute:${attribute.id}`,
    group: intl.formatMessage(messages.attributes),
    metaGroup: intl.formatMessage(messages.attributes),
    title: attribute.name,
    width: 150,
  }));

export const useWarehouseAdapter = ({
  intl,
  selectedColumns,
}: {
  intl: IntlShape;
  selectedColumns: string[];
  // availableWarehousesQuery: ReturnType<typeof useWarehouseListLazyQuery>;
  // gridWarehousesQuery: ReturnType<typeof useGridWarehousesLazyQuery>;
}) => {
  const [queryAvailableWarehouses, availableWarehouses] =
    useWarehouseListLazyQuery();
  const [queryInitialWarehouses, initialWarehouses] =
    useGridWarehousesLazyQuery();

  const initialWarehousesIds = selectedColumns
    .filter(isWarehouseColumnValue)
    .map(getWarehouseIdFromColumnValue);
  React.useEffect(() => {
    queryInitialWarehouses({
      variables: {
        ids: initialWarehousesIds,
        hasWarehouses: initialWarehousesIds.length > 0,
      },
    });
  }, []);

  return {
    name: intl.formatMessage(messages.warehouses),
    prefix: "warehouse",
    availableNodes: parseWarehousesColumns(
      getAvailableWarehousesData({ availableWarehouses, initialWarehouses }),
      intl,
    ),
    selectedNodes: parseWarehousesColumns(
      mapEdgesToItems(initialWarehouses.data?.selectedWarehouses),
      intl,
    ),
    onSearch: query =>
      queryAvailableWarehouses({
        variables: { filter: { search: query }, first: 10 },
      }),
    initialSearch: availableWarehouses.variables?.filter?.search ?? "",
    ...getWarehousesFetchMoreProps({
      queryAvailableWarehouses,
      availableWarehousesData: availableWarehouses,
      gridWarehousesData: initialWarehouses,
    }),
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

const parseWarehousesColumns = (data: WarehouseFragment[], intl: IntlShape) => {
  return data?.map(warehouse => ({
    id: `warehouse:${warehouse.id}`,
    group: intl.formatMessage(messages.warehouses),
    metaGroup: intl.formatMessage(messages.warehouses),
    title: warehouse.name,
    width: 150,
  }));
};

export const getWarehousesFetchMoreProps = ({
  queryAvailableWarehouses,
  availableWarehousesData,
  gridWarehousesData,
}) => {
  const onNextPage = (query: string) =>
    queryAvailableWarehouses({
      variables: {
        search: query,
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
        search: query,
        before: queryAvailableWarehouses.data?.warehouses?.pageInfo.startCursor,
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
    availableWarehousesData.data?.warehouses?.pageInfo?.hasPreviousPage ??
    false;
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
