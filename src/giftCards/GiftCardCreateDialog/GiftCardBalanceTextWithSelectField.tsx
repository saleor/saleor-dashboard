import TextWithSelectField from "@saleor/components/TextWithSelectField";
import useShop from "@saleor/hooks/useShop";
import { makeStyles } from "@saleor/macaw-ui";
import { mapSingleValueNodeToChoice } from "@saleor/utils/maps";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardCreateFormContext } from "./GiftCardCreateFormProvider";
import { giftCardCreateDialogMessages as messages } from "./messages";

const useStyles = makeStyles(
  () => ({
    currencySelectField: {
      width: 100
    },
    balanceContainer: { width: "100%" }
  }),
  { name: "GiftCardBalanceTextWithSelectField" }
);

const GiftCardBalanceTextWithSelectField: React.FC = ({}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const { channelCurrencies } = useShop();

  const {
    change,
    data: { balanceAmount, balanceCurrency }
  } = useContext(GiftCardCreateFormContext);

  return (
    <TextWithSelectField
      textFieldLabel={intl.formatMessage(messages.amountLabel)}
      change={change}
      choices={mapSingleValueNodeToChoice(channelCurrencies)}
      textFieldName="balanceAmount"
      selectFieldName="balanceCurrency"
      textFieldValue={balanceAmount}
      selectFieldValue={balanceCurrency}
      selectFieldClassName={classes.currencySelectField}
      containerClassName={classes.balanceContainer}
    />
  );
};

export default GiftCardBalanceTextWithSelectField;
