import { PLACEHOLDER } from "@dashboard/components/Datagrid/const";
import {
  moneyCell,
  primarySecondaryTextCell,
  readonlyTextCell,
  statusCell,
} from "@dashboard/components/Datagrid/customCells/cells";
import { type AvailableColumn } from "@dashboard/components/Datagrid/types";
import { type Locale } from "@dashboard/components/Locale";
import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { type VoucherListUrlSortField } from "@dashboard/discounts/urls";
import {
  getPromotionStatus,
  getRelativePromotionTimeParts,
  type PromotionStatus,
} from "@dashboard/discounts/utils";
import { DiscountValueTypeEnum, type VoucherFragment, VoucherTypeEnum } from "@dashboard/graphql";
import { type Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { type GridCell, type Item } from "@glideapps/glide-data-grid";
import { type IntlShape } from "react-intl";

import { columnsMessages, messages } from "./messages";
import { type VoucherScopeIconKind } from "./renderVoucherScopeIconSvg";
import { voucherScopeCell } from "./VoucherScopeCell";

export function formatDateTime(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(date),
  );
}

export const vouchersListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<VoucherListUrlSortField>,
) =>
  [
    {
      id: "code",
      title: intl.formatMessage(columnsMessages.name),
      width: 280,
    },
    {
      id: "status",
      title: intl.formatMessage(columnsMessages.status),
      width: 180,
    },
    {
      id: "value",
      title: intl.formatMessage(columnsMessages.offer),
      width: 160,
    },
    {
      id: "type",
      title: intl.formatMessage(columnsMessages.scope),
      width: 160,
    },
    {
      id: "limit",
      title: intl.formatMessage(columnsMessages.redemptions),
      width: 150,
    },
    {
      id: "min-spent",
      title: intl.formatMessage(columnsMessages.minSpent),
      width: 160,
    },
    {
      id: "start-date",
      title: intl.formatMessage(columnsMessages.starts),
      width: 180,
    },
    {
      id: "end-date",
      title: intl.formatMessage(columnsMessages.ends),
      width: 180,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

const getStatusDot = (status: PromotionStatus): DotStatus => {
  if (status === "active") {
    return "success";
  }

  if (status === "scheduled") {
    return "scheduled";
  }

  return "neutral";
};

export const getVoucherListStatusLabel = ({
  voucher,
  intl,
  now = new Date(),
}: {
  voucher: VoucherFragment;
  intl: IntlShape;
  now?: Date;
}): { label: string; status: DotStatus } => {
  const promotionStatus = getPromotionStatus({
    startDate: voucher.startDate,
    endDate: voucher.endDate,
    now,
  });
  const statusLabel = intl.formatMessage(
    promotionStatus === "scheduled"
      ? messages.statusScheduled
      : promotionStatus === "finished"
        ? messages.statusEnded
        : messages.statusActive,
  );
  const timeParts = getRelativePromotionTimeParts({
    status: promotionStatus,
    startDate: voucher.startDate,
    endDate: voucher.endDate,
    now,
  });
  const timeHint = timeParts
    ? new Intl.RelativeTimeFormat(intl.locale, { numeric: "auto", style: "long" }).format(
        timeParts.value,
        timeParts.unit,
      )
    : null;

  return {
    status: getStatusDot(promotionStatus),
    label: timeHint ? `${statusLabel} · ${timeHint}` : statusLabel,
  };
};

/** Maps voucher type to the same Lucide icon family as the discount scope tiles. */
export const getVoucherListScopeIconKind = (voucher: VoucherFragment): VoucherScopeIconKind => {
  if (voucher.type === VoucherTypeEnum.SHIPPING) {
    return "shipping";
  }

  if (voucher.type === VoucherTypeEnum.SPECIFIC_PRODUCT) {
    return "products";
  }

  return "entireOrder";
};

export const getVoucherListScopeLabel = (voucher: VoucherFragment, intl: IntlShape): string => {
  if (voucher.type === VoucherTypeEnum.SHIPPING) {
    const countries = voucher.countries ?? [];

    // Empty country list = worldwide (same semantics as voucher setup / API).
    if (countries.length === 0) {
      return intl.formatMessage(messages.scopeShippingWorldwide);
    }

    if (countries.length === 1) {
      return countries[0]?.country?.trim() || countries[0]?.code || PLACEHOLDER;
    }

    return intl.formatMessage(messages.scopeShippingCountries, { count: countries.length });
  }

  if (voucher.type === VoucherTypeEnum.SPECIFIC_PRODUCT) {
    return intl.formatMessage(messages.scopeProducts);
  }

  return intl.formatMessage(messages.scopeOrder);
};

export interface VoucherListNameParts {
  primary: string;
  secondary?: string;
}

export const getVoucherListNameParts = (
  voucher: VoucherFragment,
  intl: IntlShape,
): VoucherListNameParts => {
  const name = voucher.name?.trim();
  const codesCount = voucher.codesCount?.totalCount ?? 0;
  const codesLabel =
    codesCount > 0 ? intl.formatMessage(messages.codesOnly, { count: codesCount }) : null;

  if (name) {
    return {
      primary: name,
      secondary: codesLabel ? ` · ${codesLabel}` : undefined,
    };
  }

  if (codesLabel) {
    // No promo title — treat codes count as the muted identity.
    return { primary: "", secondary: codesLabel };
  }

  return { primary: PLACEHOLDER };
};

export const getVoucherListNameLabel = (voucher: VoucherFragment, intl: IntlShape): string => {
  const { primary, secondary } = getVoucherListNameParts(voucher, intl);

  return `${primary}${secondary ?? ""}`;
};

export const getVoucherListRedemptionsLabel = (
  voucher: VoucherFragment,
  intl: IntlShape,
): string => {
  const used = voucher.used ?? 0;

  if (voucher.usageLimit == null) {
    return intl.formatMessage(messages.redemptionsUnlimited, { used });
  }

  return intl.formatMessage(messages.redemptionsOfLimit, {
    used,
    limit: voucher.usageLimit,
  });
};

export const createGetCellContent =
  ({
    vouchers,
    columns,
    locale,
    selectedChannelId,
    intl,
  }: {
    vouchers: VoucherFragment[];
    columns: AvailableColumn[];
    locale: Locale;
    selectedChannelId?: string;
    intl: IntlShape;
  }) =>
  ([column, row]: Item): GridCell => {
    const rowData: VoucherFragment | undefined = vouchers[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    const channel = rowData?.channelListings?.find(
      listing => listing.channel.id === selectedChannelId,
    );
    const hasChannelsLoaded = !!rowData?.channelListings?.length;

    switch (columnId) {
      case "code": {
        const { primary, secondary } = getVoucherListNameParts(rowData, intl);

        return primarySecondaryTextCell(primary, secondary, {
          cursor: "pointer",
          readonly: true,
          allowOverlay: false,
        });
      }

      case "status": {
        const { label, status } = getVoucherListStatusLabel({ voucher: rowData, intl });

        return statusCell(status, label, {
          cursor: "pointer",
          readonly: true,
          allowOverlay: false,
        });
      }

      case "type":
        return voucherScopeCell(
          getVoucherListScopeIconKind(rowData),
          getVoucherListScopeLabel(rowData, intl),
          {
            cursor: "pointer",
            readonly: true,
            allowOverlay: false,
          },
        );

      case "limit":
        return readonlyTextCell(getVoucherListRedemptionsLabel(rowData, intl));

      case "min-spent":
        return hasChannelsLoaded
          ? moneyCell(channel?.minSpent?.amount ?? null, channel?.minSpent?.currency ?? "", {
              cursor: "pointer",
              readonly: true,
            })
          : readonlyTextCell(PLACEHOLDER);

      case "start-date":
        try {
          return readonlyTextCell(
            rowData.startDate ? formatDateTime(rowData.startDate, locale) : PLACEHOLDER,
          );
        } catch {
          return readonlyTextCell(PLACEHOLDER);
        }

      case "end-date":
        try {
          return readonlyTextCell(
            rowData.endDate ? formatDateTime(rowData.endDate, locale) : PLACEHOLDER,
          );
        } catch {
          return readonlyTextCell(PLACEHOLDER);
        }

      case "value":
        return getVoucherOfferCell(rowData, intl);

      default:
        return readonlyTextCell("");
    }
  };

function getVoucherOfferCell(voucher: VoucherFragment, intl: IntlShape): GridCell {
  if (voucher.type === VoucherTypeEnum.SHIPPING) {
    return readonlyTextCell(intl.formatMessage(messages.freeShippingOffer));
  }

  const listings = voucher.channelListings ?? [];

  if (listings.length === 0) {
    return readonlyTextCell(PLACEHOLDER);
  }

  if (voucher.discountValueType === DiscountValueTypeEnum.PERCENTAGE) {
    const uniqueValues = [...new Set(listings.map(listing => listing.discountValue))];

    if (uniqueValues.length === 1) {
      return readonlyTextCell(
        intl.formatMessage(messages.percentageOffer, { value: uniqueValues[0] }),
      );
    }

    return readonlyTextCell(intl.formatMessage(messages.variesByChannel));
  }

  const uniqueCurrencies = [...new Set(listings.map(listing => listing.currency))];
  const uniqueValues = [...new Set(listings.map(listing => listing.discountValue))];

  if (uniqueCurrencies.length === 1 && uniqueValues.length === 1) {
    return moneyCell(uniqueValues[0], uniqueCurrencies[0] ?? "", {
      cursor: "pointer",
      readonly: true,
    });
  }

  return readonlyTextCell(intl.formatMessage(messages.variesByChannel));
}
