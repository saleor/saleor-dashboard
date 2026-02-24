// @ts-strict-ignore
import { type ChannelData } from "@dashboard/channels/utils";
import {
  type DatagridChange,
  type DatagridChangeOpts,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { type Locale } from "@dashboard/components/Locale";
import {
  type ChannelFragment,
  type ProductChannelListingAddInput,
  type ProductFragment,
} from "@dashboard/graphql";

const getFractionDigits = (locale: Locale, currency: string) => {
  try {
    const numberFormat = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });

    return numberFormat.resolvedOptions().maximumFractionDigits;
  } catch (e) {
    return 2;
  }
};

export const parseCurrency = (value: string, locale: Locale, currency: string): number => {
  // Thousand seperators are not allowedd
  const number = value.replace(/,/, ".");
  const fractionDigits = getFractionDigits(locale, currency);
  const lastDecimalPoint = number.lastIndexOf(".");
  const trimmedNumber = number.slice(0, lastDecimalPoint + 1 + fractionDigits);

  return parseFloat(lastDecimalPoint !== -1 ? trimmedNumber : number);
};

export const prepareVariantChangeData = (
  data: DatagridChangeOpts,
  locale: Locale,
  product: ProductFragment,
): DatagridChangeOpts => {
  data.updates = data.updates.map(update => {
    if (isColumnChannelPrice(update.column)) {
      return updateVaraintWithPriceFormat(update, locale, product);
    }

    return update;
  });

  return data;
};

function updateVaraintWithPriceFormat(
  dataChange: DatagridChange,
  locale: Locale,
  product: ProductFragment,
) {
  const channelId = dataChange.column.split(":")[1];
  const currencyCode = getChannelCurrencyCodeById(channelId, product.channelListings);

  dataChange.data.value = parseCurrency(`${String(dataChange.data.value)}`, locale, currencyCode);

  return dataChange;
}

function isColumnChannelPrice(name: string) {
  return name.includes("channel:");
}

function getChannelCurrencyCodeById(
  channelId: string,
  channelList: ProductFragment["channelListings"],
): string {
  const channel = channelList.find(({ channel }) => channel.id === channelId);

  if (channel) {
    return channel.channel.currencyCode;
  }

  return "";
}

export function mapByChannel(channels?: ChannelFragment[]) {
  return (listing: ProductChannelListingAddInput): ChannelData => {
    const channel = channels?.find(ac => ac.id === listing.channelId);

    return {
      ...channel,
      ...listing,
      id: listing.channelId,
      currency: channel?.currencyCode,
    };
  };
}
