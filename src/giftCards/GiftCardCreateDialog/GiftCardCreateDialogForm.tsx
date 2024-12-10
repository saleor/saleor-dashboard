// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import GiftCardTagInput from "@dashboard/giftCards/components/GiftCardTagInput";
import {
  GiftCardErrorFragment,
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
} from "@dashboard/graphql";
import useForm from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Textarea } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import GiftCardSendToCustomer from "../components/GiftCardSendToCustomer/GiftCardSendToCustomer";
import { GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import GiftCardCreateExpirySelect from "./GiftCardCreateExpirySelect";
import GiftCardCreateMoneyInput from "./GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "./GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "./messages";
import { GiftCardCreateFormCommonProps, GiftCardCreateFormCustomer } from "./types";

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

const GiftCardCreateDialogForm = ({
  onSubmit,
  opts,
  onClose,
  apiErrors,
  initialCustomer,
}: GiftCardCreateDialogFormProps) => {
  const intl = useIntl();
  const { data: settingsData, loading: loadingSettings } = useGiftCardSettingsQuery();
  const [selectedCustomer, setSelectedCustomer] = useState<GiftCardCreateFormCustomer>(
    initialCustomer || defaultInitialCustomer,
  );
  const handleSubmit = (data: GiftCardCreateFormData) => onSubmit({ ...data, selectedCustomer });
  const getInitialExpirySettingsData = (): Partial<GiftCardCreateFormData> => {
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
      <GiftCardCreateMoneyInput {...commonFormProps} set={set} />

      <GiftCardTagInput error={formErrors?.tags} name="tags" values={tags} onChange={change} />

      <GiftCardSendToCustomer
        selectedChannelSlug={channelSlug}
        change={change}
        sendToCustomerSelected={sendToCustomerSelected}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        disabled={!!initialCustomer}
      />

      <GiftCardCreateExpirySelect {...commonFormProps} />

      <Box display="grid" gap={2}>
        <Textarea
          data-test-id="note-field"
          name="note"
          onChange={change}
          rows={3}
          width="100%"
          label={`${intl.formatMessage(
            messages.noteLabel,
          )} *${intl.formatMessage(commonMessages.optionalField)}`}
        />

        <Label text={intl.formatMessage(messages.noteSubtitle)} />
      </Box>

      <GiftCardCreateRequiresActivationSection onChange={change} checked={requiresActivation} />

      <DashboardModal.Actions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          data-test-id="submit"
          disabled={!shouldEnableSubmitButton()}
          transitionState={opts?.status}
          onClick={submit}
        >
          {intl.formatMessage(messages.issueButtonLabel)}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};

export default GiftCardCreateDialogForm;
