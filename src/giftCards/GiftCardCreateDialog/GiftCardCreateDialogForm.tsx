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
import { Choices } from "@saleor/components/SingleSelectField";
import TextWithSelectField from "@saleor/components/TextWithSelectField";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import useForm from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import { mapSingleValueNodeToChoice } from "@saleor/utils/maps";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardSendToCustomer from "../components/GiftCardSendToCustomer/GiftCardSendToCustomer";
import { useGiftCardSettingsQuery } from "../GiftCardSettings/queries";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import GiftCardCreateExpirySelect from "./GiftCardCreateExpirySelect";
import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateDialogFormStyles as useStyles } from "./styles";
import {
  GiftCardCommonFormData,
  GiftCardCreateFormCustomer,
  GiftCardExpiryType
} from "./types";

export interface GiftCardCreateFormData extends GiftCardCommonFormData {
  note: string;
  sendToCustomerSelected: boolean;
  selectedCustomer?: GiftCardCreateFormCustomer;
  channel?: string;
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
  sendToCustomerSelected: false,
  expirySelected: false,
  expiryType: "EXPIRY_PERIOD",
  expiryDate: "",
  expiryPeriodType: TimePeriodTypeEnum.MONTH,
  expiryPeriodAmount: 12,
  requiresActivation: true
};

interface GiftCardCreateDialogFormProps {
  defaultChannel: string;
  channelsChoices: Choices;
  opts: { status: ConfirmButtonTransitionState };
  apiErrors: GiftCardError[];
  onSubmit: (data: GiftCardCreateFormData) => void;
  onClose: () => void;
  channelCurrencies: string[];
}

const GiftCardCreateDialogForm: React.FC<GiftCardCreateDialogFormProps> = ({
  defaultChannel,
  channelsChoices,
  onSubmit,
  opts,
  onClose,
  apiErrors,
  channelCurrencies
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const initialCurrency = channelCurrencies[0];

  const {
    data: settingsData,
    loading: loadingSettings
  } = useGiftCardSettingsQuery();

  const [selectedCustomer, setSelectedCustomer] = useState<
    GiftCardCreateFormCustomer
  >(initialCustomer);

  const handleSubmit = (data: GiftCardCreateFormData) =>
    onSubmit({ ...data, selectedCustomer });

  const getInitialExpirySettingsData = (): Partial<GiftCardCreateFormData> => {
    if (loadingSettings) {
      return {};
    }

    const { expiryType, expiryPeriod } = settingsData?.giftCardSettings;

    if (expiryType === GiftCardSettingsExpiryTypeEnum.NEVER_EXPIRE) {
      return {};
    }

    return {
      expiryType,
      expiryPeriodType: expiryPeriod?.type,
      expiryPeriodAmount: expiryPeriod?.amount
    };
  };

  const { submit, change, data } = useForm(
    {
      ...initialData,
      ...getInitialExpirySettingsData(),
      balanceCurrency: initialCurrency,
      channel: defaultChannel
    },
    handleSubmit
  );

  const formErrors = getFormErrors(
    ["tag", "expiryDate", "customer", "currency", "amount", "balance"],
    apiErrors
  );

  const {
    tag,
    sendToCustomerSelected,
    channel,
    balanceAmount,
    balanceCurrency,
    expirySelected,
    expiryType,
    expiryPeriodAmount,
    expiryPeriodType,
    expiryDate,
    requiresActivation
  } = data;

  const shouldEnableSubmitButton = () => {
    if (!balanceAmount) {
      return false;
    }

    if (expirySelected && expiryType === "EXPIRY_DATE") {
      return !!expiryDate;
    }

    return true;
  };

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
            type: "float",
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
        <GiftCardSendToCustomer
          change={change}
          sendToCustomerSelected={sendToCustomerSelected}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          channel={channel}
          channelsChoices={channelsChoices}
        />
        <Divider />
        <VerticalSpacer />
        <GiftCardCreateExpirySelect
          errors={formErrors}
          change={change}
          expirySelected={expirySelected}
          expiryType={expiryType}
          expiryPeriodAmount={expiryPeriodAmount}
          expiryPeriodType={expiryPeriodType}
          expiryDate={expiryDate}
        />
        <VerticalSpacer />
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
        disabled={!shouldEnableSubmitButton()}
        onConfirm={submit}
        confirmButtonLabel={intl.formatMessage(messages.issueButtonLabel)}
        confirmButtonState={opts?.status}
        onClose={onClose}
      />
    </>
  );
};

export default GiftCardCreateDialogForm;
