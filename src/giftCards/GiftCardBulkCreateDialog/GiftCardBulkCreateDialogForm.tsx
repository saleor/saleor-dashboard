import {
  DialogContent,
  Divider,
  TextField,
  Typography
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import useForm from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import Label from "@saleor/orders/components/OrderHistory/Label";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import GiftCardSendToCustomer from "../components/GiftCardSendToCustomer/GiftCardSendToCustomer";
import GiftCardCreateExpirySelect from "../GiftCardCreateDialog/GiftCardCreateExpirySelect";
import GiftCardCreateMoneyInput from "../GiftCardCreateDialog/GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "../GiftCardCreateDialog/GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "../GiftCardCreateDialog/messages";
import { useGiftCardCreateFormStyles as useStyles } from "../GiftCardCreateDialog/styles";
import { useGiftCardSettingsQuery } from "../GiftCardSettings/queries";
import {
  GiftCardBulkCreateFormCommonProps,
  GiftCardBulkCreateFormCustomer,
  GiftCardExpiryType
} from "./types";

export interface GiftCardBulkCreateFormData {
  note: string;
  sendToCustomerSelected: boolean;
  selectedCustomer?: GiftCardBulkCreateFormCustomer;
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

export const initialData: GiftCardBulkCreateFormData = {
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

interface GiftCardBulkCreateDialogFormProps {
  opts: { status: ConfirmButtonTransitionState };
  apiErrors: GiftCardError[];
  onSubmit: (data: GiftCardBulkCreateFormData) => void;
  onClose: () => void;
}

const GiftCardBulkCreateDialogForm: React.FC<GiftCardBulkCreateDialogFormProps> = ({
  onSubmit,
  opts,
  onClose,
  apiErrors = [] // REMOVE
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    data: settingsData,
    loading: loadingSettings
  } = useGiftCardSettingsQuery();

  const [selectedCustomer, setSelectedCustomer] = useState<
    GiftCardBulkCreateFormCustomer
  >(initialCustomer);

  const handleSubmit = (data: GiftCardBulkCreateFormData) =>
    onSubmit({ ...data, selectedCustomer });

  const getInitialExpirySettingsData = (): Partial<GiftCardBulkCreateFormData> => {
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
    ["tag", "expiryDate", "currency", "amount", "balance"],
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

  const commonFormProps: GiftCardBulkCreateFormCommonProps = {
    data,
    errors: formErrors,
    change
  };

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <TextField
          name="cardsAmount"
          onChange={change}
          className={classes.fullWidthContainer}
          label={intl.formatMessage(messages.giftCardsAmountLabel)}
        />
        <VerticalSpacer spacing={2} />
        <GiftCardCreateMoneyInput {...commonFormProps} set={set} />
        <VerticalSpacer spacing={2} />
        <GiftCardTagInput
          error={formErrors?.tag}
          name="tag"
          value={tag}
          change={change}
        />
        <CardSpacer />
        <Divider />
        <VerticalSpacer />
        <GiftCardCreateExpirySelect {...commonFormProps} />
        <VerticalSpacer />
        <Divider />
        <VerticalSpacer spacing={2} />
        <GiftCardCreateRequiresActivationSection
          onChange={change}
          checked={requiresActivation}
        />
        <VerticalSpacer spacing={2} />
        <Typography>
          {intl.formatMessage(messages.bulkCreateExplanation)}
        </Typography>
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

export default GiftCardBulkCreateDialogForm;
