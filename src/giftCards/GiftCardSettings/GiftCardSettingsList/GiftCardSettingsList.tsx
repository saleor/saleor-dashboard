import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Grid from "@saleor/components/Grid";
import { GiftCardSettingsErrorFragment } from "@saleor/fragments/types/GiftCardSettingsErrorFragment";
import GiftCardSettingsExpirySelect from "@saleor/giftCards/components/GiftCardSettingsExpirySelect";
import { getFormErrors } from "@saleor/utils/errors";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardSettingsFormData } from "../types";
import { giftCardSettingsListMessages } from "./messages";

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
          <GiftCardSettingsExpirySelect
            expiryPeriodActive={data.expiryPeriodActive}
            expiryPeriodType={data.expiryPeriodType}
            expiryPeriodAmount={data.expiryPeriodAmount}
            change={onChange}
            disabled={disabled}
            errors={formErrors}
          />
        </CardContent>
      </Card>
    </Grid>
  );
};
GiftCardSettingsList.displayName = "GiftCardSettingsList";
export default GiftCardSettingsList;
