// @ts-strict-ignore
import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import GiftCardTagInput from "@dashboard/giftCards/components/GiftCardTagInput";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
} from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { TextField } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui-next";
import { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import GiftCardCreateExpirySelect from "../GiftCardCreateDialog/GiftCardCreateExpirySelect";
import { GiftCardCreateMoneyInput } from "../GiftCardCreateDialog/GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "../GiftCardCreateDialog/GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as createMessages } from "../GiftCardCreateDialog/messages";
import { getGiftCardErrorMessage } from "../GiftCardUpdate/messages";
import { giftCardBulkCreateDialogMessages as messages } from "./messages";
import {
  type GiftCardBulkCreateFormCommonProps,
  type GiftCardBulkCreateFormData,
  type GiftCardBulkCreateFormErrors,
} from "./types";

const initialData: GiftCardBulkCreateFormData = {
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

interface UseGiftCardBulkCreateDialogFormProps {
  open: boolean;
  onSubmit: (data: GiftCardBulkCreateFormData) => void;
}

export const useGiftCardBulkCreateDialogForm = ({
  onSubmit,
  open,
}: UseGiftCardBulkCreateDialogFormProps) => {
  const { data: settingsData, loading: loadingSettings } = useGiftCardSettingsQuery();
  const { submit, toggleValue, change, data, set, reset } = useForm(
    {
      ...initialData,
      balanceCurrency: "",
    },
    onSubmit,
  );

  useEffect(() => {
    if (loadingSettings) {
      return;
    }

    const { expiryType, expiryPeriod } = settingsData?.giftCardSettings ?? {};

    if (expiryType === GiftCardSettingsExpiryTypeEnum.NEVER_EXPIRE) {
      return;
    }

    set({
      expiryType,
      expiryPeriodType: expiryPeriod?.type,
      expiryPeriodAmount: expiryPeriod?.amount,
    });
  }, [loadingSettings, set, settingsData?.giftCardSettings]);

  useModalDialogOpen(open, {
    onClose: () => {
      reset();
    },
  });

  return {
    change,
    data,
    loadingSettings,
    set,
    submit,
    toggleValue,
  };
};

interface GiftCardBulkCreateDialogFieldsProps {
  change: GiftCardBulkCreateFormCommonProps["change"];
  data: GiftCardBulkCreateFormData;
  formErrors: GiftCardBulkCreateFormErrors | null;
  set: (data: Partial<GiftCardBulkCreateFormData>) => void;
  toggleValue: GiftCardBulkCreateFormCommonProps["toggleValue"];
}

export const GiftCardBulkCreateDialogFields = ({
  change,
  data,
  formErrors = {},
  set,
  toggleValue,
}: GiftCardBulkCreateDialogFieldsProps) => {
  const intl = useIntl();
  const { tags, requiresActivation, cardsAmount } = data;
  const commonFormProps: GiftCardBulkCreateFormCommonProps = {
    change,
    data,
    errors: formErrors,
    toggleValue,
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Box display="flex" flexDirection="column" gap={3}>
        <ModalSectionHeader>
          <FormattedMessage {...messages.cardsToIssueSection} />
        </ModalSectionHeader>

        <TextField
          error={!!formErrors?.count}
          name="cardsAmount"
          onChange={change}
          fullWidth
          label={intl.formatMessage(createMessages.giftCardsAmountLabel)}
          value={cardsAmount}
          helperText={getGiftCardErrorMessage(formErrors?.count, intl)}
        />

        <GiftCardCreateMoneyInput {...commonFormProps} set={set} />

        <GiftCardTagInput
          optional={false}
          error={formErrors?.tags}
          name="tags"
          values={tags}
          onChange={change}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={3}>
        <ModalSectionHeader>
          <FormattedMessage {...messages.optionsSection} />
        </ModalSectionHeader>

        <GiftCardCreateExpirySelect {...commonFormProps} />

        <GiftCardCreateRequiresActivationSection onChange={change} checked={requiresActivation} />
      </Box>
    </Box>
  );
};

GiftCardBulkCreateDialogFields.displayName = "GiftCardBulkCreateDialogFields";
