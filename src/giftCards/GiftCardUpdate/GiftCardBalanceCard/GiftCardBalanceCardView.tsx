import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { formatMoney } from "@dashboard/components/Money";
import { type GiftCardDetailsQuery } from "@dashboard/graphql";
import { useClipboard } from "@dashboard/hooks/useClipboard";
import useDateLocalize from "@dashboard/hooks/useDateLocalize";
import useLocale from "@dashboard/hooks/useLocale";
import { buttonMessages } from "@dashboard/intl";
import { MONO_FONT_FAMILY } from "@dashboard/styles/monoFontFamily";
import { Box, Button, Skeleton, Text } from "@saleor/macaw-ui-next";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ExtendedGiftCard } from "../providers/GiftCardDetailsProvider/types";
import { formatGiftCardCodeDisplay, maskGiftCardCode } from "./formatGiftCardCode";
import styles from "./GiftCardBalanceCard.module.css";
import { giftCardBalanceCardMessages as messages } from "./messages";

type GiftCardDetails = NonNullable<GiftCardDetailsQuery["giftCard"]>;

export interface GiftCardBalanceCardViewProps {
  giftCard: ExtendedGiftCard<GiftCardDetails> | undefined;
  loading?: boolean;
  onSetBalance: () => void;
}

export const GiftCardBalanceCardView = ({
  giftCard,
  loading = false,
  onSetBalance,
}: GiftCardBalanceCardViewProps): JSX.Element => {
  const intl = useIntl();
  const { locale } = useLocale();
  const localizeDate = useDateLocalize();
  const [copied, copy] = useClipboard();
  const [codeRevealed, setCodeRevealed] = useState(false);

  const handleCopy = useCallback(() => {
    if (giftCard?.code) {
      copy(giftCard.code);
    }
  }, [copy, giftCard]);

  const toggleCodeReveal = useCallback(() => {
    setCodeRevealed(current => !current);
  }, []);

  const spentMoney = useMemo(() => {
    if (!giftCard) {
      return null;
    }

    return {
      amount: Math.max(giftCard.initialBalance.amount - giftCard.currentBalance.amount, 0),
      currency: giftCard.currentBalance.currency,
    };
  }, [giftCard]);

  const spentPercentage = useMemo(() => {
    if (!giftCard || giftCard.initialBalance.amount <= 0) {
      return 0;
    }

    const spent = giftCard.initialBalance.amount - giftCard.currentBalance.amount;

    return Math.min(100, Math.max(0, (spent / giftCard.initialBalance.amount) * 100));
  }, [giftCard]);

  if (loading || !giftCard) {
    return (
      <Box className={styles.card} data-test-id="gift-card-balance-card">
        <Box className={styles.body}>
          <Skeleton />
        </Box>
      </Box>
    );
  }

  const {
    last4CodeChars,
    code,
    currentBalance,
    initialBalance,
    expiryDate,
    isExpired,
    lastUsedOn,
  } = giftCard;
  const displayCode = codeRevealed
    ? formatGiftCardCodeDisplay(code)
    : maskGiftCardCode(last4CodeChars, code);
  const showExpiryUrgency = !!expiryDate && !isExpired && currentBalance.amount > 0;

  return (
    <Box className={styles.card} data-test-id="gift-card-balance-card">
      <Box className={styles.codeRow}>
        <Text
          size={5}
          fontWeight="bold"
          className={styles.codeValue}
          style={{ fontFamily: MONO_FONT_FAMILY }}
          data-test-id="gift-card-code"
        >
          {displayCode}
        </Text>
        <Box className={styles.codeActions}>
          <Button
            variant="tertiary"
            size="small"
            icon={
              codeRevealed ? (
                <EyeOff size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              ) : (
                <Eye size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              )
            }
            onClick={toggleCodeReveal}
            aria-label={intl.formatMessage(codeRevealed ? messages.hideCode : messages.showCode)}
            data-test-id="gift-card-code-reveal"
          />
          <Button
            variant="tertiary"
            size="small"
            icon={
              copied ? (
                <Check size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              ) : (
                <Copy size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
              )
            }
            onClick={handleCopy}
            aria-label={intl.formatMessage(buttonMessages.copyToClipboard)}
            data-test-id="gift-card-code-copy"
          />
        </Box>
      </Box>

      <Box className={styles.body}>
        <Box className={styles.balanceHeader}>
          <Text size={2} color="default2">
            <FormattedMessage {...messages.remainingBalanceLabel} />
          </Text>
          {!isExpired && (
            <Button variant="secondary" onClick={onSetBalance} data-test-id="set-balance-button">
              <FormattedMessage {...messages.setBalanceButton} />
            </Button>
          )}
        </Box>

        <Text as="p" className={styles.balanceAmount} data-test-id="gift-card-remaining-balance">
          {formatMoney(currentBalance, locale)}
        </Text>

        <Box>
          <Box
            className={styles.meterTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(spentPercentage)}
            data-test-id="gift-card-spend-meter"
          >
            <Box className={styles.meterFill} __width={`${spentPercentage}%`} aria-hidden />
          </Box>
          {spentMoney && (
            <Text size={2} color="default2" marginTop={2} display="block">
              <FormattedMessage
                {...messages.spentOfInitial}
                values={{
                  spent: formatMoney(spentMoney, locale),
                  initial: formatMoney(initialBalance, locale),
                }}
              />
            </Text>
          )}
          <Text size={2} color="default2" marginTop={1} display="block">
            <FormattedMessage {...messages.currencyHint} />
          </Text>
        </Box>

        <Text size={2} color="default2" data-test-id="gift-card-last-used">
          {lastUsedOn ? (
            <FormattedMessage
              {...messages.lastUsedOn}
              values={{ date: localizeDate(lastUsedOn, "lll") }}
            />
          ) : (
            <FormattedMessage {...messages.neverUsed} />
          )}
        </Text>

        {showExpiryUrgency && (
          <Text
            size={3}
            color="warning1"
            className={styles.urgency}
            data-test-id="gift-card-expiry-urgency"
          >
            <FormattedMessage
              {...messages.expiryUrgency}
              values={{
                remaining: formatMoney(currentBalance, locale),
                date: localizeDate(expiryDate),
              }}
            />
          </Text>
        )}
      </Box>
    </Box>
  );
};
