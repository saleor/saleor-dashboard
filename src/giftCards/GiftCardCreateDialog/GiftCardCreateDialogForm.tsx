import { DialogContent, Divider, TextField } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import {
  GiftCardErrorFragment,
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
} from "@saleor/graphql";
import useForm from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import { getFormErrors } from "@saleor/utils/errors";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import GiftCardSendToCustomer from "../components/GiftCardSendToCustomer/GiftCardSendToCustomer";
import { GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import GiftCardCreateExpirySelect from "./GiftCardCreateExpirySelect";
import GiftCardCreateMoneyInput from "./GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "./GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "./messages";
import { useGiftCardCreateFormStyles as useStyles } from "./styles";
import {
  GiftCardCreateFormCommonProps,
  GiftCardCreateFormCustomer,
} from "./types";

export interface GiftCardCreateFormData extends GiftCardCreateCommonFormData {
  note: string;
  sendToCustomerSelected: boolean;
  selectedCustomer?: GiftCardCreateFormCustomer;
  channelSlug?: string;
}

export const initialData: GiftCardCreateFormData = {
  tags: [],
  balanceAmount: 1,
  balanceCurrency: null,
  note: "",
  sendToCustomerSelected: false,
  expirySelected: false,
  expiryType: "EXPIRY_PERIOD",
  expiryDate: "",
  expiryPeriodType: TimePeriodTypeEnum.MONTH,
  expiryPeriodAmount: 12,
  requiresActivation: true,
};
interface GiftCardCreateDialogFormProps {
  opts: { status: ConfirmButtonTransitionState };
  apiErrors: GiftCardErrorFragment[];
  onSubmit: (data: GiftCardCreateFormData) => void;
  onClose: () => void;
  initialCustomer?: GiftCardCreateFormCustomer | null;
}

const defaultInitialCustomer = { email: "", name: "" };

const GiftCardCreateDialogForm: React.FC<GiftCardCreateDialogFormProps> = ({
  onSubmit,
  opts,
  onClose,
  apiErrors,
  initialCustomer,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    data: settingsData,
    loading: loadingSettings,
  } = useGiftCardSettingsQuery();

  const [selectedCustomer, setSelectedCustomer] = useState<
    GiftCardCreateFormCustomer
  >(initialCustomer || defaultInitialCustomer);

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
      expiryPeriodAmount: expiryPeriod?.amount,
    };
  };

  const { submit, change, toggleValue, data, set } = useForm(
    {
      ...initialData,
      ...getInitialExpirySettingsData(),
      balanceCurrency: "",
      channelSlug: "",
      sendToCustomerSelected: !!initialCustomer,
    },
    handleSubmit,
  );

  const formErrors = getFormErrors(
    ["tags", "expiryDate", "customer", "currency", "amount", "balance"],
    apiErrors,
  );

  const {
    tags,
    sendToCustomerSelected,
    channelSlug,
    balanceAmount,
    expirySelected,
    expiryType,
    expiryDate,
    requiresActivation,
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
    toggleValue,
    change,
  };

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <GiftCardCreateMoneyInput {...commonFormProps} set={set} />
        <CardSpacer />
        <GiftCardTagInput
          error={formErrors?.tags}
          name="tags"
          values={tags}
          toggleChange={toggleValue}
        />
        <CardSpacer />
        <Divider />
        <GiftCardSendToCustomer
          selectedChannelSlug={channelSlug}
          change={change}
          sendToCustomerSelected={sendToCustomerSelected}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          disabled={!!initialCustomer}
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
            messages.noteLabel,
          )} *${intl.formatMessage(commonMessages.optionalField)}`}
        />
        <VerticalSpacer />
        <Label text={intl.formatMessage(messages.noteSubtitle)} />
        <VerticalSpacer spacing={2} />
        <GiftCardCreateRequiresActivationSection
          onChange={change}
          checked={requiresActivation}
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
