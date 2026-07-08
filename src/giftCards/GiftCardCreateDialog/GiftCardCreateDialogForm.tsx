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
import Label from "@dashboard/orders/components/OrderHistory/Label";
import { type getFormErrors } from "@dashboard/utils/errors";
import { Box, Text, Textarea } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardSendToCustomer } from "../components/GiftCardSendToCustomer/GiftCardSendToCustomer";
import { type GiftCardCreateCommonFormData } from "../GiftCardBulkCreateDialog/types";
import GiftCardCreateExpirySelect from "./GiftCardCreateExpirySelect";
import { GiftCardCreateMoneyInput } from "./GiftCardCreateMoneyInput";
import GiftCardCreateRequiresActivationSection from "./GiftCardCreateRequiresActivationSection";
import { giftCardCreateMessages as messages } from "./messages";
import {
  type GiftCardCreateFormCommonProps,
  type GiftCardCreateFormCustomer,
  type GiftCardCreateFormErrors,
} from "./types";

export interface GiftCardCreateFormData extends GiftCardCreateCommonFormData {
  channelSlug?: string;
  note: string;
  sendToCustomerSelected: boolean;
}

export const initialData: GiftCardCreateFormData = {
  tags: [],
  balanceAmount: 1,
  balanceCurrency: null,
  channelSlug: "",
  note: "",
  sendToCustomerSelected: false,
  expirySelected: false,
  expiryType: "EXPIRY_PERIOD",
  expiryDate: "",
  expiryPeriodType: TimePeriodTypeEnum.MONTH,
  expiryPeriodAmount: 12,
  requiresActivation: true,
};

interface UseGiftCardCreateDialogFormProps {
  initialCustomer?: GiftCardCreateFormCustomer | null;
  onSubmit: (data: GiftCardCreateFormData, selectedCustomer: GiftCardCreateFormCustomer) => void;
  open: boolean;
}

const defaultInitialCustomer: GiftCardCreateFormCustomer = { email: "", name: "" };

export const useGiftCardCreateDialogForm = ({
  initialCustomer,
  onSubmit,
  open,
}: UseGiftCardCreateDialogFormProps) => {
  const { data: settingsData, loading: loadingSettings } = useGiftCardSettingsQuery();
  const [selectedCustomer, setSelectedCustomer] = useState<GiftCardCreateFormCustomer>(
    initialCustomer ?? defaultInitialCustomer,
  );
  const { submit, toggleValue, change, data, set, reset } = useForm(
    {
      ...initialData,
      balanceCurrency: "",
    },
    formData => onSubmit(formData, selectedCustomer),
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
      setSelectedCustomer(initialCustomer ?? defaultInitialCustomer);
    },
  });

  const { balanceAmount, expiryDate, expirySelected, expiryType, sendToCustomerSelected } = data;

  const shouldEnableSubmitButton =
    !!balanceAmount &&
    (!expirySelected || expiryType !== "EXPIRY_DATE" || !!expiryDate) &&
    (!sendToCustomerSelected || (!!selectedCustomer.email && !!data.channelSlug));

  return {
    change,
    data,
    loadingSettings,
    selectedCustomer,
    set,
    setSelectedCustomer,
    shouldEnableSubmitButton,
    submit,
    toggleValue,
  };
};

interface GiftCardCreateDialogFieldsProps {
  change: GiftCardCreateFormCommonProps["change"];
  data: GiftCardCreateFormData;
  formErrors: ReturnType<typeof getFormErrors> | null;
  initialCustomer?: GiftCardCreateFormCustomer | null;
  selectedCustomer: GiftCardCreateFormCustomer;
  set: (data: Partial<GiftCardCreateFormData>) => void;
  setSelectedCustomer: (customer: GiftCardCreateFormCustomer) => void;
  toggleValue: GiftCardCreateFormCommonProps["toggleValue"];
}

export const GiftCardCreateDialogFields = ({
  change,
  data,
  formErrors = null,
  initialCustomer,
  selectedCustomer,
  set,
  setSelectedCustomer,
  toggleValue,
}: GiftCardCreateDialogFieldsProps) => {
  const intl = useIntl();
  const { channelSlug, note, requiresActivation, sendToCustomerSelected, tags } = data;
  const commonFormProps: GiftCardCreateFormCommonProps = {
    change,
    data,
    errors: (formErrors ?? {}) as GiftCardCreateFormErrors,
    toggleValue,
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <Box display="flex" flexDirection="column" gap={3}>
        <ModalSectionHeader>
          <FormattedMessage {...messages.detailsSection} />
        </ModalSectionHeader>
        <GiftCardCreateMoneyInput {...commonFormProps} set={set} />
        <GiftCardTagInput
          error={commonFormProps.errors?.tags}
          name="tags"
          values={tags}
          onChange={change}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={3}>
        <ModalSectionHeader>
          <FormattedMessage {...messages.deliverySection} />
        </ModalSectionHeader>
        <GiftCardSendToCustomer
          balanceCurrency={data.balanceCurrency}
          change={change}
          disabled={!!initialCustomer}
          selectedChannelSlug={channelSlug}
          selectedCustomer={selectedCustomer}
          sendToCustomerSelected={sendToCustomerSelected}
          set={set}
          setSelectedCustomer={setSelectedCustomer}
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={3}>
        <ModalSectionHeader>
          <FormattedMessage {...messages.optionsSection} />
        </ModalSectionHeader>
        <Box display="flex" flexDirection="column" gap={4}>
          <GiftCardCreateExpirySelect {...commonFormProps} />
          <Box display="flex" flexDirection="column" gap={1}>
            <Text fontWeight="medium" size={3}>
              <FormattedMessage {...messages.noteLabel} />
            </Text>
            <Textarea
              data-test-id="note-field"
              name="note"
              onChange={change}
              rows={3}
              value={note}
              width="100%"
            />
            <Label text={intl.formatMessage(messages.noteSubtitle)} />
          </Box>
          <GiftCardCreateRequiresActivationSection checked={requiresActivation} onChange={change} />
        </Box>
      </Box>
    </Box>
  );
};
