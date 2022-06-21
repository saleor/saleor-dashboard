import {
  DialogContent,
  Divider,
  TextField,
  Typography,
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import DialogButtons from "@saleor/components/ActionDialog/DialogButtons";
import CardSpacer from "@saleor/components/CardSpacer";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
} from "@saleor/graphql";
import useForm from "@saleor/hooks/useForm";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import GiftCardCreateExpirySelect from "../GiftCardCreateDialog/GiftCardCreateExpirySelect";
import GiftCardCreateMoneyInput from "../GiftCardCreateDialog/GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "../GiftCardCreateDialog/GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "../GiftCardCreateDialog/messages";
import { useGiftCardCreateFormStyles as useStyles } from "../GiftCardCreateDialog/styles";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import {
  GiftCardBulkCreateFormCommonProps,
  GiftCardBulkCreateFormData,
  GiftCardBulkCreateFormErrors,
} from "./types";

export const initialData: GiftCardBulkCreateFormData = {
  tags: [],
  balanceAmount: 1,
  balanceCurrency: null,
  expirySelected: false,
  expiryType: "EXPIRY_PERIOD",
  expiryDate: "",
  expiryPeriodType: TimePeriodTypeEnum.MONTH,
  expiryPeriodAmount: 12,
  requiresActivation: true,
  cardsAmount: 100,
};

interface GiftCardBulkCreateDialogFormProps {
  opts: { status: ConfirmButtonTransitionState };
  formErrors: GiftCardBulkCreateFormErrors;
  onSubmit: (data: GiftCardBulkCreateFormData) => void;
  onClose: () => void;
}

const GiftCardBulkCreateDialogForm: React.FC<GiftCardBulkCreateDialogFormProps> = ({
  onSubmit,
  opts,
  onClose,
  formErrors = {},
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  const {
    data: settingsData,
    loading: loadingSettings,
  } = useGiftCardSettingsQuery();

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
      expiryPeriodAmount: expiryPeriod?.amount,
    };
  };

  const { submit, toggleValue, change, data, set } = useForm(
    {
      ...initialData,
      ...getInitialExpirySettingsData(),
      balanceCurrency: "",
    },
    onSubmit,
  );

  const { tags, requiresActivation, cardsAmount } = data;

  const commonFormProps: GiftCardBulkCreateFormCommonProps = {
    data,
    errors: formErrors,
    toggleValue,
    change,
  };

  return (
    <>
      <DialogContent className={classes.dialogContent}>
        <TextField
          error={!!formErrors?.count}
          name="cardsAmount"
          onChange={change}
          className={classes.fullWidthContainer}
          label={intl.formatMessage(messages.giftCardsAmountLabel)}
          value={cardsAmount}
          helperText={getGiftCardErrorMessage(formErrors?.count, intl)}
        />
        <VerticalSpacer spacing={2} />
        <GiftCardCreateMoneyInput {...commonFormProps} set={set} />
        <VerticalSpacer spacing={2} />
        <GiftCardTagInput
          optional={false}
          error={formErrors?.tags}
          name="tags"
          values={tags}
          toggleChange={toggleValue}
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
        onConfirm={submit}
        confirmButtonLabel={intl.formatMessage(messages.issueButtonLabel)}
        confirmButtonState={opts?.status}
        onClose={onClose}
      />
    </>
  );
};

export default GiftCardBulkCreateDialogForm;
