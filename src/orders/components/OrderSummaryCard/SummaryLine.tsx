import Money from "@saleor/components/Money";
import Skeleton from "@saleor/components/Skeleton";
import { makeStyles } from "@saleor/macaw-ui";
import { IMoney } from "@saleor/utils/intl";
import clsx from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import { orderSummaryMessages } from "./messages";

interface SummaryLineProps {
  text: React.ReactNode;
  subText?: string;
  negative?: boolean;
  bold?: boolean;
  vertical?: boolean;
  money: IMoney | undefined;
  className?: string;
}

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "flex",
    },
    subText: {
      color: theme.palette.saleor.main[3],
      marginLeft: theme.spacing(1),
    },
    bold: {
      fontWeight: 600,
    },
    horizontal: {
      "&& dl": {
        display: "flex",
        width: "100%",
        gap: theme.spacing(2),
      },
      "&& dd": {
        marginLeft: "auto",
        display: "flex",
        alignItems: "baseline",
      },
    },
    moneySkeleton: {
      width: "6ch",
      alignSelf: "center",
    },
  }),
  { name: "SummaryLine" },
);

const SummaryLine: React.FC<SummaryLineProps> = ({
  text,
  subText,
  negative,
  bold,
  vertical = false,
  money,
  className,
}) => {
  const classes = useStyles();
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
