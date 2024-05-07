// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import GiftCardSettingsExpirySelect, {
  GiftCardSettingsExpirySelectProps,
} from "@dashboard/giftCards/components/GiftCardSettingsExpirySelect";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { GiftCardSettingsFormData } from "../types";
import { giftCardExpirySettingsCard as messages } from "./messages";

export interface GiftCardExpirySettingsCardProps
  extends Pick<GiftCardSettingsExpirySelectProps, "errors"> {
  data: GiftCardSettingsFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const useStyles = makeStyles(
  () => ({
    cardTitle: {
      paddingTop: 0,
    },
  }),
  { name: "GiftCardExpirySettingsCard" },
);
const GiftCardExpirySettingsCard: React.FC<GiftCardExpirySettingsCardProps> = ({
  data,
  disabled,
  errors,
  onChange,
}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card data-test-id="gift-card-settings">
      <CardTitle
        title={intl.formatMessage(messages.expiryDateTitle)}
        className={classes.cardTitle}
      />
      <CardContent>
        <GiftCardSettingsExpirySelect
          expiryPeriodActive={data.expiryPeriodActive}
          expiryPeriodType={data.expiryPeriodType}
          expiryPeriodAmount={data.expiryPeriodAmount}
          change={onChange}
          disabled={disabled}
          errors={errors}
        />
      </CardContent>
    </Card>
  );
};

GiftCardExpirySettingsCard.displayName = "GiftCardExpirySettingsCard";
export default GiftCardExpirySettingsCard;
