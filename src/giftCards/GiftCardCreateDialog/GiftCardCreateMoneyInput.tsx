// @ts-strict-ignore
import TextWithSelectField from "@dashboard/components/TextWithSelectField";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { mapSingleValueNodeToChoice } from "@dashboard/utils/maps";
import * as React from "react";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  GiftCardBulkCreateFormErrors,
  GiftCardCreateCommonFormData,
} from "../GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import { useChannelCurrenciesWithCache } from "../hooks/useChannelCurrenciesWithCache";
import { giftCardCreateMessages as messages } from "./messages";

interface GiftCardCreateMoneyInputProps {
  change: FormChange;
  errors: GiftCardBulkCreateFormErrors;
  data: Pick<GiftCardCreateCommonFormData, "balanceCurrency" | "balanceAmount">;
  set: (data: Partial<GiftCardCreateCommonFormData>) => void;
}

export const GiftCardCreateMoneyInput = ({
  errors,
  data: { balanceAmount, balanceCurrency },
  change,
  set,
}: GiftCardCreateMoneyInputProps) => {
  const intl = useIntl();
  const [savedCurrency, setCurrency] = useLocalStorage("giftCardCreateCurrency", undefined);
  const { loadingChannelCurrencies, channelCurrencies } = useChannelCurrenciesWithCache();

  const getInitialCurrency = React.useCallback(() => {
    if (
      savedCurrency &&
      !!channelCurrencies?.find((currency: string) => currency === savedCurrency)
    ) {
      return savedCurrency;
    }

    if (channelCurrencies?.length > 0) {
      return channelCurrencies[0];
    }

    return null;
  }, [channelCurrencies, savedCurrency]);

  useEffect(() => {
    const initialCurrency = getInitialCurrency();

    if (initialCurrency && !balanceCurrency) {
      set({
        balanceCurrency: getInitialCurrency(),
      });
    }
  }, [balanceCurrency, getInitialCurrency, set]);

  const handleInputChange = (event: ChangeEvent<any>) => {
    if (event.target?.name === "balanceCurrency") {
      setCurrency(event.target?.value);
    }

    change(event);
  };

  return (
    <TextWithSelectField
      loading={loadingChannelCurrencies}
      isError={!!errors?.balance}
      helperText={getGiftCardErrorMessage(errors?.balance, intl)}
      change={handleInputChange}
      choices={mapSingleValueNodeToChoice(channelCurrencies ?? [])}
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
      }}
    />
  );
};
