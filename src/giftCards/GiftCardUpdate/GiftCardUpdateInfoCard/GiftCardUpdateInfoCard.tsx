import { DashboardCard } from "@dashboard/components/Card";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import GiftCardUpdateInfoCardContent from "./GiftCardUpdateInfoCardContent";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCard = () => {
  const intl = useIntl();
  const { loading } = useGiftCardDetails();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {loading ? <Skeleton /> : <GiftCardUpdateInfoCardContent />}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default GiftCardUpdateInfoCard;
