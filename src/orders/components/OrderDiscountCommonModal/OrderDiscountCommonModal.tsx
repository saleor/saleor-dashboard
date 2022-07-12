import {
  Card,
  CardContent,
  Popper,
  TextField,
  Typography,
} from "@material-ui/core";
import { PopperPlacementType } from "@material-ui/core/Popper";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import ConfirmButton from "@saleor/components/ConfirmButton";
import PriceField from "@saleor/components/PriceField";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { DiscountValueTypeEnum, MoneyFragment } from "@saleor/graphql";
import { useUpdateEffect } from "@saleor/hooks/useUpdateEffect";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import React, {
  ChangeEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { defineMessages, useIntl } from "react-intl";

import ModalTitle from "./ModalTitle";
import {
  ORDER_LINE_DISCOUNT,
  OrderDiscountCommonInput,
  OrderDiscountType,
} from "./types";

const fullNumbersRegex = /^[0-9]*$/;
const numbersRegex = /([0-9]+\.?[0-9]*)$/;
const PERMIL = 0.01;

const useStyles = makeStyles(
  theme => ({
    container: {
      zIndex: 1000,
      marginTop: theme.spacing(1),
    },
    removeButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main,
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
    radioContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    reasonInput: {
      marginTop: theme.spacing(1),
      width: "100%",
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "row",
      flex: 1,
    },
  }),
  { name: "OrderLineDiscountModal" },
);

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
  anchorRef: MutableRefObject<any>;
  existingDiscount: OrderDiscountCommonInput;
  dialogPlacement: PopperPlacementType;
  isOpen: boolean;
  confirmStatus: ConfirmButtonTransitionState;
  removeStatus: ConfirmButtonTransitionState;
}

const OrderDiscountCommonModal: React.FC<OrderDiscountCommonModalProps> = ({
  maxPrice = { amount: null, currency: "" },
  onConfirm,
  modalType,
  anchorRef,
  onClose,
  onRemove,
  existingDiscount,
  dialogPlacement,
  isOpen,
  confirmStatus,
  removeStatus,
}) => {
  const { currency, amount: maxAmount } = maxPrice;

  const getInitialDiscountValue = (calculationMode: DiscountValueTypeEnum) => {
    if (!existingDiscount?.value) {
      return "";
    }

    const stringifiedValue = existingDiscount.value.toString();

    if (calculationMode === DiscountValueTypeEnum.FIXED) {
      return parseFloat(stringifiedValue).toFixed(2);
    }

    return stringifiedValue;
  };

  const getInitialData = () => {
    const calculationMode =
      existingDiscount?.calculationMode || DiscountValueTypeEnum.PERCENTAGE;

    return {
      calculationMode,
      reason: existingDiscount?.reason || "",
      value: getInitialDiscountValue(calculationMode),
    };
  };

  const initialData = getInitialData();

  const [isValueError, setValueError] = useState<boolean>(false);
  const [reason, setReason] = useState<string>(initialData.reason);
  const [value, setValue] = useState<string>(initialData.value);
  const [calculationMode, setCalculationMode] = useState<DiscountValueTypeEnum>(
    initialData.calculationMode,
  );
  const previousCalculationMode = useRef(calculationMode);

  const classes = useStyles({});
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

  const isDiscountTypePercentage =
    calculationMode === DiscountValueTypeEnum.PERCENTAGE;

  const handleSetDiscountValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    handleSetError(value);
    setValue(value);
  };

  const getParsedDiscountValue = () => parseFloat(value) || 0;

  const isAmountTooLarge = () => {
    const topAmount = isDiscountTypePercentage ? 100 : maxAmount;

    return getParsedDiscountValue() > topAmount;
  };

  const handleSetError = (value: string) => {
    const regexToCheck = isDiscountTypePercentage
      ? fullNumbersRegex
      : numbersRegex;

    setValueError(!regexToCheck.test(value));
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
    setValueError(false);
  };

  useEffect(setDefaultValues, [
    existingDiscount?.value,
    existingDiscount?.reason,
  ]);

  const handleValueConversion = () => {
    if (getParsedDiscountValue() === 0) {
      return;
    }

    const changedFromPercentageToFixed =
      previousCalculationMode.current === DiscountValueTypeEnum.PERCENTAGE &&
      calculationMode === DiscountValueTypeEnum.FIXED;

    const recalculatedValueFromPercentageToFixed = (
      getParsedDiscountValue() *
      PERMIL *
      maxPrice.amount
    ).toFixed(2);

    const recalculatedValueFromFixedToPercentage = Math.round(
      (getParsedDiscountValue() * (1 / PERMIL)) / maxPrice.amount,
    ).toString();

    const recalculatedValue = changedFromPercentageToFixed
      ? recalculatedValueFromPercentageToFixed
      : recalculatedValueFromFixedToPercentage;

    handleSetError(recalculatedValue);
    setValue(recalculatedValue);
  };

  useUpdateEffect(handleValueConversion, [calculationMode]);

  const dialogTitle =
    modalType === ORDER_LINE_DISCOUNT
      ? messages.itemDiscountTitle
      : messages.orderDiscountTitle;

  const valueFieldSymbol =
    calculationMode === DiscountValueTypeEnum.FIXED ? currency : "%";

  const isSubmitDisabled =
    !getParsedDiscountValue() || isValueError || isAmountTooLarge();

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorRef.current}
      className={classes.container}
      placement={dialogPlacement}
    >
      <Card>
        <ModalTitle title={intl.formatMessage(dialogTitle)} onClose={onClose} />
        <CardContent>
          <RadioGroupField
            innerContainerClassName={classes.radioContainer}
            choices={discountTypeChoices}
            name="discountType"
            variant="inlineJustify"
            value={calculationMode}
            onChange={event => setCalculationMode(event.target.value)}
          />
          <CardSpacer />
          <PriceField
            label={intl.formatMessage(messages.discountValueLabel)}
            error={isValueError}
            hint={isValueError && intl.formatMessage(messages.invalidValue)}
            value={value}
            onChange={handleSetDiscountValue}
            currencySymbol={valueFieldSymbol}
          />
          <CardSpacer />
          <Typography>
            {intl.formatMessage(messages.discountReasonLabel)}
          </Typography>
          <TextField
            className={classes.reasonInput}
            label={intl.formatMessage(messages.discountReasonLabel)}
            value={reason}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setReason(event.target.value)
            }
          />
        </CardContent>
        <DialogButtons
          onConfirm={handleConfirm}
          onClose={onClose}
          disabled={isSubmitDisabled}
          showBackButton={false}
          confirmButtonState={confirmStatus}
        >
          {existingDiscount && (
            <div className={classes.buttonWrapper}>
              <ConfirmButton
                data-test-id="button-remove"
                onClick={onRemove}
                className={classes.removeButton}
                transitionState={removeStatus}
              >
                {intl.formatMessage(buttonMessages.remove)}
              </ConfirmButton>
            </div>
          )}
        </DialogButtons>
      </Card>
    </Popper>
  );
};

export default OrderDiscountCommonModal;
