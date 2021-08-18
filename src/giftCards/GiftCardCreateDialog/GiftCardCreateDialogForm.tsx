import { DialogContent, Divider, TextField } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import TextWithSelectField from "@saleor/components/TextWithSelectField";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import GiftCardExpirySelect from "@saleor/giftCards/components/GiftCardExpirySelect";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import useForm from "@saleor/hooks/useForm";
import useShop from "@saleor/hooks/useShop";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import {
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import { mapSingleValueNodeToChoice } from "@saleor/utils/maps";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import GiftCardCustomerSelectField from "./GiftCardCustomerSelectField";
import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateDialogFormStyles as useStyles } from "./styles";
import { GiftCardCommonFormData, GiftCardCreateFormCustomer } from "./types";

export interface GiftCardCreateFormData extends GiftCardCommonFormData {
  note: string;
  selectedCustomer?: GiftCardCreateFormCustomer;
}

const initialCustomer = { email: "", name: "" };

export const initialData: GiftCardCreateFormData = {
  tag: "",
  balanceAmount: 1,
  balanceCurrency: null,
  note: "",
  expiryDate: "",
  expiryType: GiftCardExpiryTypeEnum.EXPIRY_PERIOD,
  expiryPeriodType: TimePeriodTypeEnum.YEAR,
  expiryPeriodAmount: 1
};

interface GiftCardCreateDialogFormProps {
  opts: { status: ConfirmButtonTransitionState };
  apiErrors: GiftCardError[];
  onSubmit: (data: GiftCardCreateFormData) => void;
  onClose: () => void;
}

const GiftCardCreateDialogForm: React.FC<GiftCardCreateDialogFormProps> = ({
  onSubmit,
  opts,
  onClose,
  apiErrors
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const shop = useShop();

  // TEMP
  const initialCurrency = shop?.channelCurrencies?.[0];

  const [selectedCustomer, setSelectedCustomer] = useState<
    GiftCardCreateFormCustomer
  >(initialCustomer);

  const handleSubmit = (data: GiftCardCreateFormData) =>
    onSubmit({ ...data, selectedCustomer });

  const { submit, change, data } = useForm(
    { ...initialData, balanceCurrency: initialCurrency },
    handleSubmit
  );

  const formErrors = getFormErrors(
    [
      "tag",
      "expiryDate",
      "expiryPeriod",
      "customer",
      "currency",
      "amount",
      "balance"
    ],
    apiErrors
  );

  const {
    tag,
    expiryPeriodAmount,
    expiryPeriodType,
    expiryType,
    balanceAmount,
    balanceCurrency
  } = data;

  return (
    <>
      <DialogContent>
        <TextWithSelectField
          isError={!!formErrors?.balance}
          helperText={getGiftCardErrorMessage(formErrors?.balance, intl)}
          change={change}
          choices={mapSingleValueNodeToChoice(shop?.channelCurrencies)}
          containerClassName={classes.balanceContainer}
          textFieldProps={{
            type: "number",
            label: intl.formatMessage(messages.amountLabel),
            name: "balanceAmount",
            value: balanceAmount,
            minValue: 0
          }}
          selectFieldProps={{
            name: "balanceCurrency",
            value: balanceCurrency || initialCurrency,
            className: classes.currencySelectField
          }}
        />
        <CardSpacer />
        <GiftCardTagInput
          error={formErrors?.tag}
          name="tag"
          value={tag}
          change={change}
        />
        <CardSpacer />
        <Divider />
        <CardSpacer />
        <GiftCardCustomerSelectField
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
        <VerticalSpacer />
        <Label text={intl.formatMessage(messages.customerSubtitle)} />
        <CardSpacer />
        <Divider />
        <CardSpacer />
        <GiftCardExpirySelect
          errors={formErrors}
          change={change}
          expiryType={expiryType}
          expiryPeriodAmount={expiryPeriodAmount}
          expiryPeriodType={expiryPeriodType}
        />
        <CardSpacer />
        <TextField
          name="note"
          onChange={change}
          multiline
          className={classes.noteField}
          label={`${intl.formatMessage(
            messages.noteLabel
          )} *${intl.formatMessage(commonMessages.optionalField)}`}
        />
        <VerticalSpacer />
        <Label text={intl.formatMessage(messages.noteSubtitle)} />
      </DialogContent>
      <DialogButtons
        onConfirm={submit}
        confirmButtonLabel={intl.formatMessage(messages.issueButtonLabel)}
        confirmButtonState={opts?.status}
        onClose={onClose}
      />
    </>
  );
};

export default GiftCardCreateDialogForm;
