import { DashboardCard } from "@dashboard/components/Card";
import { Accordion } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface VariantDetailsChannelsAvailabilityCardContainerProps {
  children: React.ReactNode;
  cardTitle?: React.ReactNode;
}

const VariantDetailsChannelsAvailabilityCardContainer = ({
  children,
  cardTitle,
}: VariantDetailsChannelsAvailabilityCardContainerProps) => (
  <>
    <DashboardCard>
      <Accordion>
        <Accordion.Item value="channelListItem">
          {cardTitle || (
            <DashboardCard.Header>
              <DashboardCard.Title>
                <FormattedMessage {...messages.title} />
              </DashboardCard.Title>
            </DashboardCard.Header>
          )}
          <Accordion.Content>{children}</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </DashboardCard>
  </>
);

export default VariantDetailsChannelsAvailabilityCardContainer;
