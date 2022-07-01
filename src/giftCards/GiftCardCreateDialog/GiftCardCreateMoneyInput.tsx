import TextWithSelectField from "@saleor/components/TextWithSelectField";
import { useChannelCurrenciesQuery } from "@saleor/graphql";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useLocalStorage from "@saleor/hooks/useLocalStorage";
import { mapSingleValueNodeToChoice } from "@saleor/utils/maps";
import * as React from "react";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  GiftCardBulkCreateFormErrors,
  GiftCardCreateCommonFormData,
} from "../GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import { giftCardCreateMessages as messages } from "./messages";
import { useGiftCardCreateFormStyles as useStyles } from "./styles";

interface GiftCardCreateMoneyInputProps {
  change: FormChange;
  errors: GiftCardBulkCreateFormErrors;
  data: Pick<GiftCardCreateCommonFormData, "balanceCurrency" | "balanceAmount">;
  set: (data: Partial<GiftCardCreateCommonFormData>) => void;
}

const GiftCardCreateMoneyInput: React.FC<GiftCardCreateMoneyInputProps> = ({
  errors,
  data: { balanceAmount, balanceCurrency },
  change,
  set,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const { data: channelCurrenciesData } = useChannelCurrenciesQuery({});

  const { channelCurrencies } = channelCurrenciesData?.shop;

  const [savedCurrency, setCurrency] = useLocalStorage(
    "giftCardCreateCurrency",
    undefined,
  );

  const getInitialCurrency = () => {
    if (
      savedCurrency &&
      !!channelCurrencies.find((currency: string) => currency === savedCurrency)
    ) {
      return savedCurrency;
    }

    return channelCurrencies[0];
  };

  useEffect(() => {
    set({
      balanceCurrency: getInitialCurrency(),
    });
  }, []);

  const handleInputChange = (event: ChangeEvent<any>) => {
    if (event.target?.name === "balanceCurrency") {
      setCurrency(event.target?.value);
    }

    change(event);
  };

  return (
    <TextWithSelectField
      isError={!!errors?.balance}
      helperText={getGiftCardErrorMessage(errors?.balance, intl)}
      change={handleInputChange}
      choices={mapSingleValueNodeToChoice(channelCurrencies)}
      containerClassName={classes.fullWidthContainer}
      textFieldProps={{
        type: "float",
        label: intl.formatMessage(messages.amountLabel),
        name: "balanceAmount",
        value: balanceAmount,
        minValue: 0,
      }}
      selectFieldProps={{
        name: "balanceCurrency",
        value: balanceCurrency,
        className: classes.currencySelectField,
      }}
    />
  );
};

export default GiftCardCreateMoneyInput;
