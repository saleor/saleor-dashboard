import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ControlledCheckbox from "@saleor/components/ControlledCheckbox";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GiftCardSettingsListFormData } from "../types";

export interface GiftCardSettingsListProps {
  data: GiftCardSettingsListFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const GiftCardSettingsList: React.FC<GiftCardSettingsListProps> = ({
  data,
  disabled,
  onChange
}) => {
  const intl = useIntl();

  return (
    <Card data-test="giftCardSettings">
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Expiry date",
          description: "section header"
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name={
            "setGiftCardExpirationPeriod" as keyof GiftCardSettingsListFormData
          }
          label={
            <>
              <FormattedMessage
                defaultMessage="Set gift card expiration period"
                description="checkbox label"
              />
              <Typography variant="caption">
                <FormattedMessage
                  defaultMessage="Expiration date will be automatically set, once gift card is issued"
                  description="checkbox label description"
                />
              </Typography>
            </>
          }
          checked={data.setGiftCardExpirationPeriod}
          onChange={onChange}
          disabled={disabled}
          data-test="setGiftCardExpirationPeriod"
        />
      </CardContent>
    </Card>
  );
};
GiftCardSettingsList.displayName = "GiftCardSettingsList";
export default GiftCardSettingsList;
