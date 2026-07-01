import { DashboardCard } from "@dashboard/components/Card";
import { Date as DateLabel } from "@dashboard/components/Date/Date";
import { KpiCard } from "@dashboard/components/KpiCard/KpiCard";
import { formatMoneyAmount } from "@dashboard/components/Money";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { TimezoneConsumer } from "@dashboard/components/Timezone";
import { useCustomerDetails } from "@dashboard/customers/hooks/useCustomerDetails";
import { rippleCustomerOverview } from "@dashboard/customers/ripples/customerOverview";
import { type CustomerDetailsQuery, PermissionEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type IMoney } from "@dashboard/utils/intl";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Banknote, LogIn, Receipt, ShoppingCart } from "lucide-react";
import { type ReactNode, useEffect, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./CustomerOverview.module.css";
import { CustomerOverviewChannelScope } from "./CustomerOverviewChannelScope";
import { CustomerOverviewMoneyBreakdownTooltip } from "./CustomerOverviewMoneyBreakdownTooltip";
import {
  buildCustomerOrderKpiMetrics,
  type CustomerOrderKpiMetrics,
  extractChannelsFromOrders,
  filterOrdersByChannel,
  selectRecentOrdersForKpis,
} from "./utils";

interface CustomerOverviewProps {
  customer: CustomerDetailsQuery["user"];
}

const ICON_SIZE = 16;
const EMPTY_VALUE = "—";

export const CustomerOverview = ({ customer }: CustomerOverviewProps): JSX.Element => {
  const intl = useIntl();
  const { locale } = useLocale();
  const { kpiChannelId, setKpiChannelId } = useCustomerDetails();
  const loading = !customer;

  const kpiOrders = useMemo(
    () => mapEdgesToItems(customer?.kpiOrders) ?? [],
    [customer?.kpiOrders],
  );

  const channels = useMemo(() => extractChannelsFromOrders(kpiOrders), [kpiOrders]);

  const effectiveChannelId = kpiChannelId ?? channels[0]?.id;

  useEffect(
    function selectDefaultKpiChannel() {
      if (channels.length > 0 && !kpiChannelId) {
        setKpiChannelId(channels[0].id);
      }
    },
    [channels, kpiChannelId, setKpiChannelId],
  );

  const channelOrders = useMemo(
    () => (effectiveChannelId ? filterOrdersByChannel(kpiOrders, effectiveChannelId) : []),
    [effectiveChannelId, kpiOrders],
  );

  const recentOrders = useMemo(() => selectRecentOrdersForKpis(channelOrders), [channelOrders]);

  const metrics = useMemo<CustomerOrderKpiMetrics | null>(
    () => buildCustomerOrderKpiMetrics(channelOrders),
    [channelOrders],
  );

  const totalOrders = customer?.kpiNonCancelledOrderCount?.totalCount;
  const totalOrdersLoading =
    loading || (Boolean(effectiveChannelId) && customer?.kpiNonCancelledOrderCount === undefined);

  const renderMoneyValue = (money: IMoney): JSX.Element => (
    <>
      {formatMoneyAmount(money, locale)}
      <Text as="span" size={2} color="default2" fontWeight="medium" paddingLeft={1.5}>
        {money.currency}
      </Text>
    </>
  );

  const renderRecentWindowSubtitle = (): JSX.Element | undefined => {
    if (!metrics) {
      return undefined;
    }

    return (
      <FormattedMessage
        defaultMessage="{count} of last {windowSize, plural, one {# order} other {# orders}} in {currency}"
        description="customer overview, subtitle scoping recent money stats to the selected channel window"
        id="TjB4Wn"
        values={{
          count: metrics.orderCount,
          currency: metrics.currency,
          windowSize: metrics.windowSize,
        }}
      />
    );
  };

  const renderNetSalesValueTooltip = (): ReactNode | undefined => {
    if (!metrics) {
      return undefined;
    }

    const hasShipping = metrics.shippingTotal.amount > 0;
    const hasRefunds = metrics.refundedTotal.amount > 0;

    if (!hasShipping && !hasRefunds) {
      return undefined;
    }

    return (
      <CustomerOverviewMoneyBreakdownTooltip
        locale={locale}
        shipping={hasShipping ? metrics.shippingTotal : undefined}
        refunded={hasRefunds ? metrics.refundedTotal : undefined}
      />
    );
  };

  const renderTimeWithZone = (isoDate: string): ReactNode => {
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
      return null;
    }

    return (
      <TimezoneConsumer>
        {tz =>
          intl.formatTime(date, {
            timeZone: tz,
            timeZoneName: "shortOffset",
          })
        }
      </TimezoneConsumer>
    );
  };

  return (
    <DashboardCard data-test-id="customer-overview">
      <DashboardCard.Content paddingY={6}>
        <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
          {!loading && channels.length > 0 && (
            <CustomerOverviewChannelScope
              channels={channels}
              selectedChannelId={effectiveChannelId}
              onChannelChange={setKpiChannelId}
            />
          )}
        </RequirePermissions>

        <div className={styles.grid}>
          <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
            <Box position="relative">
              {!loading && (
                <Box position="absolute" __top="-4px" __right="-4px" __zIndex="1">
                  <Ripple model={rippleCustomerOverview} />
                </Box>
              )}
              <KpiCard
                dataTestId="kpi-total-orders"
                icon={<ShoppingCart size={ICON_SIZE} />}
                title={
                  <FormattedMessage
                    defaultMessage="Total orders"
                    description="customer overview stat label"
                    id="HRy5qF"
                  />
                }
                tooltip={
                  <FormattedMessage
                    defaultMessage="Number of orders placed by this customer in the selected channel. Cancelled orders are not counted."
                    description="customer overview, total orders tooltip"
                    id="aIookg"
                  />
                }
                value={totalOrdersLoading ? EMPTY_VALUE : (totalOrders ?? 0)}
                subtitle={
                  !loading && recentOrders.length > 0 ? (
                    <FormattedMessage
                      defaultMessage="Last order: {date}"
                      description="customer overview, subtitle on total orders showing the most recent order date"
                      id="PyxGqS"
                      values={{
                        date: <DateLabel date={recentOrders[0].created} plain />,
                      }}
                    />
                  ) : undefined
                }
                loading={totalOrdersLoading}
              />
            </Box>
          </RequirePermissions>

          <KpiCard
            dataTestId="kpi-last-login"
            icon={<LogIn size={ICON_SIZE} />}
            title={
              <FormattedMessage
                defaultMessage="Last login"
                description="customer overview stat label"
                id="aYnI0N"
              />
            }
            tooltip={
              <FormattedMessage
                defaultMessage="Most recent time this customer signed in to their account."
                description="customer overview, last login tooltip"
                id="n8tEIV"
              />
            }
            value={
              loading ? (
                EMPTY_VALUE
              ) : customer.lastLogin === null ? (
                EMPTY_VALUE
              ) : (
                <DateLabel date={customer.lastLogin} plain />
              )
            }
            subtitle={
              !loading && customer.lastLogin ? renderTimeWithZone(customer.lastLogin) : undefined
            }
            loading={loading}
          />

          {metrics && (
            <>
              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                <KpiCard
                  dataTestId={`kpi-recent-spent-${metrics.currency.toLowerCase()}`}
                  icon={<Banknote size={ICON_SIZE} />}
                  title={
                    <FormattedMessage
                      defaultMessage="Recent orders total"
                      description="customer overview stat label: sum of recent orders net product sales"
                      id="wek82T"
                    />
                  }
                  tooltip={
                    <FormattedMessage
                      defaultMessage="Sum of product revenue from this customer's last {windowSize} orders in this channel. Excludes shipping and tax. Discounts are already applied."
                      description="customer overview, recent net sales tooltip"
                      id="tQA//+"
                      values={{ windowSize: metrics.windowSize }}
                    />
                  }
                  value={renderMoneyValue(metrics.netSales)}
                  valueTooltip={renderNetSalesValueTooltip()}
                  subtitle={renderRecentWindowSubtitle()}
                />
              </RequirePermissions>

              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                <KpiCard
                  dataTestId={`kpi-recent-aov-${metrics.currency.toLowerCase()}`}
                  icon={<Receipt size={ICON_SIZE} />}
                  title={
                    <FormattedMessage
                      defaultMessage="Avg order value"
                      description="customer overview stat label: average order value of recent orders"
                      id="aTe9zV"
                    />
                  }
                  tooltip={
                    <FormattedMessage
                      defaultMessage="Average product revenue per order in this channel, from the last {windowSize} orders. Excludes shipping and tax."
                      description="customer overview, AOV tooltip"
                      id="bIttOt"
                      values={{ windowSize: metrics.windowSize }}
                    />
                  }
                  value={renderMoneyValue(metrics.aov)}
                  subtitle={renderRecentWindowSubtitle()}
                />
              </RequirePermissions>
            </>
          )}
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerOverview.displayName = "CustomerOverview";
