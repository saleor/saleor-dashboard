import { formatMoneyAmount } from "@dashboard/components/Money";
import { type IMoney } from "@dashboard/utils/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./CustomerOverview.module.css";

interface CustomerOverviewMoneyBreakdownTooltipProps {
  locale: string;
  shipping?: IMoney;
  refunded?: IMoney;
}

interface MoneyTooltipRowProps {
  label: ReactNode;
  money: IMoney;
  locale: string;
}

const MoneyTooltipRow = ({ label, money, locale }: MoneyTooltipRowProps): JSX.Element => (
  <Box className={styles.moneyTooltipRow}>
    <Text size={2} color="default2" className={styles.moneyTooltipLabel}>
      {label}
    </Text>
    <Text size={2} fontWeight="medium" color="default1" className={styles.moneyTooltipValue}>
      {formatMoneyAmount(money, locale)}
      <Text as="span" size={2} color="default2" fontWeight="regular" paddingLeft={1}>
        {money.currency}
      </Text>
    </Text>
  </Box>
);

export const CustomerOverviewMoneyBreakdownTooltip = ({
  locale,
  shipping,
  refunded,
}: CustomerOverviewMoneyBreakdownTooltipProps): JSX.Element => (
  <Box className={styles.moneyTooltip}>
    <Text size={2} color="default2">
      <FormattedMessage
        defaultMessage="From these orders"
        description="customer overview, value tooltip heading for shipping and refund breakdown"
        id="mKu838"
      />
    </Text>
    <Box display="flex" flexDirection="column" gap={1.5}>
      {shipping && shipping.amount > 0 && (
        <MoneyTooltipRow
          label={
            <FormattedMessage
              defaultMessage="Shipping"
              description="customer overview, shipping row label in value tooltip"
              id="qXjR1X"
            />
          }
          money={shipping}
          locale={locale}
        />
      )}
      {refunded && refunded.amount > 0 && (
        <MoneyTooltipRow
          label={
            <FormattedMessage
              defaultMessage="Refunded"
              description="customer overview, refunded row label in value tooltip"
              id="mMEpFC"
            />
          }
          money={refunded}
          locale={locale}
        />
      )}
    </Box>
  </Box>
);

CustomerOverviewMoneyBreakdownTooltip.displayName = "CustomerOverviewMoneyBreakdownTooltip";
