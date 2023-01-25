import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import Form from "@dashboard/components/Form";
import { Grid } from "@dashboard/components/Grid";
import Savebar from "@dashboard/components/Savebar";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
  useGiftCardSettingsUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getFormErrors } from "@dashboard/utils/errors";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardsListPath } from "../urls";
import GiftCardExpirySettingsCard from "./GiftCardExpirySettingsCard";
import { giftCardExpirySettingsCard as expirySettingsMessages } from "./GiftCardExpirySettingsCard/messages";
import { giftCardSettingsPageMessages as messages } from "./messages";
import { GiftCardSettingsFormData } from "./types";
import { getGiftCardSettingsInputData } from "./utils";

const GiftCardSettingsPage: React.FC = () => {
  const intl = useIntl();

  const navigate = useNavigator();

  const { data, loading } = useGiftCardSettingsQuery();

  const settingsData = data?.giftCardSettings;

  const initialData: GiftCardSettingsFormData = {
    expiryPeriodActive:
      settingsData?.expiryType === GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD,
    expiryPeriodType:
      settingsData?.expiryPeriod?.type || TimePeriodTypeEnum.YEAR,
    expiryPeriodAmount: settingsData?.expiryPeriod?.amount || 1,
  };

  const [
    updateGiftCardSettings,
    updateGiftCardSettingsOpts,
  ] = useGiftCardSettingsUpdateMutation({});

  const handleSubmit = (formData: GiftCardSettingsFormData) => {
    updateGiftCardSettings({
      variables: {
        input: getGiftCardSettingsInputData(formData),
      },
    });
  };

  const formLoading = loading || updateGiftCardSettingsOpts?.loading;

  const apiErrors =
    updateGiftCardSettingsOpts?.data?.giftCardSettingsUpdate?.errors;

  const formErrors = getFormErrors(["expiryPeriod"], apiErrors);

  return (
    <>
      <TopNav
        href={giftCardsListPath}
        title={intl.formatMessage(messages.title)}
      />
      <Form initial={initialData} onSubmit={handleSubmit}>
        {({ data: formData, submit, change }) => (
          <Grid variant="inverted">
            <div>
              <Typography>
                <FormattedMessage
                  {...expirySettingsMessages.expiryDateSectionDescription}
                />
              </Typography>
            </div>
            <GiftCardExpirySettingsCard
              data={formData}
              disabled={formLoading}
              onChange={change}
              errors={formErrors}
            />
            <Savebar
              onCancel={() => navigate(giftCardsListPath)}
              onSubmit={submit}
              disabled={formLoading}
              state={updateGiftCardSettingsOpts?.status}
            />
          </Grid>
        )}
      </Form>
    </>
  );
};

export default GiftCardSettingsPage;
