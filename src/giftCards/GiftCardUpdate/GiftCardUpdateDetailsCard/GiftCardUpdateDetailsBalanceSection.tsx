// @ts-strict-ignore
import CardSpacer from "@dashboard/components/CardSpacer";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import Money from "@dashboard/components/Money";
import { Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";
import { useGiftCardDetailsBalanceStyles as useStyles } from "./styles";

const GiftCardUpdateDetailsBalanceSection = () => {
  const classes = useStyles({});
  const intl = useIntl();
  const {
    giftCard: { currentBalance, initialBalance },
  } = useGiftCardDetails();

  return (
    <>
      <div className={clsx(classes.labelsContainer, classes.wideContainer)}>
        <Text>{intl.formatMessage(messages.cardBalanceLabel)}</Text>
        <Text className={classes.labelsContainer}>
          <Money money={currentBalance} />
          <HorizontalSpacer />
          /
          <HorizontalSpacer />
          <Text as="span" color="default2">
            <Money money={initialBalance} />
          </Text>
        </Text>
      </div>
      <CardSpacer />
    </>
  );
};

export default GiftCardUpdateDetailsBalanceSection;
