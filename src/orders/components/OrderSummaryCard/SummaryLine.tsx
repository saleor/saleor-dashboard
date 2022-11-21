import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import { IMoney } from "@saleor/utils/intl";
import clsx from "classnames";
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
  className?: string;
}

const SummaryLine: React.FC<SummaryLineProps> = ({
  text,
  subText,
  negative,
  bold,
  vertical = false,
  money,
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
