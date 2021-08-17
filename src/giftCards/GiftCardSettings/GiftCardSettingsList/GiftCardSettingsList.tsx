import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import FormSpacer from "@saleor/components/FormSpacer";
import Grid from "@saleor/components/Grid";
import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import TimePeriodField from "@saleor/giftCards/components/TimePeriodField";
import { getFormErrors } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  getGiftCardSettingsErrorMessage,
  giftCardSettingsListMessages
} from "../messages";
import { GiftCardSettingsFormData } from "../types";

export interface GiftCardSettingsListProps {
  data: GiftCardSettingsFormData;
  disabled: boolean;
  errors?: GiftCardSettingsErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const GiftCardSettingsList: React.FC<GiftCardSettingsListProps> = ({
  data,
  disabled,
  errors,
  onChange
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["expiryPeriod"], errors);

  return (
    <Grid variant="inverted">
      <div>
        <Typography>
          <FormattedMessage
            {...giftCardSettingsListMessages.expiryDateSectionDescription}
          />
        </Typography>
      </div>
      <Card data-test="giftCardSettings">
        <CardTitle
          title={intl.formatMessage(
            giftCardSettingsListMessages.expiryDateTitle
          )}
        />
        <CardContent>
          <ControlledCheckbox
            name={"expiryPeriodActive" as keyof GiftCardSettingsFormData}
            label={
              <>
                <FormattedMessage
                  {...giftCardSettingsListMessages.setExpirationPeriodTitle}
                />
                <Typography variant="caption">
                  <FormattedMessage
                    {...giftCardSettingsListMessages.setExpirationPeriodDescription}
                  />
                </Typography>
              </>
            }
            checked={data.expiryPeriodActive}
            onChange={onChange}
            disabled={disabled}
            data-test="expiryPeriodActive"
          />
          {data.expiryPeriodActive && (
            <>
              <FormSpacer />
              <TimePeriodField
                isError={!!formErrors?.expiryPeriod}
                helperText={getGiftCardSettingsErrorMessage(
                  formErrors?.expiryPeriod,
                  intl
                )}
                change={onChange}
                periodType={data.expiryPeriodType}
                periodAmount={data.expiryPeriodAmount}
                amountFieldName={
                  "expiryPeriodAmount" as keyof GiftCardSettingsFormData
                }
                typeFieldName={
                  "expiryPeriodType" as keyof GiftCardSettingsFormData
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};
GiftCardSettingsList.displayName = "GiftCardSettingsList";
export default GiftCardSettingsList;
