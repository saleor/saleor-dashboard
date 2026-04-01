import { DiscountValueTypeEnum, type MoneyFragment } from "@dashboard/graphql";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import { type OrderDiscountCommonInput } from "./types";

const numbersRegex = /^[0-9]*\.?[0-9]+$/;

export interface DiscountFormData {
  value: string;
  reason: string;
  calculationMode: DiscountValueTypeEnum;
}

interface UseDiscountFormProps {
  maxPrice: MoneyFragment;
  existingDiscount?: OrderDiscountCommonInput;
  isOpen?: boolean;
}

const parseNumericValue = (value: string): number => parseFloat(value) || 0;

function convertValue(
  value: number,
  maxAmount: number,
  from: DiscountValueTypeEnum,
  to: DiscountValueTypeEnum,
): string {
  if (value === 0 || maxAmount === 0 || from === to) {
    return value.toString();
  }

  const toFixed = from === DiscountValueTypeEnum.PERCENTAGE && to === DiscountValueTypeEnum.FIXED;
  const raw = toFixed ? (value * maxAmount) / 100 : (value / maxAmount) * 100;

  return (Math.round(raw * 100) / 100).toString();
}

export const useDiscountForm = ({ maxPrice, existingDiscount, isOpen }: UseDiscountFormProps) => {
  const intl = useIntl();
  const { currency, amount: maxAmount } = maxPrice;
  const previousCalculationMode = useRef<DiscountValueTypeEnum>(
    existingDiscount?.calculationMode || DiscountValueTypeEnum.PERCENTAGE,
  );

  const getDefaultValues = useCallback((): DiscountFormData => {
    const calculationMode = existingDiscount?.calculationMode || DiscountValueTypeEnum.PERCENTAGE;
    let value = "";

    if (existingDiscount?.value) {
      const stringifiedValue = existingDiscount.value.toString();

      value =
        calculationMode === DiscountValueTypeEnum.FIXED
          ? parseFloat(stringifiedValue).toString()
          : stringifiedValue;
    }

    return {
      calculationMode,
      reason: existingDiscount?.reason || "",
      value,
    };
  }, [existingDiscount?.calculationMode, existingDiscount?.reason, existingDiscount?.value]);

  const { control, watch, setValue, reset, getValues } = useForm<DiscountFormData>({
    defaultValues: getDefaultValues(),
  });

  const calculationMode = watch("calculationMode");
  const value = watch("value");

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);

    const data = getDefaultValues();

    reset(data);
    previousCalculationMode.current = data.calculationMode;
  }

  const handleCalculationModeChange = useCallback(
    (newMode: DiscountValueTypeEnum) => {
      const rawValue = getValues("value");

      if (rawValue === "") {
        setValue("calculationMode", newMode);
        previousCalculationMode.current = newMode;

        return;
      }

      const currentValue = parseNumericValue(rawValue);
      const converted = convertValue(
        currentValue,
        maxAmount,
        previousCalculationMode.current,
        newMode,
      );

      setValue("value", converted);
      setValue("calculationMode", newMode);
      previousCalculationMode.current = newMode;
    },
    [getValues, maxAmount, setValue],
  );

  // Validation is derived rather than stored in formState.errors because
  // the error depends on both `value` and `calculationMode` (cross-field),
  // and using setError/clearErrors in an effect causes infinite re-renders
  // with react-hook-form's proxy-based formState subscriptions.
  const valueErrorMsg = useMemo(() => {
    if (value === "") {
      return null;
    }

    const isPercentage = calculationMode === DiscountValueTypeEnum.PERCENTAGE;
    const topAmount = isPercentage ? 100 : maxAmount;
    const parsedValue = parseNumericValue(value);

    if (!numbersRegex.test(value)) {
      return intl.formatMessage(messages.invalidValue);
    }

    if (parsedValue > topAmount) {
      return isPercentage
        ? intl.formatMessage(messages.valueBiggerThan100)
        : intl.formatMessage(messages.valueBiggerThanPrice);
    }

    return null;
  }, [value, calculationMode, maxAmount, intl]);

  const parsedValue = parseNumericValue(value);
  const valueFieldSymbol = calculationMode === DiscountValueTypeEnum.FIXED ? currency : "%";
  const isSubmitDisabled = !parsedValue || !!valueErrorMsg;

  const getDiscountData = useCallback(
    (): OrderDiscountCommonInput => ({
      calculationMode: getValues("calculationMode"),
      reason: getValues("reason"),
      value: parseNumericValue(getValues("value")),
    }),
    [getValues],
  );

  return {
    control,
    setValue,
    getValues,
    valueFieldSymbol,
    isSubmitDisabled,
    getDiscountData,
    valueErrorMsg,
    onCalculationModeChange: handleCalculationModeChange,
  };
};
