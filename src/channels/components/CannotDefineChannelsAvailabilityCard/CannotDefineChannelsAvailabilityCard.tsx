import { Card, CardContent } from "@material-ui/core";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import CardTitle from "../../../components/CardTitle";

const messages = defineMessages({
  title: {
    id: "CT5PAn",
    defaultMessage: "Availability",
    description: "CannotDefineChannelsAvailabilityCard title",
  },
  subtitle: {
    id: "8qL/tV",
    defaultMessage:
      "You will be able to define availability of product after creating variants.",
    description: "CannotDefineChannelsAvailabilityCard subtitle",
  },
});

const CannotDefineChannelsAvailabilityCard: React.FC = () => (
  <Card>
    <CardTitle title={<FormattedMessage {...messages.title} />} />
    <CardContent>
      <FormattedMessage {...messages.subtitle} />
    </CardContent>
  </Card>
);

export default CannotDefineChannelsAvailabilityCard;
