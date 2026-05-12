import { voucherUrl } from "@dashboard/discounts/urls";
import { type MoneyFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { type IntlShape, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "../messages";
import { type LinePriceWaterfall, type PriceFactor, type PriceFactorLink } from "../utils/types";
import styles from "./PriceWaterfallList.module.css";
import { PriceWaterfallStep } from "./PriceWaterfallStep";

interface PriceWaterfallListProps {
  waterfall: LinePriceWaterfall;
}

export const PriceWaterfallList = ({ waterfall }: PriceWaterfallListProps) => {
  const intl = useIntl();

  const startMoney: MoneyFragment = waterfall.start;
  const running = { ...waterfall.start, __typename: "Money" as const };

  const steps = waterfall.factors.map((factor, idx) => {
    const stepAmount = getStepAmount(factor);

    running.amount = round(running.amount + stepAmount.delta);

    return (
      <PriceWaterfallStep
        key={idx}
        label={getFactorLabel(factor, intl)}
        detail={getFactorDetail(factor, intl)}
        amount={stepAmount.display}
        sign={stepAmount.sign}
        runningTotal={{ ...startMoney, amount: round(running.amount) }}
        testIdSuffix={factor.kind}
      />
    );
  });

  return (
    <Box
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
      borderRadius={3}
      overflow="hidden"
    >
      <PriceWaterfallStep
        label={intl.formatMessage(messages.startLabel, { quantity: waterfall.quantity })}
        amount={waterfall.start}
        sign="none"
        emphasis="start"
        testIdSuffix="start"
      />
      {steps}
      <PriceWaterfallStep
        label={intl.formatMessage(messages.endLabel)}
        amount={waterfall.end}
        sign="none"
        emphasis="end"
        testIdSuffix="end"
      />
    </Box>
  );
};

function round(n: number) {
  return Math.round(n * 100) / 100;
}

interface StepAmount {
  /** Money to display in the middle column (always non-negative). */
  display: MoneyFragment;
  /** Signed contribution to the running total: negative for discounts,
   *  positive for upward adjustments. */
  delta: number;
  /** Sign prefix shown next to the displayed amount. */
  sign: "minus" | "plus" | "none";
}

function getStepAmount(factor: PriceFactor): StepAmount {
  switch (factor.kind) {
    case "catalogue_promotion":
    case "voucher_line":
    case "manual_line":
      return { display: factor.signedDelta, delta: -factor.signedDelta.amount, sign: "minus" };
    case "voucher_order_share":
    case "order_promotion_share":
    case "manual_order_share":
      return { display: factor.lineShare, delta: -factor.lineShare.amount, sign: "minus" };
    case "other_adjustment":
      return {
        display: factor.value,
        delta: factor.direction === "minus" ? -factor.value.amount : factor.value.amount,
        sign: factor.direction,
      };
  }
}

function getFactorLabel(factor: PriceFactor, intl: IntlShape): string {
  switch (factor.kind) {
    case "catalogue_promotion":
      return intl.formatMessage(messages.factorCataloguePromotion);
    case "voucher_line":
      return intl.formatMessage(messages.factorVoucherLine);
    case "voucher_order_share":
      return intl.formatMessage(messages.factorVoucherOrderShare);
    case "order_promotion_share":
      return intl.formatMessage(messages.factorOrderPromotionShare);
    case "manual_line":
      return intl.formatMessage(messages.factorManualLine);
    case "manual_order_share":
      return intl.formatMessage(messages.factorManualOrderShare);
    case "other_adjustment":
      return intl.formatMessage(messages.factorOtherAdjustment);
  }
}

/**
 * Render a factor's source name. When a link is attached, wrap it in a
 * subtle anchor; otherwise render the plain string. Today the only kind of
 * link is `voucher`; the discriminator pattern leaves room for future
 * variants without restructuring callers.
 */
function renderName(
  name: string | null | undefined,
  link: PriceFactorLink | undefined,
  intl: IntlShape,
): ReactNode {
  if (!name) return null;

  if (!link) return name;

  return (
    <Link
      to={voucherUrl(link.voucherId)}
      title={intl.formatMessage(messages.linkVoucherTitle)}
      className={styles.subtleLink}
    >
      <Text as="span" color="default2">
        {name}
      </Text>
    </Link>
  );
}

function getFactorDetail(factor: PriceFactor, intl: IntlShape): ReactNode {
  switch (factor.kind) {
    case "catalogue_promotion":
      return factor.name ?? factor.reason ?? null;
    case "voucher_line":
    case "voucher_order_share": {
      const nameNode = renderName(factor.name, factor.link, intl);
      const codeNode =
        factor.code && intl.formatMessage(messages.voucherCodeLabel, { code: factor.code });

      const parts = [nameNode, codeNode].filter(Boolean);

      if (parts.length === 0) return null;

      return parts.map((part, idx) => (
        <span key={idx}>
          {idx > 0 && " \u00b7 "}
          {part}
        </span>
      ));
    }
    case "order_promotion_share":
      return factor.name;
    case "manual_line":
    case "manual_order_share":
      return factor.reason;
    case "other_adjustment":
      return null;
  }
}
