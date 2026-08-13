import { DashboardCard } from "@dashboard/components/Card";
import { Accordion } from "@saleor/macaw-ui-next";
import type * as React from "react";
import { FormattedMessage } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface VariantDetailsChannelsAvailabilityCardContainerProps {
  children: React.ReactNode;
  cardTitle?: React.ReactNode;
  /** Open the channel list on mount — used when the body is an empty placeholder. */
  defaultExpanded?: boolean;
}

const VariantDetailsChannelsAvailabilityCardContainer = ({
  children,
  cardTitle,
  defaultExpanded = false,
}: VariantDetailsChannelsAvailabilityCardContainerProps) => (
  <>
    <DashboardCard>
      <Accordion defaultValue={defaultExpanded ? "channelListItem" : undefined}>
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
