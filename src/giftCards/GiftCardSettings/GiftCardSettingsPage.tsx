// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import Form from "@dashboard/components/Form";
import { Grid } from "@dashboard/components/Grid";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  GiftCardSettingsExpiryTypeEnum,
  TimePeriodTypeEnum,
  useGiftCardSettingsQuery,
  useGiftCardSettingsUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { giftCardsListPath } from "../urls";
import GiftCardExpirySettingsCard from "./GiftCardExpirySettingsCard";
import { giftCardExpirySettingsCard as expirySettingsMessages } from "./GiftCardExpirySettingsCard/messages";
import { giftCardSettingsPageMessages as messages } from "./messages";
import { GiftCardSettingsFormData } from "./types";
import { getGiftCardSettingsInputData } from "./utils";

const GiftCardSettingsPage = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { data, loading } = useGiftCardSettingsQuery();
  const settingsData = data?.giftCardSettings;
  const initialData: GiftCardSettingsFormData = {
    expiryPeriodActive: settingsData?.expiryType === GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD,
    expiryPeriodType: settingsData?.expiryPeriod?.type || TimePeriodTypeEnum.YEAR,
    expiryPeriodAmount: settingsData?.expiryPeriod?.amount || 1,
  };
  const [updateGiftCardSettings, updateGiftCardSettingsOpts] = useGiftCardSettingsUpdateMutation(
    {},
  );
  const handleSubmit = (formData: GiftCardSettingsFormData) => {
    updateGiftCardSettings({
      variables: {
        input: getGiftCardSettingsInputData(formData),
      },
    });
  };
  const formLoading = loading || updateGiftCardSettingsOpts?.loading;
  const apiErrors = updateGiftCardSettingsOpts?.data?.giftCardSettingsUpdate?.errors;
  const formErrors = getFormErrors(["expiryPeriod"], apiErrors);

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={giftCardsListPath} title={intl.formatMessage(messages.title)} />
      <DetailPageLayout.Content>
        <Form initial={initialData} onSubmit={handleSubmit}>
          {({ data: formData, submit, change }) => (
            <>
              <Box padding={6} margin="auto" height="100vh">
                <Grid variant="inverted">
                  <div>
                    <Text>
                      <FormattedMessage {...expirySettingsMessages.expiryDateSectionDescription} />
                    </Text>
                  </div>
                  <GiftCardExpirySettingsCard
                    data={formData}
                    disabled={formLoading}
                    onChange={change}
                    errors={formErrors}
                  />
                </Grid>
              </Box>
              <Savebar>
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(giftCardsListPath)} />
                <Savebar.ConfirmButton
                  transitionState={updateGiftCardSettingsOpts?.status}
                  onClick={submit}
                  disabled={formLoading}
                />
              </Savebar>
            </>
          )}
        </Form>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

export default GiftCardSettingsPage;
