import Money from "@dashboard/components/Money";
import Skeleton from "@dashboard/components/Skeleton";
import { IMoney } from "@dashboard/utils/intl";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import { orderSummaryMessages } from "./messages";
import { useSummaryLineStyles } from "./styles";

interface SummaryLineProps {
  text: React.ReactNode;
  subText?: string;
  negative?: boolean;
  bold?: boolean;
  vertical?: boolean;
  money: IMoney | undefined;
  hideEmpty?: boolean;
  className?: string;
}

const SummaryLine: React.FC<SummaryLineProps> = ({
  text,
  subText,
  negative,
  bold,
  vertical = false,
  money,
  hideEmpty = false,
  className,
}) => {
  const classes = useSummaryLineStyles();
  const intl = useIntl();

  return (
    <li
      className={clsx(
        classes.root,
        {
          [classes.bold]: bold,
          [classes.horizontal]: !vertical,
        },
        className,
      )}
    >
      <dl>
        <dt>
          {text}
          {subText && (
            <span className={classes.subText}>
              {/* zero-width space: spacing is provided by <span> styling, we want better text auto-select */}
              &#8203;
              {subText}
            </span>
          )}
        </dt>
        <dd>
          {money === undefined ? (
            <Skeleton className={classes.moneySkeleton} />
          ) : money.amount === 0 && hideEmpty ? (
            <span>&mdash;</span>
          ) : (
            <>
              {negative && (
                <span
                  aria-label={intl.formatMessage(orderSummaryMessages.negative)}
                >
                  –&nbsp;
                </span>
              )}
              <Money money={money} />
            </>
          )}
        </dd>
      </dl>
    </li>
  );
};

export default SummaryLine;
