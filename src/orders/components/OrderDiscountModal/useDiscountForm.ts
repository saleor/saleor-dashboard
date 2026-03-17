import { DiscountValueTypeEnum, type MoneyFragment } from "@dashboard/graphql";
import { type ChangeEvent as FormChangeEvent } from "@dashboard/hooks/useForm";
import { useUpdateEffect } from "@dashboard/hooks/useUpdateEffect";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { type OrderDiscountCommonInput } from "./types";

const numbersRegex = /^[0-9]*\.?[0-9]+$/;

interface UseDiscountFormProps {
  maxPrice: MoneyFragment;
  existingDiscount?: OrderDiscountCommonInput;
  isOpen?: boolean;
}

export const useDiscountForm = ({ maxPrice, existingDiscount, isOpen }: UseDiscountFormProps) => {
  const intl = useIntl();
  const { currency, amount: maxAmount } = maxPrice;

  const getInitialDiscountValue = useCallback(
    (calculationMode: DiscountValueTypeEnum) => {
      if (!existingDiscount?.value) {
        return "";
      }

      const stringifiedValue = existingDiscount.value.toString();

      if (calculationMode === DiscountValueTypeEnum.FIXED) {
        return parseFloat(stringifiedValue).toString();
      }

      return stringifiedValue;
    },
    [existingDiscount?.value],
  );

  const getInitialData = useCallback(() => {
    const calculationMode = existingDiscount?.calculationMode || DiscountValueTypeEnum.PERCENTAGE;

    return {
      calculationMode,
      reason: existingDiscount?.reason || "",
      value: getInitialDiscountValue(calculationMode),
    };
  }, [existingDiscount?.calculationMode, existingDiscount?.reason, getInitialDiscountValue]);

  const initialData = getInitialData();
  const [valueErrorMsg, setValueErrorMsg] = useState<string | null>(null);
  const [reason, setReason] = useState<string>(initialData.reason);
  const [value, setValue] = useState<string>(initialData.value);
  const [calculationMode, setCalculationMode] = useState<DiscountValueTypeEnum>(
    initialData.calculationMode,
  );
  const previousCalculationMode = useRef(calculationMode);

  const isDiscountTypePercentage = calculationMode === DiscountValueTypeEnum.PERCENTAGE;

  const getParsedDiscountValue = useCallback(() => parseFloat(value) || 0, [value]);

  const isAmountTooLarge = useCallback(
    (checkValue?: string) => {
      const topAmount = isDiscountTypePercentage ? 100 : maxAmount;

      if (checkValue) {
        return (parseFloat(checkValue) || 0) > topAmount;
      }

      return getParsedDiscountValue() > topAmount;
    },
    [isDiscountTypePercentage, maxAmount, getParsedDiscountValue],
  );

  const getErrorMessage = useCallback(
    (checkValue: string): string | null => {
      if (isAmountTooLarge(checkValue)) {
        if (calculationMode === DiscountValueTypeEnum.PERCENTAGE) {
          return intl.formatMessage(messages.valueBiggerThat100);
        }

        return intl.formatMessage(messages.valueBiggerThatPrice);
      }

      if (!numbersRegex.test(checkValue)) {
        return intl.formatMessage(messages.invalidValue);
      }

      return null;
    },
    [isAmountTooLarge, calculationMode, intl],
  );

  const handleSetDiscountValue = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      setValueErrorMsg(getErrorMessage(newValue));
      setValue(newValue);
    },
    [getErrorMessage],
  );

  const handleSetReason = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  }, []);

  const handleSetCalculationMode = useCallback((event: FormChangeEvent) => {
    setCalculationMode(event.target.value as DiscountValueTypeEnum);
  }, []);

  const getDiscountData = useCallback(
    (): OrderDiscountCommonInput => ({
      calculationMode,
      reason,
      value: getParsedDiscountValue(),
    }),
    [calculationMode, reason, getParsedDiscountValue],
  );

  const resetForm = useCallback(() => {
    const data = getInitialData();

    setReason(data.reason);
    setValue(data.value);
    setCalculationMode(data.calculationMode);
    setValueErrorMsg(null);
  }, [getInitialData]);

  useEffect(resetForm, [resetForm, existingDiscount?.value, existingDiscount?.reason, isOpen]);

  const handleValueConversion = useCallback(() => {
    if (getParsedDiscountValue() === 0) {
      return;
    }

    const changedFromPercentageToFixed =
      previousCalculationMode.current === DiscountValueTypeEnum.PERCENTAGE &&
      calculationMode === DiscountValueTypeEnum.FIXED;
    const recalculatedValueFromPercentageToFixed = (
      (getParsedDiscountValue() * maxAmount) /
      100
    ).toString();
    const recalculatedValueFromFixedToPercentage = (
      (getParsedDiscountValue() / maxAmount) *
      100
    ).toString();
    const recalculatedValue = changedFromPercentageToFixed
      ? recalculatedValueFromPercentageToFixed
      : recalculatedValueFromFixedToPercentage;

    setValueErrorMsg(getErrorMessage(recalculatedValue));
    setValue(recalculatedValue);
    previousCalculationMode.current = calculationMode;
  }, [calculationMode, getParsedDiscountValue, maxAmount, getErrorMessage]);

  useUpdateEffect(handleValueConversion, [calculationMode]);

  const valueFieldSymbol = calculationMode === DiscountValueTypeEnum.FIXED ? currency : "%";
  const isSubmitDisabled = !getParsedDiscountValue() || !!valueErrorMsg || isAmountTooLarge();

  return {
    value,
    reason,
    calculationMode,
    valueErrorMsg,
    valueFieldSymbol,
    isSubmitDisabled,
    handleSetDiscountValue,
    handleSetReason,
    handleSetCalculationMode,
    getDiscountData,
    resetForm,
  };
};
