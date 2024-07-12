import { DashboardCard } from "@dashboard/components/Card";
import {} from "@material-ui/core";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import GiftCardUpdateInfoCardContent from "./GiftCardUpdateInfoCardContent";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCard: React.FC = () => {
  const intl = useIntl();
  const { loading } = useGiftCardDetails();

  return (
    <DashboardCard>
      <DashboardCard.Title title={intl.formatMessage(messages.title)} />
      <DashboardCard.Content>
        {loading ? <Skeleton /> : <GiftCardUpdateInfoCardContent />}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default GiftCardUpdateInfoCard;
