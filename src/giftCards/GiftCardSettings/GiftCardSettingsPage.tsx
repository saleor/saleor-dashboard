import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import { GiftCardsSettingsFragment } from "@saleor/fragments/types/GiftCardsSettingsFragment";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import GiftCardSettingsList from "./GiftCardSettingsList";
import { giftCardSettingsMessages } from "./messages";
import { GiftCardSettingsFormData } from "./types";

interface GiftCardSettingsPageProps {
  onBack: () => void;
  onSubmit: (formData: GiftCardSettingsFormData) => void;
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  data?: GiftCardsSettingsFragment;
  errors?: GiftCardSettingsErrorFragment[];
}

const GiftCardSettingsPage: React.FC<GiftCardSettingsPageProps> = ({
  onBack,
  onSubmit,
  disabled,
  saveButtonBarState,
  data,
  errors
}) => {
  const intl = useIntl();

  const initialData: GiftCardSettingsFormData = {
    expiryPeriodActive:
      data?.expiryType === GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD,
    expiryPeriodType: data?.expiryPeriod?.type || TimePeriodTypeEnum.YEAR,
    expiryPeriodAmount: data?.expiryPeriod?.amount || 1
  };

  return (
    <Form initial={initialData} onSubmit={onSubmit}>
      {({ data: formData, submit, hasChanged, change }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.giftCards)}
          </Backlink>
          <PageHeader
            title={intl.formatMessage(giftCardSettingsMessages.title)}
            underline={true}
          />
          <GiftCardSettingsList
            data={formData}
            disabled={disabled}
            errors={errors}
            onChange={change}
          />
          <Savebar
            onCancel={onBack}
            onSubmit={submit}
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
          />
        </Container>
      )}
    </Form>
  );
};

export default GiftCardSettingsPage;
