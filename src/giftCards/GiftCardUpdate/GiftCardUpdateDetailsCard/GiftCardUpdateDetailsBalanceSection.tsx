import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import CardSpacer from "@saleor/components/CardSpacer";
import Money from "@saleor/components/Money";
import classNames from "classnames";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";
import { useGiftCardDetailsBalanceStyles as useStyles } from "./styles";

const GiftCardUpdateDetailsBalanceSection: React.FC = () => {
  const classes = useStyles({});
  const intl = useIntl();

  const {
    giftCard: { currentBalance, initialBalance },
  } = useGiftCardDetails();

  const progressBarWidth = !!currentBalance.amount
    ? Math.floor((currentBalance.amount / initialBalance.amount) * 100)
    : 0;

  return (
    <>
      <div
        className={classNames(classes.labelsContainer, classes.wideContainer)}
      >
        <Typography>{intl.formatMessage(messages.cardBalanceLabel)}</Typography>
        <Typography className={classes.labelsContainer}>
          <Money money={currentBalance} />
          <HorizontalSpacer />
          /
          <HorizontalSpacer />
          <Typography component="span" color="textSecondary">
            <Money money={initialBalance} />
          </Typography>
        </Typography>
      </div>
      <CardSpacer />
      <div className={classes.balanceBar}>
        <div
          style={{ width: `${progressBarWidth}%` }}
          className={classes.balanceBarProgress}
        />
      </div>
    </>
  );
};

export default GiftCardUpdateDetailsBalanceSection;
