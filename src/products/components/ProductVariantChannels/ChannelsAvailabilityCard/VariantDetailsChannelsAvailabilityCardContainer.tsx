import { DashboardCard } from "@dashboard/components/Card";
import React from "react";
import { FormattedMessage } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface VariantDetailsChannelsAvailabilityCardContainerProps {
  children: React.ReactNode;
  cardTitle?: React.ReactNode;
}

const VariantDetailsChannelsAvailabilityCardContainer: React.FC<
  VariantDetailsChannelsAvailabilityCardContainerProps
> = ({ children, cardTitle }) => (
  <>
    <DashboardCard>
      {cardTitle || (
        <DashboardCard.Title>
          <FormattedMessage {...messages.title} />
        </DashboardCard.Title>
      )}
      {children}
    </DashboardCard>
  </>
);

export default VariantDetailsChannelsAvailabilityCardContainer;
