import { Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { Money } from "@saleor/fragments/types/Money";
import { makeStyles } from "@saleor/theme";
import { DiscountValueTypeEnum } from "@saleor/types/globalTypes";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import Label from "../Label";

const useStyles = makeStyles(
  () => ({
    container: {
      display: "flex",
      flexDirection: "column"
    },
    horizontalContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "baseline"
    }
  }),
  { name: "MoneySection" }
);

export const messages = defineMessages({
  discount: {
    defaultMessage: "discount",
    description: "discount value",
    id: "discount value id"
  },
  fixedAmount: {
    defaultMessage: "Fixed amount",
    description: "Fixed amount subtitle",
    id: "fixed amount subtitle id"
  },

  newDiscountSectionTitle: {
    defaultMessage: "New discount value",
    description: "new discount label",
    id: "new discount label id"
  },
  oldDiscountSectionTitle: {
    defaultMessage: "Previous discount value",
    description: "Previous discount label",
    id: "Previous discount label id"
  },
  onlyDiscountSectionTitle: {
    defaultMessage: "discount value",
    description: "discount value label",
    id: "discount value label id"
  }
});

export enum MoneySectionType {
  OLD = "old",
  NEW = "new",
  ONLY = "only"
}

interface MoneySectionProps {
  value?: number;
  calculationMode?: DiscountValueTypeEnum;
  moneyData?: Money;
  sectionType?: MoneySectionType;
}

const MoneySection: React.FC<MoneySectionProps> = ({
  value,
  calculationMode,
  moneyData,
  sectionType = MoneySectionType.ONLY
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
