import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import Money from "@saleor/components/Money";
import useTheme from "@saleor/hooks/useTheme";
import { makeStyles } from "@saleor/theme";
import classNames from "classnames";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardDetailsContext } from "../GiftCardDetailsProvider";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    labelsContainer: {
      display: "flex",
      alignItems: "baseline"
    },
    wideContainer: {
      justifyContent: "space-between"
    },
    balanceBar: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      height: 36,
      padding: "0 4px",
      backgroundColor: theme.palette.background.default,
      borderRadius: 18
    },
    balanceBarProgress: {
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.palette.primary.light
    },
    balanceBarProgressDark: {
      backgroundColor: theme.palette.primary.dark
    }
  }),
  { name: "GiftCardUpdateDetailsBalanceSection" }
);

const GiftCardUpdateDetailsBalanceSection: React.FC = () => {
  const { isDark } = useTheme();
  const classes = useStyles({});
  const intl = useIntl();

  const {
    giftCard: { currentBalance, initialBalance }
  } = useContext(GiftCardDetailsContext);

  const progressBarWidth = !!currentBalance.amount
    ? Math.floor((currentBalance.amount / initialBalance.amount) * 100)
    : 0;

  return (
    <>
      <div
        className={classNames(classes.labelsContainer, classes.wideContainer)}
      >
        <Typography>{intl.formatMessage(messages.cardBalanceLabel)}</Typography>
        <div className={classes.labelsContainer}>
          <Money money={currentBalance} />
          <HorizontalSpacer />
          /
          <HorizontalSpacer />
          <Money money={initialBalance} />
        </div>
      </div>
      <CardSpacer />
      <div className={classes.balanceBar}>
        <div
          style={{ width: `${progressBarWidth}%` }}
          className={classNames(classes.balanceBarProgress, {
            [classes.balanceBarProgressDark]: isDark
          })}
        />
      </div>
    </>
  );
};

export default GiftCardUpdateDetailsBalanceSection;
