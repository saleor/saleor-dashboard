import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { DiscountValueTypeEnum, MoneyFragment } from "@saleor/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import Label from "../Label";

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      flexDirection: "column",
    },
    horizontalContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline",
    },
  }),
  { name: "MoneySection" },
);

export const messages = defineMessages({
  discount: {
    id: "yJynYK",
    defaultMessage: "discount",
    description: "discount value",
  },
  fixedAmount: {
    id: "Zhxu58",
    defaultMessage: "Fixed amount",
    description: "Fixed amount subtitle",
  },

  newDiscountSectionTitle: {
    id: "MTl5o6",
    defaultMessage: "New discount value",
    description: "new discount label",
  },
  oldDiscountSectionTitle: {
    id: "2Sx05f",
    defaultMessage: "Previous discount value",
    description: "Previous discount label",
  },
  onlyDiscountSectionTitle: {
    id: "ojHyj3",
    defaultMessage: "discount value",
    description: "discount value label",
  },
});

export enum MoneySectionType {
  OLD = "old",
  NEW = "new",
  ONLY = "only",
}

interface MoneySectionProps {
  value?: number;
  calculationMode?: DiscountValueTypeEnum;
  moneyData?: MoneyFragment;
  sectionType?: MoneySectionType;
}

const MoneySection: React.FC<MoneySectionProps> = ({
  value,
  calculationMode,
  moneyData,
  sectionType = MoneySectionType.ONLY,
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  if (!value) {
    return null;
  }

  const getDiscountSubitle = () => {
    const isDiscountedByPercent =
      calculationMode === DiscountValueTypeEnum.PERCENTAGE;

    if (isDiscountedByPercent) {
      return `${value}% ${intl.formatMessage(messages.discount)}`;
    }

    return intl.formatMessage(messages.fixedAmount);
  };

  const sectionTitleMessageKey = `${sectionType}DiscountSectionTitle`;

  return (
    <div className={classes.container}>
      <Label text={intl.formatMessage(messages[sectionTitleMessageKey])} />
      <div className={classes.horizontalContainer}>
        <Typography>{`${moneyData.amount} ${moneyData.currency}`}</Typography>
        <HorizontalSpacer />
        <Label text={getDiscountSubitle()} />
      </div>
    </div>
  );
};

export default MoneySection;
