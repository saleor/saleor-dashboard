import {
  DialogContent,
  Divider,
  TextField,
  Typography
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import TextWithSelectField from "@saleor/components/TextWithSelectField";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import useForm from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import { mapSingleValueNodeToChoice } from "@saleor/utils/maps";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardExpirySelect from "../components/GiftCardExpirySelect/GiftCardExpirySelect";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import GiftCardCustomerSelectField from "./GiftCardCustomerSelectField";
import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateDialogFormStyles as useStyles } from "./styles";
import {
  GiftCardCommonFormData,
  GiftCardCreateFormCustomer,
  GiftCardExpiryType
} from "./types";

export interface GiftCardCreateFormData extends GiftCardCommonFormData {
  note: string;
  selectedCustomer?: GiftCardCreateFormCustomer;
  expirySelected: boolean;
  expiryType: GiftCardExpiryType;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  requiresActivation: boolean;
}

const initialCustomer = { email: "", name: "" };

export const initialData: GiftCardCreateFormData = {
  tag: "",
  balanceAmount: 1,
  balanceCurrency: null,
  note: "",
  expirySelected: false,
  expiryType: "EXPIRY_PERIOD",
  expiryDate: "",
  expiryPeriodType: TimePeriodTypeEnum.MONTH,
  expiryPeriodAmount: 12,
  requiresActivation: true
};

interface GiftCardCreateDialogFormProps {
  opts: { status: ConfirmButtonTransitionState };
  apiErrors: GiftCardError[];
  onSubmit: (data: GiftCardCreateFormData) => void;
  onClose: () => void;
  channelCurrencies: string[];
}

const GiftCardCreateDialogForm: React.FC<GiftCardCreateDialogFormProps> = ({
  onSubmit,
  opts,
  onClose,
  apiErrors,
  channelCurrencies
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const initialCurrency = channelCurrencies[0];

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
    ["tag", "expiryDate", "customer", "currency", "amount", "balance"],
    apiErrors
  );

  const {
    tag,
    balanceAmount,
    balanceCurrency,
    expirySelected,
    expiryType,
    expiryPeriodAmount,
    expiryPeriodType,
    expiryDate,
    requiresActivation
  } = data;

  return (
    <>
      <DialogContent>
        <TextWithSelectField
          isError={!!formErrors?.balance}
          helperText={getGiftCardErrorMessage(formErrors?.balance, intl)}
          change={change}
          choices={mapSingleValueNodeToChoice(channelCurrencies)}
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
          expirySelected={expirySelected}
          expiryType={expiryType}
          expiryPeriodAmount={expiryPeriodAmount}
          expiryPeriodType={expiryPeriodType}
          expiryDate={expiryDate}
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
        <VerticalSpacer spacing={2} />
        <ControlledCheckbox
          name="requiresActivation"
          label={
            <>
              <FormattedMessage {...messages.requiresActivationLabel} />
              <Typography variant="caption">
                <FormattedMessage {...messages.requiresActivationCaption} />
              </Typography>
            </>
          }
          checked={requiresActivation}
          onChange={change}
        />
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
