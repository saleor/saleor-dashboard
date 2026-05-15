import { roundMoneyByDigits } from "@dashboard/components/Money";
import { voucherUrl } from "@dashboard/discounts/urls";
import { type MoneyFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { type IntlShape, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { messages } from "../messages";
import { getStepAmount } from "../utils/getStepAmount";
import {
  type LinePriceWaterfall,
  type PriceFactor,
  type PriceFactorContributor,
  type PriceFactorLink,
} from "../utils/types";
import styles from "./PriceWaterfallList.module.css";
import { PriceWaterfallStep } from "./PriceWaterfallStep";

interface PriceWaterfallListProps {
  waterfall: LinePriceWaterfall;
}

export const PriceWaterfallList = ({ waterfall }: PriceWaterfallListProps) => {
  const intl = useIntl();
  const { fractionDigits } = waterfall;

  let runningAmount = waterfall.start.amount;

  const steps = waterfall.factors.map((factor, idx) => {
    const stepAmount = getStepAmount(factor);

    runningAmount = roundMoneyByDigits(runningAmount + stepAmount.delta, fractionDigits);

    const runningTotal: MoneyFragment = { ...waterfall.start, amount: runningAmount };

    return (
      <PriceWaterfallStep
        key={idx}
        label={getFactorLabel(factor, intl)}
        detail={getFactorDetail(factor, intl)}
        amount={stepAmount.display}
        sign={stepAmount.sign}
        runningTotal={runningTotal}
        testIdSuffix={`${factor.kind}-${idx}`}
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
    case "gift_line":
      return intl.formatMessage(messages.factorGiftLine);
    case "order_level_combined":
      return intl.formatMessage(messages.factorOrderLevelCombined);
    case "other_adjustment":
      return intl.formatMessage(messages.factorOtherAdjustment);
  }
}

/**
 * Render a factor's source name. When a link is attached, wrap it in a
 * subtle anchor; otherwise render the plain string. Today the only kind of
 * link is `voucher`; the discriminator pattern leaves room for future
 * variants without restructuring callers.
 *
 * The link uses `color: inherit` so it picks up the colour of whichever
 * `<Text>` it ends up inside (primary `default1` in the row's detail line,
 * muted `default2` in the contributor list).
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
      {name}
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
    case "gift_line":
      return factor.promotionName;
    case "order_level_combined":
      return renderContributors(factor.contributors, intl);
    case "other_adjustment":
      return null;
  }
}

/**
 * Render the contributor list under a combined order-level factor. Each
 * contributor is named (voucher names link to the voucher detail page when an
 * id is available); deliberately no per-record amounts — Saleor does not
 * surface a per-record-per-line decomposition and we will not invent one.
 */
function renderContributors(contributors: PriceFactorContributor[], intl: IntlShape): ReactNode {
  if (contributors.length === 0) return null;

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      <Text size={1} color="default2">
        {intl.formatMessage(messages.factorContributorsLabel)}
      </Text>
      <Box as="ul" margin={0} paddingLeft={4} display="flex" flexDirection="column" gap={0.5}>
        {contributors.map((c, idx) => (
          <Box as="li" key={idx}>
            <Text size={1} color="default2">
              {renderContributor(c, intl)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function renderContributor(contributor: PriceFactorContributor, intl: IntlShape): ReactNode {
  switch (contributor.kind) {
    case "voucher": {
      const nameNode =
        renderName(contributor.name, contributor.link, intl) ??
        intl.formatMessage(messages.factorVoucherOrderShare);
      const codeNode =
        contributor.code &&
        intl.formatMessage(messages.voucherCodeLabel, { code: contributor.code });

      return (
        <>
          {nameNode}
          {codeNode && <> &middot; {codeNode}</>}
        </>
      );
    }
    case "order_promotion":
      return contributor.name ?? intl.formatMessage(messages.factorOrderPromotionShare);
    case "manual":
      return contributor.reason ?? intl.formatMessage(messages.factorManualOrderShare);
  }
}
