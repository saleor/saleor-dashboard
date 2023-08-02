import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import { Card } from "@material-ui/core";
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
    <Card>
      {cardTitle || (
        <CardTitle title={<FormattedMessage {...messages.title} />} />
      )}
      {children}
    </Card>
    <CardSpacer />
  </>
);

export default VariantDetailsChannelsAvailabilityCardContainer;
