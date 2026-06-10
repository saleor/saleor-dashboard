import { DashboardCard } from "@dashboard/components/Card";
import { Date as DateLabel } from "@dashboard/components/Date/Date";
import { KpiCard } from "@dashboard/components/KpiCard/KpiCard";
import { formatMoneyAmount } from "@dashboard/components/Money";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { TimezoneConsumer } from "@dashboard/components/Timezone";
import { rippleCustomerOverview } from "@dashboard/customers/ripples/customerOverview";
import { type CustomerDetailsQuery, PermissionEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { Ripple } from "@dashboard/ripples/components/Ripple";
import { type IMoney } from "@dashboard/utils/intl";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Banknote, LogIn, Receipt, ShoppingCart } from "lucide-react";
import { Fragment, type ReactNode, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import styles from "./CustomerOverview.module.css";
import { groupRecentOrdersByCurrency, type RecentCurrencyBucket } from "./utils";

interface CustomerOverviewProps {
  customer: CustomerDetailsQuery["user"];
}

const ICON_SIZE = 16;
const EMPTY_VALUE = "—";

export const CustomerOverview = ({ customer }: CustomerOverviewProps): JSX.Element => {
  const intl = useIntl();
  const { locale } = useLocale();
  const loading = !customer;

  const recentOrders = useMemo(() => mapEdgesToItems(customer?.orders) ?? [], [customer?.orders]);

  const recentByCurrency = useMemo<RecentCurrencyBucket[]>(
    () => groupRecentOrdersByCurrency(recentOrders),
    [recentOrders],
  );

  const renderMoneyValue = (money: IMoney): JSX.Element => (
    <>
      {formatMoneyAmount(money, locale)}
      <Text as="span" size={2} color="default2" fontWeight="medium" paddingLeft={1.5}>
        {money.currency}
      </Text>
    </>
  );

  const renderRecentSubtitle = (bucket: RecentCurrencyBucket): JSX.Element =>
    bucket.count === recentOrders.length ? (
      <FormattedMessage
        defaultMessage="Across last {count, plural, one {# order} other {# orders}} in {currency}"
        description="customer overview, subtitle scoping a money stat when every fetched recent order belongs to this currency"
        id="TZq1Tm"
        values={{ count: bucket.count, currency: bucket.currency }}
      />
    ) : (
      <FormattedMessage
        defaultMessage="{count} of last {total, plural, one {# order} other {# orders}} in {currency}"
        description="customer overview, subtitle scoping a money stat when only part of the fetched recent orders belong to this currency"
        id="eAvs2Y"
        values={{
          count: bucket.count,
          total: recentOrders.length,
          currency: bucket.currency,
        }}
      />
    );

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
                value={loading ? EMPTY_VALUE : (customer.orders?.totalCount ?? 0)}
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
                loading={loading}
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

          {recentByCurrency.map(bucket => (
            <Fragment key={bucket.currency}>
              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                <KpiCard
                  dataTestId={`kpi-recent-spent-${bucket.currency.toLowerCase()}`}
                  icon={<Banknote size={ICON_SIZE} />}
                  title={
                    <FormattedMessage
                      defaultMessage="Recent orders total"
                      description="customer overview stat label: sum of recent orders"
                      id="AJMlmz"
                    />
                  }
                  value={renderMoneyValue(bucket.spent)}
                  subtitle={renderRecentSubtitle(bucket)}
                />
              </RequirePermissions>

              <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
                <KpiCard
                  dataTestId={`kpi-recent-aov-${bucket.currency.toLowerCase()}`}
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
                      defaultMessage="Sum of the recent orders shown divided by their count."
                      description="customer overview, AOV tooltip clarifying that the average is computed only over the fetched recent orders, not the customer's lifetime"
                      id="zJuyv/"
                    />
                  }
                  value={renderMoneyValue(bucket.aov)}
                  subtitle={renderRecentSubtitle(bucket)}
                />
              </RequirePermissions>
            </Fragment>
          ))}
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

CustomerOverview.displayName = "CustomerOverview";
