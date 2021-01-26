import { TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ActionDialog from "@saleor/components/ActionDialog";
import CardSpacer from "@saleor/components/CardSpacer";
import PriceField from "@saleor/components/PriceField";
import RadioGroupField from "@saleor/components/RadioGroupField";
import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

import { OrderLineDiscount, OrderLineDiscountType } from "./types";

const fullNumbersRegex = /^[0-9]*$/;
const numbersRegex = /([0-9]+\.?[0-9]*)$/;

const useStyles = makeStyles(
  theme => ({
    radioContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    reasonInput: {
      marginTop: theme.spacing(1),
      width: "100%"
    }
  }),
  { name: "OrderLineDiscountModal" }
);

const messages = defineMessages({
  buttonLabel: {
    defaultMessage: "Add",
    description: "add button label"
  },
  title: {
    defaultMessage: "Discount Item",
    description: "dialog title"
  },
  percentageOption: {
    defaultMessage: "Percentage",
    description: "percentage option"
  },
  fixedAmountOption: {
    defaultMessage: "Fixed Amount",
    description: "fixed amount"
  },
  invalidValue: {
    defaultMessage: "Invalid value",
    description: "value input helper text"
  },
  discountValueLabel: {
    defaultMessage: "Discount value",
    description: "value input label"
  },
  discountReasonLabel: {
    defaultMessage: "Reason",
    description: "discount reason input lavel"
  }
});

interface OrderLineDiscountModalProps {
  currency: string;
  maxAmount: number;
  onConfirm: (discount: OrderLineDiscount) => void;
}

const OrderLineDiscountModal: React.FC<OrderLineDiscountModalProps> = ({
  currency = "",
  maxAmount = 0,
  onConfirm
}) => {
  const initialType = OrderLineDiscountType.PERCENTAGE;

  const classes = useStyles({});
  const intl = useIntl();

  const discountTypeChoices = [
    {
      label: intl.formatMessage(messages.percentageOption),
      value: OrderLineDiscountType.PERCENTAGE
    },
    {
      label: intl.formatMessage(messages.fixedAmountOption),
      value: OrderLineDiscountType.FIXED_AMOUNT
    }
  ];

  const [discountReason, setDiscountReason] = useState<string>("");
  const [discountValue, setDiscountValue] = useState<string>("");
  const [isValueError, setValueError] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<OrderLineDiscountType>(
    initialType
  );

  const isDiscountTypePercentage =
    discountType === OrderLineDiscountType.PERCENTAGE;

  const handleSetDiscountValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    handleSetError(value);
    setDiscountValue(value);
  };

  const getParsedDiscountValue = () => parseFloat(discountValue) || 0;

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

  const handleConfirm = () =>
    onConfirm({
      type: discountType,
      reason: discountReason,
      value: getParsedDiscountValue()
    });

  const valueFieldSymbol =
    discountType === OrderLineDiscountType.FIXED_AMOUNT ? currency : "%";

  const isSubmitDisabled = !discountValue || isValueError || isAmountTooLarge();

  return (
    <ActionDialog
      maxWidth="xs"
      disabled={isSubmitDisabled}
      //   confirmButtonState={confirmButtonState}
      confirmButtonLabel={intl.formatMessage(messages.buttonLabel)}
      open={true}
      onConfirm={handleConfirm}
      title={intl.formatMessage(messages.title)}
    >
      <RadioGroupField
        innerContainerClassName={classes.radioContainer}
        choices={discountTypeChoices}
        name="discountType"
        variant="inlineJustify"
        value={discountType}
        onChange={event => setDiscountType(event.target.value)}
      />
      <CardSpacer />
      <PriceField
        label={intl.formatMessage(messages.discountValueLabel)}
        error={isValueError}
        hint={isValueError && intl.formatMessage(messages.invalidValue)}
        value={discountValue}
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
        value={discountReason}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDiscountReason(event.target.value)
        }
      />
    </ActionDialog>
  );
};

export default OrderLineDiscountModal;
