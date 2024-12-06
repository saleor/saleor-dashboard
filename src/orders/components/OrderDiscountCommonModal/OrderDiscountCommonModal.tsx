import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import PriceField from "@dashboard/components/PriceField";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { DiscountValueTypeEnum, MoneyFragment } from "@dashboard/graphql";
import { useUpdateEffect } from "@dashboard/hooks/useUpdateEffect";
import { buttonMessages } from "@dashboard/intl";
import { toFixed } from "@dashboard/utils/toFixed";
import { Button, CloseIcon, Input, Text } from "@saleor/macaw-ui-next";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import * as React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ORDER_LINE_DISCOUNT, OrderDiscountCommonInput, OrderDiscountType } from "./types";

type GetErrorMessageReturn = string | null;

const numbersRegex = /([0-9]+\.?[0-9]*)$/;
const messages = defineMessages({
  buttonLabel: {
    id: "QSnh4Y",
    defaultMessage: "Add",
    description: "add button label",
  },
  itemDiscountTitle: {
    id: "WTj17Z",
    defaultMessage: "Discount Item",
    description: "dialog title item discount",
  },
  orderDiscountTitle: {
    id: "YFDAaX",
    defaultMessage: "Discount this Order by:",
    description: "dialog title order discount",
  },
  percentageOption: {
    id: "WUf3Iu",
    defaultMessage: "Percentage",
    description: "percentage option",
  },
  fixedAmountOption: {
    id: "fo7nfa",
    defaultMessage: "Fixed Amount",
    description: "fixed amount",
  },
  invalidValue: {
    id: "IN5iJz",
    defaultMessage: "Invalid value",
    description: "value input helper text",
  },
  valueBiggerThatPrice: {
    defaultMessage: "Cannot be higher than the price",
    id: "VIdXPy",
    description: "value input helper text",
  },
  valueBiggerThat100: {
    defaultMessage: "Cannot be higher than 100%",
    id: "zHx85l",
    description: "value input helper text",
  },
  discountValueLabel: {
    id: "GAmGog",
    defaultMessage: "Discount value",
    description: "value input label",
  },
  discountReasonLabel: {
    id: "nvSJNR",
    defaultMessage: "Reason",
    description: "discount reason input lavel",
  },
});

export interface OrderDiscountCommonModalProps {
  maxPrice: MoneyFragment;
  onConfirm: (discount: OrderDiscountCommonInput) => void;
  onClose: () => void;
  onRemove: () => void;
  modalType: OrderDiscountType;
  existingDiscount: OrderDiscountCommonInput;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
}

