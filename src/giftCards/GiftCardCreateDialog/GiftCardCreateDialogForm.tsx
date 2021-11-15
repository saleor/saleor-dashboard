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
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardSendToCustomer from "../components/GiftCardSendToCustomer/GiftCardSendToCustomer";
import { useGiftCardSettingsQuery } from "../GiftCardSettings/queries";
import GiftCardCreateDialogMoneyInput from "./GiftCardCreateDialogMoneyInput";
import GiftCardCreateExpirySelect from "./GiftCardCreateExpirySelect";
import { giftCardCreateDialogMessages as messages } from "./messages";
import { useGiftCardCreateDialogFormStyles as useStyles } from "./styles";
import {
  GiftCardCreateFormCommonProps,
  GiftCardCreateFormCustomer,
  GiftCardExpiryType
} from "./types";

export interface GiftCardCreateFormData {
  note: string;
  sendToCustomerSelected: boolean;
  selectedCustomer?: GiftCardCreateFormCustomer;
  channelSlug?: string;
  expirySelected: boolean;
  expiryType: GiftCardExpiryType;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  requiresActivation: boolean;
  tag: string;
  balanceAmount: number;
  balanceCurrency: string;
  expiryDate: string;
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

  const { submit, change, data, set } = useForm(
    {
      ...initialData,
      ...getInitialExpirySettingsData(),
      balanceCurrency: "",
      channelSlug: ""
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
    channelSlug,
    balanceAmount,
    expirySelected,
    expiryType,
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

  const commonFormProps: GiftCardCreateFormCommonProps = {
    data,
    errors: formErrors,
    change
  };

  return (
    <>
      <DialogContent>
        <GiftCardCreateDialogMoneyInput {...commonFormProps} set={set} />
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
          selectedChannelSlug={channelSlug}
          change={change}
          sendToCustomerSelected={sendToCustomerSelected}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
        <Divider />
        <VerticalSpacer />
        <GiftCardCreateExpirySelect {...commonFormProps} />
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
