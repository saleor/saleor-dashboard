import {
  DatagridChange,
  DatagridChangeOpts,
} from "@saleor/components/Datagrid/useDatagridChange";
import { Locale } from "@saleor/components/Locale";
import { ProductFragment } from "@saleor/graphql";

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

export const parseCurrency = (
  value: string,
  locale: Locale,
  currency: string,
): number => {
  // Thousand seperators are not allowedd
  const number = value.replace(/,/, ".");
  const fractionDigits = getFractionDigits(locale, currency);
  const trimmedNumber = number.slice(
    0,
    number.lastIndexOf(".") + 1 + fractionDigits,
  );

  return parseFloat(trimmedNumber);
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
  const currencyCode = getChannelCurrencyCodeById(
    channelId,
    product.channelListings,
  );

  dataChange.data.value = parseCurrency(
    `${dataChange.data.value}`,
    locale,
    currencyCode,
  );

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