const OrderDiscountCommonModal = ({
  maxPrice = { amount: 0, currency: "" },
  onConfirm,
  modalType,
  onClose,
  onRemove,
  existingDiscount,
  confirmStatus,
  removeStatus,
}: OrderDiscountCommonModalProps) => {
  const { currency, amount: maxAmount } = maxPrice;
  const getInitialDiscountValue = (calculationMode: DiscountValueTypeEnum) => {
    if (!existingDiscount?.value) {
      return "";
    }

    const stringifiedValue = existingDiscount.value.toString();

    if (calculationMode === DiscountValueTypeEnum.FIXED) {
      return parseFloat(stringifiedValue).toString();
    }

    return stringifiedValue;
  };
  const getInitialData = () => {
    const calculationMode = existingDiscount?.calculationMode || DiscountValueTypeEnum.PERCENTAGE;

    return {
      calculationMode,
      reason: existingDiscount?.reason || "",
      value: getInitialDiscountValue(calculationMode),
    };
  };
  const initialData = getInitialData();
  const [valueErrorMsg, setValueErrorMsg] = useState<string | null>(null);
  const [reason, setReason] = useState<string>(initialData.reason);
  const [value, setValue] = useState<string>(initialData.value);
  const [calculationMode, setCalculationMode] = useState<DiscountValueTypeEnum>(
    initialData.calculationMode,
  );
  const previousCalculationMode = useRef(calculationMode);
  const intl = useIntl();
  const discountTypeChoices = [
    {
      label: intl.formatMessage(messages.percentageOption),
      value: DiscountValueTypeEnum.PERCENTAGE,
    },
    {
      label: intl.formatMessage(messages.fixedAmountOption),
      value: DiscountValueTypeEnum.FIXED,
    },
  ];
  const isDiscountTypePercentage = calculationMode === DiscountValueTypeEnum.PERCENTAGE;
  const handleSetDiscountValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setValueErrorMsg(getErrorMessage(value));
    setValue(value);
  };
  const getParsedDiscountValue = () => parseFloat(value) || 0;
  const isAmountTooLarge = (value?: string) => {
    const topAmount = isDiscountTypePercentage ? 100 : maxAmount;

    if (value) {
      return (parseFloat(value) || 0) > topAmount;
    }

    return getParsedDiscountValue() > topAmount;
  };
  const getErrorMessage = (value: string): GetErrorMessageReturn => {
    if (isAmountTooLarge(value)) {
      if (calculationMode === DiscountValueTypeEnum.PERCENTAGE) {
        return intl.formatMessage(messages.valueBiggerThat100);
      }

      return intl.formatMessage(messages.valueBiggerThatPrice);
    }

    if (!numbersRegex.test(value)) {
      return intl.formatMessage(messages.invalidValue);
    }

    return null;
  };
  const handleConfirm = () => {
    onConfirm({
      calculationMode,
      reason,
      value: getParsedDiscountValue(),
    });
  };
  const setDefaultValues = () => {
    setReason(initialData.reason);
    setValue(initialData.value);
    setCalculationMode(initialData.calculationMode);
    setValueErrorMsg(null);
  };

  useEffect(setDefaultValues, [existingDiscount?.value, existingDiscount?.reason]);

  const handleValueConversion = () => {
    if (getParsedDiscountValue() === 0) {
      return;
    }

    const changedFromPercentageToFixed =
      previousCalculationMode.current === DiscountValueTypeEnum.PERCENTAGE &&
      calculationMode === DiscountValueTypeEnum.FIXED;
    const recalculatedValueFromPercentageToFixed = (
      (getParsedDiscountValue() * maxPrice.amount) /
      100
    ).toString();
    const recalculatedValueFromFixedToPercentage = (
      (getParsedDiscountValue() / maxPrice.amount) *
      100
    ).toString();
    const recalculatedValue = changedFromPercentageToFixed
      ? recalculatedValueFromPercentageToFixed
      : recalculatedValueFromFixedToPercentage;

    setValueErrorMsg(getErrorMessage(recalculatedValue));
    setValue(recalculatedValue);
    previousCalculationMode.current = calculationMode;
  };

  useUpdateEffect(handleValueConversion, [calculationMode]);

  const dialogTitle =
    modalType === ORDER_LINE_DISCOUNT ? messages.itemDiscountTitle : messages.orderDiscountTitle;
  const valueFieldSymbol = calculationMode === DiscountValueTypeEnum.FIXED ? currency : "%";
  const isSubmitDisabled = !getParsedDiscountValue() || !!valueErrorMsg || isAmountTooLarge();

  return (
    <DashboardCard borderRadius={3} gap={0}>
      <DashboardCard.Header>
        <Text display="block" fontWeight="bold" marginBottom={2}>
          {intl.formatMessage(dialogTitle)}
        </Text>
        <DashboardCard.Toolbar>
          <Button variant="tertiary" onClick={onClose}>
            <CloseIcon />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      <DashboardCard.Content borderRadius={6} __width={300}>
        <RadioGroupField
          choices={discountTypeChoices}
          name="discountType"
          value={calculationMode}
          onChange={event => setCalculationMode(event.target.value)}
        />
        <CardSpacer />
        <PriceField
          label={intl.formatMessage(messages.discountValueLabel)}
          error={!!valueErrorMsg}
          hint={valueErrorMsg || ""}
          value={toFixed(value, 2)}
          onChange={handleSetDiscountValue}
          currencySymbol={valueFieldSymbol}
        />
        <CardSpacer />
        <Input
          label={intl.formatMessage(messages.discountReasonLabel)}
          value={reason}
          data-test-id="discount-reason"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setReason(event.target.value)}
        />

        <DashboardCard.BottomActions justifyContent="flex-end" paddingX={0}>
          {existingDiscount && (
            <ConfirmButton
              data-test-id="button-remove"
              onClick={onRemove}
              variant="error"
              transitionState={removeStatus}
            >
              {intl.formatMessage(buttonMessages.remove)}
            </ConfirmButton>
          )}
          <ConfirmButton
            disabled={isSubmitDisabled}
            transitionState={confirmStatus}
            onClick={handleConfirm}
            variant="primary"
            data-test-id="submit"
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardCard.BottomActions>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderDiscountCommonModal;
