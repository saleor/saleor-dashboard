import {
  Button,
  Card,
  CardContent,
  Popper,
  TextField,
  Typography
} from "@material-ui/core";
import { PopperPlacementType } from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import PriceField from "@saleor/components/PriceField";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { buttonMessages } from "@saleor/intl";
import React, { ChangeEvent, MutableRefObject, useState } from "react";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";

import {
  ORDER_LINE_DISCOUNT,
  OrderDiscountCalculationMode,
  OrderDiscountData,
  OrderDiscountType
} from "./types";

const fullNumbersRegex = /^[0-9]*$/;
const numbersRegex = /([0-9]+\.?[0-9]*)$/;

const useStyles = makeStyles(
  theme => ({
    container: {
      zIndex: 1000,
      marginTop: theme.spacing(1)
    },
    removeButton: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    },
    radioContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    reasonInput: {
      marginTop: theme.spacing(1),
      width: "100%"
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "row",
      flex: 1
    }
  }),
  { name: "OrderLineDiscountModal" }
);

const messages = defineMessages({
  buttonLabel: {
    defaultMessage: "Add",
    description: "add button label"
  },
  itemDiscountTitle: {
    defaultMessage: "Discount Item",
    description: "dialog title item discount"
  },
  orderDiscountTitle: {
    defaultMessage: "Discount this Order by:",
    description: "dialog title order discount"
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
  onConfirm: (discount: OrderDiscountData) => void;
  onClose: () => void;
  onRemove: () => void;
  modalType: OrderDiscountType;
  isOpen: boolean;
  anchorRef: MutableRefObject<any>;
  existingDiscount: OrderDiscountData;
  dialogPlacement: PopperPlacementType;
}

const OrderLineDiscountModal: React.FC<OrderLineDiscountModalProps> = ({
  currency = "",
  maxAmount = 0,
  onConfirm,
  modalType,
  isOpen,
  anchorRef,
  onClose,
  onRemove,
  existingDiscount,
  dialogPlacement
}) => {
  const initialType = OrderDiscountCalculationMode.PERCENTAGE;

  const [discountReason, setDiscountReason] = useState<string>("");
  const [discountValue, setDiscountValue] = useState<string>("");
  const [isValueError, setValueError] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<
    OrderDiscountCalculationMode
  >(initialType);

  const classes = useStyles({});
  const intl = useIntl();

  const discountTypeChoices = [
    {
      label: intl.formatMessage(messages.percentageOption),
      value: OrderDiscountCalculationMode.PERCENTAGE
    },
    {
      label: intl.formatMessage(messages.fixedAmountOption),
      value: OrderDiscountCalculationMode.FIXED_AMOUNT
    }
  ];

  const isDiscountTypePercentage =
    discountType === OrderDiscountCalculationMode.PERCENTAGE;

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

  const handleConfirm = () => {
    onConfirm({
      type: discountType,
      reason: discountReason,
      value: getParsedDiscountValue()
    });
    setDefaultValues();
  };

  const setDefaultValues = () => {
    setDiscountReason("");
    setDiscountValue("");
    setDiscountType(initialType);
    setValueError(false);
  };

  const dialogTitle =
    modalType === ORDER_LINE_DISCOUNT
      ? messages.itemDiscountTitle
      : messages.orderDiscountTitle;

  const valueFieldSymbol =
    discountType === OrderDiscountCalculationMode.FIXED_AMOUNT ? currency : "%";

  const isSubmitDisabled =
    !getParsedDiscountValue() || isValueError || isAmountTooLarge();

  const displayRemoveButton = !!existingDiscount;

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorRef.current}
      className={classes.container}
      placement={dialogPlacement}
    >
      <Card>
        <CardTitle title={intl.formatMessage(dialogTitle)} />
        <CardContent>
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
        </CardContent>
        <DialogButtons
          onConfirm={handleConfirm}
          onClose={onClose}
          disabled={isSubmitDisabled}
          showBackButton={!displayRemoveButton}
        >
          {displayRemoveButton && (
            <div className={classes.buttonWrapper}>
              <Button
                data-test="button-remove"
                onClick={onRemove}
                variant="contained"
                className={classes.removeButton}
              >
                {intl.formatMessage(buttonMessages.remove)}
              </Button>
            </div>
          )}
        </DialogButtons>
      </Card>
    </Popper>
  );
};

export default OrderLineDiscountModal;
