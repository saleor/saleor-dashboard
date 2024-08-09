// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import GiftCardSettingsExpirySelect, {
  GiftCardSettingsExpirySelectProps,
} from "@dashboard/giftCards/components/GiftCardSettingsExpirySelect";
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
    <DashboardCard data-test-id="gift-card-settings">
      <DashboardCard.Header>
        <DashboardCard.Title className={classes.cardTitle}>
          {intl.formatMessage(messages.expiryDateTitle)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <GiftCardSettingsExpirySelect
          expiryPeriodActive={data.expiryPeriodActive}
          expiryPeriodType={data.expiryPeriodType}
          expiryPeriodAmount={data.expiryPeriodAmount}
          change={onChange}
          disabled={disabled}
          errors={errors}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

GiftCardExpirySettingsCard.displayName = "GiftCardExpirySettingsCard";
export default GiftCardExpirySettingsCard;
