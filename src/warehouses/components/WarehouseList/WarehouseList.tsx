import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Pill } from "@dashboard/components/Pill/Pill";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody, TableCell, TableHead } from "@dashboard/components/Table/Table";
import { TableButtonWrapper } from "@dashboard/components/TableButtonWrapper/TableButtonWrapper";
import TableCellHeader from "@dashboard/components/TableCellHeader/TableCellHeader";
import { paginationHasAnotherPage } from "@dashboard/components/TablePagination/paginationHasAnotherPage";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination/TablePaginationWithContext";
import TableRowLink from "@dashboard/components/TableRowLink/TableRowLink";
import { type WarehouseWithShippingFragment } from "@dashboard/graphql";
import { getPrevLocationState } from "@dashboard/hooks/useBackLinkWithState";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import { buttonMessages } from "@dashboard/intl";
import { renderCollection, stopPropagation } from "@dashboard/misc";
import { type ListProps, type SortPage } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getArrowDirection } from "@dashboard/utils/sort";
import { messages } from "@dashboard/warehouses/messages";
import { WarehouseListUrlSortField, warehousePath } from "@dashboard/warehouses/urls";
import {
  type WarehouseListChannel,
  type WarehouseListMembership,
  warehouseListPlace,
  warehouseListRowStatus,
  warehouseOffersPickup,
} from "@dashboard/warehouses/warehouseListStatus";
import { Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import { type ReactNode, useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocation } from "react-router";

import styles from "./WarehouseList.module.css";

interface WarehouseListProps extends ListProps, SortPage<WarehouseListUrlSortField> {
  warehouses: WarehouseWithShippingFragment[] | undefined;
  onRemove: (id: string | undefined) => void;
  /** Blank until channel membership is known, including when the shop is too large to look up. */
  membership: WarehouseListMembership;
  channelsByWarehouseId: Record<string, WarehouseListChannel[]>;
  /** Undefined while the shop stock mode is still loading. */
  legacyStockAvailability: boolean | undefined;
  /** Optional search configuration */
  search?: {
    placeholder?: string;
    initialValue?: string;
    onSearchChange?: (query: string) => void;
  };
}

const numberOfColumns = 5;

const WarehouseListPlace = ({
  warehouse,
}: {
  warehouse: WarehouseWithShippingFragment;
}): ReactNode => {
  const place = warehouseListPlace({
    city: warehouse.address?.city ?? "",
    country: warehouse.address?.country.country ?? "",
  });

  if (!place) {
    return null;
  }

  if (place.city && place.country) {
    return (
      <Text size={2} color="default2">
        <FormattedMessage {...messages.listPlace} values={place} />
      </Text>
    );
  }

  return (
    <Text size={2} color="default2">
      {place.city || place.country}
    </Text>
  );
};

const WarehouseListStatus = ({
  warehouse,
  membership,
  channels,
  legacyStockAvailability,
}: {
  warehouse: WarehouseWithShippingFragment | undefined;
  membership: WarehouseListMembership;
  channels: WarehouseListChannel[];
  legacyStockAvailability: boolean | undefined;
}): ReactNode => {
  if (!warehouse || membership === "loading") {
    return <Skeleton />;
  }

  const zones = mapEdgesToItems(warehouse.shippingZones) ?? [];
  const status = warehouseListRowStatus({
    membership,
    channels,
    legacyStockAvailability,
    zones: zones.map(zone => ({ channelIds: zone.channels.map(channel => channel.id) })),
    zonesTruncated: (warehouse.shippingZones?.totalCount ?? zones.length) > zones.length,
  });

  if (status.kind === "unknown") {
    return null;
  }

  const isBlocker = status.kind === "not-in-channel" || status.kind === "no-shipping-zone";

  return (
    <Text size={2} color={isBlocker ? "warning1" : "default2"}>
      {status.kind === "not-in-channel" ? (
        <FormattedMessage {...messages.channelsNotInChannel} />
      ) : null}
      {status.kind === "no-shipping-zone" ? (
        <FormattedMessage {...messages.zonesEmptyTitle} />
      ) : null}
      {status.kind === "channel" ? status.name : null}
      {status.kind === "channels" ? (
        <FormattedMessage {...messages.channelsInCount} values={{ count: status.count }} />
      ) : null}
    </Text>
  );
};

export const WarehouseList = ({
  warehouses,
  disabled,
  settings,
  sort,
  onUpdateListSettings,
  onRemove,
  onSort,
  search,
  membership,
  channelsByWarehouseId,
  legacyStockAvailability,
}: WarehouseListProps): ReactNode => {
  const intl = useIntl();
  const location = useLocation();
  const pagination = useContext(PaginatorContext);

  return (
    <ResponsiveTable
      data-test-id="warehouse-list"
      search={search}
      footer={
        paginationHasAnotherPage(pagination?.hasNextPage, pagination?.hasPreviousPage) ? (
          <TablePaginationWithContext
            settings={settings}
            disabled={disabled}
            onUpdateListSettings={onUpdateListSettings}
          />
        ) : undefined
      }
    >
      <TableHead>
        <TableRowLink>
          <TableCellHeader
            direction={
              sort.sort === WarehouseListUrlSortField.name
                ? getArrowDirection(!!sort.asc)
                : undefined
            }
            arrowPosition="right"
            onClick={() => onSort(WarehouseListUrlSortField.name)}
          >
            <FormattedMessage id="aCJwVq" defaultMessage="Name" description="warehouse" />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage {...messages.listPlaceColumn} />
          </TableCellHeader>
          <TableCellHeader>
            <FormattedMessage {...messages.channelsTitle} />
          </TableCellHeader>
          <TableCellHeader className={styles.colPickup}>
            <FormattedMessage {...messages.listPickup} />
          </TableCellHeader>
          <TableCell className={styles.colAction} />
        </TableRowLink>
      </TableHead>
      <TableBody data-test-id="warehouses-list">
        {renderCollection(
          warehouses,
          warehouse => (
            <TableRowLink
              href={
                warehouse
                  ? {
                      pathname: warehousePath(encodeURIComponent(warehouse.id)),
                      state: getPrevLocationState(location),
                    }
                  : undefined
              }
              className={styles.tableRow}
              hover={!!warehouse}
              key={warehouse ? warehouse.id : "skeleton"}
              data-test-id={"warehouse-entry-" + warehouse?.name.toLowerCase().replace(" ", "")}
            >
              <TableCell>
                {warehouse ? (
                  <Text size={4} fontWeight="medium" ellipsis data-test-id="name">
                    {warehouse.name}
                  </Text>
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell data-test-id="warehouse-list-place">
                {warehouse ? <WarehouseListPlace warehouse={warehouse} /> : <Skeleton />}
              </TableCell>
              <TableCell data-test-id="warehouse-list-status">
                <WarehouseListStatus
                  warehouse={warehouse}
                  membership={membership}
                  channels={warehouse ? (channelsByWarehouseId[warehouse.id] ?? []) : []}
                  legacyStockAvailability={legacyStockAvailability}
                />
              </TableCell>
              <TableCell className={styles.colPickup} data-test-id="warehouse-list-pickup">
                {warehouse ? (
                  warehouseOffersPickup(warehouse.clickAndCollectOption) ? (
                    <Pill
                      data-test-id="warehouse-pickup-pill"
                      label={intl.formatMessage(messages.listPickup)}
                      color="info"
                    />
                  ) : null
                ) : (
                  <Skeleton />
                )}
              </TableCell>
              <TableCell className={styles.colAction}>
                {warehouse ? (
                  <TableButtonWrapper>
                    <Button
                      variant="tertiary"
                      data-test-id="delete-button"
                      aria-label={intl.formatMessage(buttonMessages.delete)}
                      icon={
                        <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                      }
                      onClick={stopPropagation(() => onRemove(warehouse.id))}
                    />
                  </TableButtonWrapper>
                ) : null}
              </TableCell>
            </TableRowLink>
          ),
          () => (
            <TableRowLink data-test-id="empty-list-message">
              <TableCell colSpan={numberOfColumns}>
                <FormattedMessage id="2gsiR1" defaultMessage="No warehouses found" />
              </TableCell>
            </TableRowLink>
          ),
        )}
      </TableBody>
    </ResponsiveTable>
  );
};

WarehouseList.displayName = "WarehouseList";
