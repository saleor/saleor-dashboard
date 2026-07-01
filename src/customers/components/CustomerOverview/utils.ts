import { type IMoney } from "@dashboard/utils/intl";

import { RECENT_ORDERS_WINDOW } from "./constants";

export interface ChannelFromOrder {
  id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
  currencyCode?: string;
}

export interface CustomerOrderForKpi {
  status: string;
  created: string;
  channel?: ChannelFromOrder | null;
  subtotal: {
    net: {
      amount: number;
      currency: string;
    };
  };
  shippingPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  totalRefunded: {
    amount: number;
    currency: string;
  };
}

export interface CustomerOrderKpiMetrics {
  windowSize: number;
  orderCount: number;
  currency: string;
  netSales: IMoney;
  aov: IMoney;
  shippingTotal: IMoney;
  refundedTotal: IMoney;
}

export const isCancelledOrderStatus = (status: string): boolean =>
  status === "CANCELED" || status === "CANCELLED";

export const isExcludedFromCustomerOrderKpis = (status: string): boolean =>
  isCancelledOrderStatus(status) || status === "DRAFT";

export const filterOrdersByChannel = <T extends { channel?: ChannelFromOrder | null }>(
  orders: ReadonlyArray<T>,
  channelId: string,
): T[] => orders.filter(order => order.channel?.id === channelId);

export const selectRecentOrdersForKpis = <T extends { status: string; created: string }>(
  orders: ReadonlyArray<T>,
  windowSize = RECENT_ORDERS_WINDOW,
): T[] =>
  [...orders]
    .filter(order => !isExcludedFromCustomerOrderKpis(order.status))
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, windowSize);

/**
 * Unique channels from order history, ordered by the customer's most recent
 * qualifying order in each channel (most recently shopped channel first).
 */
export const extractChannelsFromOrders = (
  orders: ReadonlyArray<{
    status: string;
    created: string;
    channel?: ChannelFromOrder | null;
  }>,
): ChannelFromOrder[] => {
  const latestOrderAtByChannel = new Map<string, { channel: ChannelFromOrder; created: string }>();

  for (const order of orders) {
    if (!order.channel?.id || isExcludedFromCustomerOrderKpis(order.status)) {
      continue;
    }

    const existing = latestOrderAtByChannel.get(order.channel.id);

    if (!existing || new Date(order.created).getTime() > new Date(existing.created).getTime()) {
      latestOrderAtByChannel.set(order.channel.id, {
        channel: {
          id: order.channel.id,
          name: order.channel.name,
          slug: order.channel.slug ?? undefined,
          isActive: order.channel.isActive ?? undefined,
          currencyCode: order.channel.currencyCode ?? undefined,
        },
        created: order.created,
      });
    }
  }

  return Array.from(latestOrderAtByChannel.values())
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .map(entry => entry.channel);
};

const sumMoneyField = (
  orders: ReadonlyArray<CustomerOrderForKpi>,
  getAmount: (order: CustomerOrderForKpi) => number,
  currency: string,
): IMoney => ({
  amount: orders.reduce((sum, order) => sum + getAmount(order), 0),
  currency,
});

/**
 * Builds KPI metrics for a channel-scoped recent order window.
 * Net sales and AOV use `subtotal.net` (post-discount product value, no tax/shipping).
 * Shipping and refunds are surfaced separately for merchant context.
 */
export const buildCustomerOrderKpiMetrics = (
  orders: ReadonlyArray<CustomerOrderForKpi>,
  windowSize = RECENT_ORDERS_WINDOW,
): CustomerOrderKpiMetrics | null => {
  const recentOrders = selectRecentOrdersForKpis(orders, windowSize);

  if (recentOrders.length === 0) {
    return null;
  }

  const currency = recentOrders[0].subtotal.net.currency;
  const netSalesAmount = recentOrders.reduce((sum, order) => sum + order.subtotal.net.amount, 0);

  return {
    windowSize: recentOrders.length,
    orderCount: recentOrders.length,
    currency,
    netSales: { amount: netSalesAmount, currency },
    aov: { amount: netSalesAmount / recentOrders.length, currency },
    shippingTotal: sumMoneyField(recentOrders, order => order.shippingPrice.gross.amount, currency),
    refundedTotal: sumMoneyField(recentOrders, order => order.totalRefunded.amount, currency),
  };
};
