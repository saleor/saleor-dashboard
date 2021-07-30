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

const GiftCardBalanceTextWithSelectField: React.FC = () => {
  const intl = useIntl();
  const classes = useStyles({});
  const { channelCurrencies } = useShop();

  const {
    change,
    data: { balanceAmount, balanceCurrency }
  } = useContext(GiftCardCreateFormContext);

  return (
    <TextWithSelectField
      change={change}
      choices={mapSingleValueNodeToChoice(channelCurrencies)}
      containerClassName={classes.balanceContainer}
      textFieldProps={{
        type: "number",
        label: intl.formatMessage(messages.amountLabel),
        name: "balanceAmount",
        value: balanceAmount
      }}
      selectFieldProps={{
        name: "balanceCurrency",
        value: balanceCurrency,
        className: classes.currencySelectField
      }}
    />
  );
};

export default GiftCardBalanceTextWithSelectField;
