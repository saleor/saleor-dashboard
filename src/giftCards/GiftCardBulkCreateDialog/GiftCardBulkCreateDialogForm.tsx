// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import GiftCardTagInput from "@dashboard/giftCards/components/GiftCardTagInput";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
} from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import { Divider, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import GiftCardCreateExpirySelect from "../GiftCardCreateDialog/GiftCardCreateExpirySelect";
import GiftCardCreateMoneyInput from "../GiftCardCreateDialog/GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "../GiftCardCreateDialog/GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "../GiftCardCreateDialog/messages";
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

const GiftCardBulkCreateDialogForm = ({
  onSubmit,
  opts,
  onClose,
  formErrors = {},
}: GiftCardBulkCreateDialogFormProps) => {
  const intl = useIntl();
  const { data: settingsData, loading: loadingSettings } = useGiftCardSettingsQuery();
  const getInitialExpirySettingsData = (): Partial<GiftCardBulkCreateFormData> => {
    if (loadingSettings) {
      return {};
    }

    const { expiryType, expiryPeriod } = settingsData?.giftCardSettings ?? {};

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
      <TextField
        error={!!formErrors?.count}
        name="cardsAmount"
        onChange={change}
        fullWidth
        label={intl.formatMessage(messages.giftCardsAmountLabel)}
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

      <Divider />

      <GiftCardCreateExpirySelect {...commonFormProps} />

      <Divider />

      <GiftCardCreateRequiresActivationSection onChange={change} checked={requiresActivation} />

      <Text>{intl.formatMessage(messages.bulkCreateExplanation)}</Text>

      <DashboardModal.Actions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          variant="primary"
          transitionState={opts?.status}
          type={open ? undefined : "submit"}
          onClick={submit}
        >
          {intl.formatMessage(messages.issueButtonLabel)}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};

export default GiftCardBulkCreateDialogForm;
